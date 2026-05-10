// backend/services/OrderService.js
const OrderFactory = require('../factories/OrderFactory');

class OrderService {
    constructor(orderRepo, productRepo) {
        this.orderRepo   = orderRepo;
        this.productRepo = productRepo;
    }

    async processCheckout(customerId, address, cartItems, paymentMethod) {
        if (!cartItems || cartItems.length === 0) throw new Error('Cart is empty.');

        let subtotal = 0;
        const processedItems = [];

        for (const item of cartItems) {
            const product = await this.productRepo.getProductById(item.id);
            if (!product) throw new Error(`Product not found: ${item.id}`);

            const activePrice = product.sale_price || product.base_price;
            subtotal += activePrice * item.quantity;
            processedItems.push({
                productId: product.product_id,
                quantity:  item.quantity,
                price:     activePrice,
                sellerId:  product.seller_id || null
            });
        }

        const taxAmount    = subtotal * 0.08;
        const deliveryFee  = subtotal > 5000 ? 0 : 499;
        const discountAmount = 0;

        const estimatedDeliveryDate = new Date();
        estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 2);

        const paymentStrategies = require('../strategies/PaymentStrategy');
        const strategy = paymentStrategies[paymentMethod] || paymentStrategies.cash;
        const { orderStatus, paymentStatus, dbMethod } = strategy.process();

        // Resolve Address ID
        console.log('OrderService: Resolving address for customer:', customerId, 'Address provided:', address);
        let resolvedAddressId = await this.orderRepo.ensureAddress(customerId, address);
        
        if (!resolvedAddressId) {
            console.log('OrderService: No adhoc address, trying default address...');
            resolvedAddressId = await this.orderRepo.getDefaultAddressId(customerId);
        }

        // Hard fallback for development if no address exists at all
        if (!resolvedAddressId) {
            console.warn('OrderService: No address found for user. Falling back to ID 1 for development.');
            resolvedAddressId = 1; 
        }
        
        console.log('OrderService: Resolved Address ID:', resolvedAddressId);

        const orderData = {
            customerId,
            billingAddressId:      resolvedAddressId,
            shippingAddressId:     resolvedAddressId,
            deliveryFee,
            estimatedDeliveryDate,
            subtotal,
            taxAmount,
            discountAmount,
            paymentMethod: dbMethod,
            orderStatus,
            paymentStatus
        };

        return this.orderRepo.createOrder(orderData, processedItems);
    }

    async getUserOrders(customerId) {
        const rawRows = await this.orderRepo.getUserOrders(customerId);
        return OrderFactory.createMultipleFromDbRows(rawRows);
    }

    async getTrackingData(customerId) {
        const rawRows = await this.orderRepo.getActiveTrackingOrders(customerId);
        if (!rawRows || rawRows.length === 0) return [];

        const orderMap       = new Map();
        const stepDefinitions = ['pending', 'confirmed', 'processing', 'dispatched'];
        const stepLabels      = ['Order Placed', 'Confirmed', 'Processing', 'Out for Delivery'];

        rawRows.forEach(row => {
            if (!orderMap.has(row.order_id)) {
                const estDelivery = row.estimated_delivery_date
                    ? new Date(row.estimated_delivery_date).toLocaleDateString() + ' ' +
                      new Date(row.estimated_delivery_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : 'Pending Estimate';

                orderMap.set(row.order_id, {
                    id:                   row.order_number,
                    orderStatus:          row.order_status,
                    deliveryStatus:       row.delivery_status || 'pending',
                    estimatedDelivery:    estDelivery,
                    items:                row.items_count,
                    total:                row.total_amount,
                    deliveryInstructions: row.delivery_instructions || 'None',
                    steps:                stepLabels.map(label => ({ label, time: 'Pending', completed: false })),
                    notifications:        []
                });
            }

            const order = orderMap.get(row.order_id);

            if (row.status) {
                const displayTime = new Date(row.status_time).toLocaleDateString() + ', ' +
                                    new Date(row.status_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                order.notifications.push({ time: displayTime, message: row.notes || `Status: ${row.status}` });

                const statusIndex = stepDefinitions.indexOf(row.status);
                if (statusIndex !== -1) {
                    for (let i = 0; i <= statusIndex; i++) {
                        order.steps[i].completed = true;
                        if (i === statusIndex) order.steps[i].time = displayTime;
                    }
                }
            }

            // Map delivery_status to steps
            const deliveryStepMap = { 'dispatched': 3, 'in_transit': 3, 'delivered': 3 };
            const deliveryIdx = deliveryStepMap[row.delivery_status];
            if (deliveryIdx !== undefined) {
                for (let i = 0; i <= deliveryIdx; i++) order.steps[i].completed = true;
            }
        });

        Array.from(orderMap.values()).forEach(order => {
            order.notifications.reverse();
            order.currentStep = order.steps.filter(s => s.completed).length - 1;

            const statusMap = {
                'pending': 'Order Placed', 'confirmed': 'Confirmed',
                'processing': 'Processing', 'cancelled': 'Cancelled', 'refunded': 'Refunded'
            };
            const deliveryStatusMap = {
                'pending': 'Awaiting Dispatch', 'dispatched': 'Dispatched',
                'in_transit': 'In Transit',     'delivered': 'Delivered',
                'failed': 'Delivery Failed',     'returned': 'Returned'
            };

            order.status = ['confirmed', 'processing'].includes(order.orderStatus)
                ? (deliveryStatusMap[order.deliveryStatus] || order.deliveryStatus)
                : (statusMap[order.orderStatus] || order.orderStatus);
        });

        return Array.from(orderMap.values());
    }

    async getDummyCustomerAndAddress() {
        return this.orderRepo.getDummyCustomerAndAddress();
    }
}

module.exports = OrderService;
