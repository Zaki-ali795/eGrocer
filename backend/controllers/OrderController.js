// backend/controllers/OrderController.js

class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }

    async processCheckout(req, res, next) {
        try {
            const dummy = await this.orderService.getDummyCustomerAndAddress();
            if (!dummy) throw new Error('No customers found in database.');

            const customerId      = req.user?.user_id || dummy.customer_id;
            const { items, shippingAddressId, billingAddressId, addressId, paymentMethod } = req.body;
            const shippingAddr    = shippingAddressId || addressId || dummy.address_id;
            const billingAddr     = billingAddressId  || addressId || dummy.address_id;

            const orderResult = await this.orderService.processCheckout(
                customerId, shippingAddr, billingAddr, items, paymentMethod
            );

            res.status(201).json({ success: true, message: 'Order placed successfully', data: orderResult });
        } catch (error) {
            next(error);
        }
    }

    async getMyOrders(req, res, next) {
        try {
            const dummy      = await this.orderService.getDummyCustomerAndAddress();
            const customerId = req.user?.user_id || (dummy ? dummy.customer_id : 3);
            const orders     = await this.orderService.getUserOrders(customerId);
            res.json({ success: true, data: orders });
        } catch (error) {
            next(error);
        }
    }

    async getTracking(req, res, next) {
        try {
            const dummy        = await this.orderService.getDummyCustomerAndAddress();
            const customerId   = req.user?.user_id || (dummy ? dummy.customer_id : 3);
            const trackingData = await this.orderService.getTrackingData(customerId);
            res.json({ success: true, data: trackingData });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = OrderController;
