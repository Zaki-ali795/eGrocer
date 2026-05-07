// backend/services/OrderService.js
const OrderFactory = require('../factories/OrderFactory');

class OrderService {
    constructor(orderRepo, productRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
    }

    /**
     * Processes a checkout request.
     * Business logic: Recalculates total based on DB prices to prevent tampering.
     */
    async processCheckout(userId, addressId, cartItems) {
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
        const totalAmount = subtotal + taxAmount + deliveryFee - discountAmount;

        const orderData = {
            userId: userId,
            shippingAddressId: addressId,
            billingAddressId: addressId,
            subtotal,
            taxAmount,
            deliveryFee,
            discountAmount,
            totalAmount
        };

        const result = await this.orderRepo.createOrder(orderData, processedItems);
        return result;
    }

    /**
     * Gets user's previous orders formatted nicely.
     */
    async getUserOrders(userId) {
        const rawRows = await this.orderRepo.getUserOrders(userId);
        return OrderFactory.createMultipleFromDbRows(rawRows);
    }

    /**
     * Gets active orders formatted for the tracking UI.
     */
    async getTrackingData(userId) {
        const rawRows = await this.orderRepo.getActiveTrackingOrders(userId);
        
        if (!rawRows || rawRows.length === 0) return [];

        const orderMap = new Map();

        // The UI expects these exact steps
        const stepDefinitions = ['pending', 'processing', 'shipped', 'delivered'];
        const stepLabels = ['Order Confirmed', 'Processing', 'Out for Delivery', 'Delivered'];

        rawRows.forEach(row => {
            if (!orderMap.has(row.order_id)) {
                // Initialize the order object
                const estDelivery = row.estimated_delivery_date 
                    ? new Date(row.estimated_delivery_date).toLocaleDateString() + ' ' + new Date(row.estimated_delivery_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                    : 'Pending Estimate';

                orderMap.set(row.order_id, {
                    id: row.order_number,
                    status: row.order_status,
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
                        // Only set the time for the exact step, not the previous ones unless we have them
                        if (i === statusIndex) {
                            order.steps[i].time = displayTime;
                        }
                    }
                }
            }
        });

        // Ensure notifications are sorted latest first
        Array.from(orderMap.values()).forEach(order => {
            order.notifications.reverse();
            
            // Set current step for the progress bar logic if needed
            order.currentStep = order.steps.filter(s => s.completed).length - 1;
            
            // Format status for UI
            const statusMap = {
                'pending': 'Order Confirmed',
                'processing': 'Processing',
                'shipped': 'In Transit',
                'delivered': 'Delivered'
            };
            order.status = statusMap[order.status] || order.status;
        });

        return Array.from(orderMap.values());
    }
}

module.exports = OrderService;
