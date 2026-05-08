// backend/services/OrderService.js
const OrderFactory = require('../factories/OrderFactory');

/**
 * Business logic layer for orders.
 * SRP: Handles order processing logic — delegates DB access to repositories.
 * DIP: Depends on repository abstractions injected via constructor.
 *
 * Schema adaptation notes:
 * - Order data (financial) and delivery data (logistics) are now separate concerns.
 * - processCheckout builds two distinct data objects: orderData + deliveryData.
 * - Tracking combines order_status (commercial) + delivery_status (logistics).
 */
class OrderService {
    constructor(orderRepo, productRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
    }

    /**
     * Processes a checkout request.
     * Business logic: Recalculates total based on DB prices to prevent tampering.
     * SRP split: Builds separate orderData (financial) and deliveryData (logistics).
     */
    async processCheckout(customerId, billingAddressId, shippingAddressId, cartItems) {
        if (!cartItems || cartItems.length === 0) {
            throw new Error('Cart is empty.');
        }

        let subtotal = 0;
        const processedItems = [];

        // Verify prices against the database
        for (const item of cartItems) {
            const product = await this.productRepo.getProductById(item.id);
            if (!product) {
                throw new Error(`Product not found: ${item.id}`);
            }

            const activePrice = product.sale_price || product.base_price;
            subtotal += activePrice * item.quantity;

            processedItems.push({
                productId: product.product_id,
                quantity: item.quantity,
                price: activePrice
            });
        }

        const taxAmount = subtotal * 0.08;
        const deliveryFee = subtotal > 5000 ? 0 : 499;
        const discountAmount = subtotal * 0.05; // 5% card discount logic

        // Order data — commercial/financial concern only (goes to Orders table)
        const orderData = {
            customerId,
            billingAddressId,
            subtotal,
            taxAmount,
            discountAmount
        };

        // Delivery data — logistics concern only (goes to Deliveries table)
        const deliveryData = {
            shippingAddressId,
            deliveryFee
        };

        const result = await this.orderRepo.createOrder(orderData, deliveryData, processedItems);
        return result;
    }

    /**
     * Gets user's previous orders formatted nicely.
     */
    async getUserOrders(customerId) {
        const rawRows = await this.orderRepo.getUserOrders(customerId);
        return OrderFactory.createMultipleFromDbRows(rawRows);
    }

    /**
     * Gets active orders formatted for the tracking UI.
     * Now combines order_status (commercial) + delivery_status (logistics).
     */
    async getTrackingData(customerId) {
        const rawRows = await this.orderRepo.getActiveTrackingOrders(customerId);
        
        if (!rawRows || rawRows.length === 0) return [];

        const orderMap = new Map();

        // Steps now reflect both order and delivery lifecycle
        const stepDefinitions = ['pending', 'confirmed', 'dispatched', 'delivered'];
        const stepLabels = ['Order Confirmed', 'Processing', 'Out for Delivery', 'Delivered'];

        rawRows.forEach(row => {
            if (!orderMap.has(row.order_id)) {
                const estDelivery = row.estimated_delivery_date 
                    ? new Date(row.estimated_delivery_date).toLocaleDateString() + ' ' + new Date(row.estimated_delivery_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                    : 'Pending Estimate';

                orderMap.set(row.order_id, {
                    id: row.order_number,
                    orderStatus: row.order_status,
                    deliveryStatus: row.delivery_status || 'pending',
                    estimatedDelivery: estDelivery,
                    items: row.items_count,
                    total: row.total_amount,
                    deliveryInstructions: row.delivery_instructions || 'None',
                    steps: stepLabels.map(label => ({ label, time: 'Pending', completed: false })),
                    notifications: []
                });
            }

            const order = orderMap.get(row.order_id);
            
            // Process status history into notifications and steps
            if (row.status) {
                const statusTime = new Date(row.status_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                const statusDate = new Date(row.status_time).toLocaleDateString();
                const displayTime = statusDate + ', ' + statusTime;

                // Add to notifications
                order.notifications.push({
                    time: displayTime,
                    message: row.notes || `Order status updated to ${row.status}`
                });

                // Mark steps as completed up to this status
                const statusIndex = stepDefinitions.indexOf(row.status);
                if (statusIndex !== -1) {
                    for (let i = 0; i <= statusIndex; i++) {
                        order.steps[i].completed = true;
                        if (i === statusIndex) {
                            order.steps[i].time = displayTime;
                        }
                    }
                }
            }

            // Also check delivery_status for logistics steps
            const deliveryStepMap = { 'dispatched': 2, 'in_transit': 2, 'delivered': 3 };
            const deliveryIdx = deliveryStepMap[row.delivery_status];
            if (deliveryIdx !== undefined) {
                for (let i = 0; i <= deliveryIdx; i++) {
                    order.steps[i].completed = true;
                }
            }
        });

        // Format for UI
        Array.from(orderMap.values()).forEach(order => {
            order.notifications.reverse();
            order.currentStep = order.steps.filter(s => s.completed).length - 1;
            
            // Combined status display
            const statusMap = {
                'pending': 'Order Confirmed',
                'confirmed': 'Confirmed',
                'processing': 'Processing',
                'cancelled': 'Cancelled',
                'refunded': 'Refunded'
            };
            const deliveryStatusMap = {
                'pending': 'Awaiting Dispatch',
                'dispatched': 'Dispatched',
                'in_transit': 'In Transit',
                'delivered': 'Delivered',
                'failed': 'Delivery Failed',
                'returned': 'Returned'
            };
            
            // Show delivery status if order is confirmed/processing
            if (['confirmed', 'processing'].includes(order.orderStatus)) {
                order.status = deliveryStatusMap[order.deliveryStatus] || order.deliveryStatus;
            } else {
                order.status = statusMap[order.orderStatus] || order.orderStatus;
            }
        });

        return Array.from(orderMap.values());
    }
}

module.exports = OrderService;
