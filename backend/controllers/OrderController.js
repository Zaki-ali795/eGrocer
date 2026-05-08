// backend/controllers/OrderController.js

/**
 * HTTP layer for order-related endpoints.
 * SRP: Only handles req/res — all logic delegated to OrderService.
 *
 * Schema adaptation notes:
 * - userId → customerId (references Customers sub-table)
 * - processCheckout now accepts separate billing and shipping address IDs
 *   to support the Orders/Deliveries split.
 */
class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }

    async processCheckout(req, res, next) {
        try {
            // For now, if no auth, we fetch the first available customer/address
            const dummy = await this.orderService.getDummyCustomerAndAddress();
            if (!dummy) throw new Error('No customers found in database.');

            const customerId = dummy.customer_id;
            const billingAddressId = dummy.address_id;
            const shippingAddressId = req.body.shippingAddressId || billingAddressId;
            const { items } = req.body;

            const orderResult = await this.orderService.processCheckout(
                customerId, billingAddressId, shippingAddressId, items
            );
            
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
            const dummy = await this.orderService.getDummyCustomerAndAddress();
            const customerId = dummy ? dummy.customer_id : 1; 
            
            const orders = await this.orderService.getUserOrders(customerId);
            
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
            const dummy = await this.orderService.getDummyCustomerAndAddress();
            const customerId = dummy ? dummy.customer_id : 1;

            const trackingData = await this.orderService.getTrackingData(customerId);

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
