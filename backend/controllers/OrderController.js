// backend/controllers/OrderController.js

class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }

    async processCheckout(req, res, next) {
        try {
            // For now, we assume user_id = 1 and address_id = 1 (from seed data)
            // In a real app, userId comes from req.user (auth middleware)
            const userId = 1;
            const addressId = 1;
            const { items } = req.body;

            const orderResult = await this.orderService.processCheckout(userId, addressId, items);
            
            res.status(201).json({
                success: true,
                message: 'Order placed successfully',
                data: orderResult
            });
        } catch (error) {
            next(error);
        }
    }

    async getMyOrders(req, res, next) {
        try {
            const userId = 1; // Hardcoded dummy user for now
            const orders = await this.orderService.getUserOrders(userId);
            
            res.json({
                success: true,
                data: orders
            });
        } catch (error) {
            next(error);
        }
    }

    async getTracking(req, res, next) {
        try {
            const userId = 1; // Hardcoded dummy user
            const trackingData = await this.orderService.getTrackingData(userId);

            res.json({
                success: true,
                data: trackingData
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = OrderController;
