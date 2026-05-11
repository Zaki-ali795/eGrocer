// backend/controllers/OrderController.js

class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }

    async processCheckout(req, res, next) {
        try {
            const customerId = req.user?.user_id;
            if (!customerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

            const { items, address, paymentMethod } = req.body;
            
            const orderResult = await this.orderService.processCheckout(
                customerId, address, items, paymentMethod
            );

            res.status(201).json({ success: true, message: 'Order placed successfully', data: orderResult });
        } catch (error) {
            next(error);
        }
    }

    async getMyOrders(req, res, next) {
        try {
            const customerId = req.user?.user_id;
            if (!customerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

            const orders = await this.orderService.getUserOrders(customerId);
            res.json({ success: true, data: orders });
        } catch (error) {
            next(error);
        }
    }

    async getTracking(req, res, next) {
        try {
            const customerId = req.user?.user_id;
            if (!customerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

            const trackingData = await this.orderService.getTrackingData(customerId);
            res.json({ success: true, data: trackingData });
        } catch (error) {
            next(error);
        }
    }

    async requestRefund(req, res, next) {
        try {
            const customerId = req.user?.user_id;
            if (!customerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

            const { orderId, reason } = req.body;
            const result = await this.orderService.requestRefund(orderId, customerId, reason);
            res.json({ success: true, message: 'Refund request submitted', data: result });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = OrderController;
