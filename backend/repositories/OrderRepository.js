// backend/repositories/OrderRepository.js
const BaseRepository = require('./BaseRepository');

/**
 * Handles all DB queries related to Orders and Deliveries.
 * SRP: Only responsible for data access — no business logic here.
 * 
 * Schema adaptation notes:
 * - Orders table now holds ONLY commercial/financial data (customer_id, billing, pricing)
 * - Deliveries table holds logistics data (shipping_address, delivery_fee, dates)
 * - total_amount is computed at runtime via the OrdersWithTotal view (BCNF compliance)
 * - user_id → customer_id (references Customers sub-table, not generic Users)
 */
class OrderRepository extends BaseRepository {
    constructor(pool) {
        super(pool);
    }

    /**
     * Creates an order, its delivery, and order items in a single transaction.
     * SRP split: Order INSERT (financial) + Delivery INSERT (logistics) are separate.
     */
    async createOrder(orderData, deliveryData, itemsData) {
        const transaction = this.pool.transaction();
        try {
            await transaction.begin();

            // 1. Insert the Order (commercial/financial concern only)
            const orderReq = transaction.request();
            orderReq.input('customerId', orderData.customerId);
            orderReq.input('billingAddressId', orderData.billingAddressId);
            orderReq.input('subtotal', orderData.subtotal);
            orderReq.input('taxAmount', orderData.taxAmount);
            orderReq.input('discountAmount', orderData.discountAmount);
            orderReq.input('orderNumber', 'ORD-' + Math.floor(100000 + Math.random() * 900000));

            const orderResult = await orderReq.query(`
                INSERT INTO Orders (
                    order_number, customer_id, billing_address_id,
                    subtotal, tax_amount, discount_amount
                ) 
                OUTPUT inserted.order_id, inserted.order_number
                VALUES (
                    @orderNumber, @customerId, @billingAddressId,
                    @subtotal, @taxAmount, @discountAmount
                );
            `);

            const orderId = orderResult.recordset[0].order_id;
            const orderNumber = orderResult.recordset[0].order_number;

            // 2. Insert the Delivery (logistics concern only)
            const deliveryReq = transaction.request();
            deliveryReq.input('orderId', orderId);
            deliveryReq.input('shippingAddressId', deliveryData.shippingAddressId);
            deliveryReq.input('deliveryFee', deliveryData.deliveryFee);

            await deliveryReq.query(`
                INSERT INTO Deliveries (
                    order_id, shipping_address_id, delivery_fee,
                    delivery_status, estimated_delivery_date
                )
                VALUES (
                    @orderId, @shippingAddressId, @deliveryFee,
                    'pending', DATEADD(day, 2, GETDATE())
                );
            `);

            // 3. Insert Order Items
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

                // Reduce inventory
                const invReq = transaction.request();
                invReq.input('qty', item.quantity);
                invReq.input('prodId', item.productId);
                await invReq.query(`
                    UPDATE Inventory
                    SET quantity_in_stock = quantity_in_stock - @qty
                    WHERE product_id = @prodId AND quantity_in_stock >= @qty;
                `);
            }

            // 4. Insert initial status history
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
     * Gets previous orders for a customer.
     * Joins Orders + Deliveries + OrderItems + Products.
     * Total is computed at runtime (no total_amount column in Orders).
     */
    async getUserOrders(customerId) {
        const req = this.pool.request();
        req.input('customerId', customerId);

        const result = await req.query(`
            SELECT 
                o.order_id, o.order_number, o.customer_id, o.subtotal, o.tax_amount, 
                o.discount_amount, o.order_status, o.payment_status, o.created_at,
                d.delivery_fee, d.delivery_status,
                (o.subtotal - o.discount_amount + o.tax_amount + ISNULL(d.delivery_fee, 0)) AS total_amount,
                oi.order_item_id, oi.product_id, oi.quantity, oi.unit_price,
                p.product_name, p.image_url, p.brand
            FROM Orders o
            LEFT JOIN Deliveries d ON o.order_id = d.order_id
            LEFT JOIN OrderItems oi ON o.order_id = oi.order_id
            LEFT JOIN Products p ON oi.product_id = p.product_id
            WHERE o.customer_id = @customerId
            ORDER BY o.created_at DESC
        `);

        return result.recordset;
    }

    /**
     * Gets active orders with their delivery info and status history for tracking.
     * Delivery fields (instructions, dates, status) now come from Deliveries table.
     */
    async getActiveTrackingOrders(customerId) {
        const req = this.pool.request();
        req.input('customerId', customerId);

        const result = await req.query(`
            SELECT 
                o.order_id, o.order_number, o.order_status,
                d.delivery_status, d.delivery_instructions, d.estimated_delivery_date, d.delivery_fee,
                (o.subtotal - o.discount_amount + o.tax_amount + ISNULL(d.delivery_fee, 0)) AS total_amount,
                (SELECT COUNT(*) FROM OrderItems oi WHERE oi.order_id = o.order_id) AS items_count,
                sh.status, sh.notes, sh.created_at as status_time
            FROM Orders o
            LEFT JOIN Deliveries d ON o.order_id = d.order_id
            LEFT JOIN OrderStatusHistory sh ON o.order_id = sh.order_id
            WHERE o.customer_id = @customerId 
              AND o.order_status NOT IN ('cancelled', 'refunded')
              AND (d.delivery_status IS NULL OR d.delivery_status NOT IN ('delivered', 'returned'))
            ORDER BY o.created_at DESC, sh.created_at ASC
        `);

        return result.recordset;
    }
}

module.exports = OrderRepository;
