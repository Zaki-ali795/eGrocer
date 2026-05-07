// backend/repositories/OrderRepository.js
const BaseRepository = require('./BaseRepository');

class OrderRepository extends BaseRepository {
    constructor(pool) {
        super(pool);
    }

    /**
     * Creates an order and its items in a transaction.
     * SRP: Responsible only for executing the SQL to persist an order.
     */
    async createOrder(orderData, itemsData) {
        const transaction = this.pool.transaction();
        try {
            await transaction.begin();

            const orderReq = transaction.request();
            orderReq.input('userId', orderData.userId);
            orderReq.input('shippingAddressId', orderData.shippingAddressId);
            orderReq.input('billingAddressId', orderData.billingAddressId);
            orderReq.input('subtotal', orderData.subtotal);
            orderReq.input('taxAmount', orderData.taxAmount);
            orderReq.input('deliveryFee', orderData.deliveryFee);
            orderReq.input('discountAmount', orderData.discountAmount);
            orderReq.input('totalAmount', orderData.totalAmount);
            orderReq.input('orderNumber', 'ORD-' + Math.floor(100000 + Math.random() * 900000));

            const orderResult = await orderReq.query(`
                INSERT INTO Orders (
                    order_number, user_id, shipping_address_id, billing_address_id,
                    subtotal, tax_amount, delivery_fee, discount_amount, total_amount
                ) 
                OUTPUT inserted.order_id, inserted.order_number
                VALUES (
                    @orderNumber, @userId, @shippingAddressId, @billingAddressId,
                    @subtotal, @taxAmount, @deliveryFee, @discountAmount, @totalAmount
                );
            `);

            const orderId = orderResult.recordset[0].order_id;
            const orderNumber = orderResult.recordset[0].order_number;

            for (const item of itemsData) {
                const itemReq = transaction.request();
                itemReq.input('orderId', orderId);
                itemReq.input('productId', item.productId);
                itemReq.input('quantity', item.quantity);
                itemReq.input('unitPrice', item.price);

                await itemReq.query(`
                    INSERT INTO OrderItems (order_id, product_id, quantity, unit_price)
                    VALUES (@orderId, @productId, @quantity, @unitPrice);
                `);

                // Optional: Reduce inventory
                const invReq = transaction.request();
                invReq.input('qty', item.quantity);
                invReq.input('prodId', item.productId);
                await invReq.query(`
                    UPDATE Inventory
                    SET quantity_in_stock = quantity_in_stock - @qty
                    WHERE product_id = @prodId AND quantity_in_stock >= @qty;
                `);
            }

            // Insert initial status history
            const statusReq = transaction.request();
            statusReq.input('orderId', orderId);
            await statusReq.query(`
                INSERT INTO OrderStatusHistory (order_id, status, notes)
                VALUES (@orderId, 'pending', 'Order placed successfully');
            `);

            await transaction.commit();
            return { orderId, orderNumber };
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

    /**
     * Gets previous orders for a user.
     * Joins Orders, OrderItems, and Products.
     */
    async getUserOrders(userId) {
        const req = this.pool.request();
        req.input('userId', userId);

        const result = await req.query(`
            SELECT 
                o.order_id, o.order_number, o.user_id, o.subtotal, o.tax_amount, 
                o.delivery_fee, o.discount_amount, o.total_amount, o.order_status, 
                o.payment_status, o.created_at,
                oi.order_item_id, oi.product_id, oi.quantity, oi.unit_price,
                p.product_name, p.image_url, p.brand
            FROM Orders o
            LEFT JOIN OrderItems oi ON o.order_id = oi.order_id
            LEFT JOIN Products p ON oi.product_id = p.product_id
            WHERE o.user_id = @userId
            ORDER BY o.created_at DESC
        `);

        return result.recordset;
    }

    /**
     * Gets active orders with their status history for tracking.
     */
    async getActiveTrackingOrders(userId) {
        const req = this.pool.request();
        req.input('userId', userId);

        const result = await req.query(`
            SELECT 
                o.order_id, o.order_number, o.order_status, o.total_amount, o.delivery_instructions, o.estimated_delivery_date,
                (SELECT COUNT(*) FROM OrderItems oi WHERE oi.order_id = o.order_id) AS items_count,
                sh.status, sh.notes, sh.created_at as status_time
            FROM Orders o
            LEFT JOIN OrderStatusHistory sh ON o.order_id = sh.order_id
            WHERE o.user_id = @userId AND o.order_status NOT IN ('delivered', 'cancelled', 'refunded')
            ORDER BY o.created_at DESC, sh.created_at ASC
        `);

        return result.recordset;
    }
}

module.exports = OrderRepository;
