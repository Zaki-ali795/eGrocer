// backend/repositories/OrderRepository.js
const BaseRepository = require('./BaseRepository');

class OrderRepository extends BaseRepository {
    constructor(pool) {
        super(pool);
    }

    async createOrder(orderData, itemsData) {
        const transaction = this.pool.transaction();
        try {
            await transaction.begin();

            // 1. Insert Order (commercial/financial concern only)
            const orderReq = transaction.request();
            orderReq.input('customerId',        orderData.customerId);
            orderReq.input('billingAddressId',  orderData.billingAddressId);
            orderReq.input('promoId',           orderData.promoId || null);
            orderReq.input('subtotal',          orderData.subtotal);
            orderReq.input('taxAmount',         orderData.taxAmount);
            orderReq.input('discountAmount',    orderData.discountAmount);
            orderReq.input('paymentMethod',     orderData.paymentMethod || 'cash');
            orderReq.input('orderStatus',       orderData.orderStatus);
            orderReq.input('paymentStatus',     orderData.paymentStatus);
            orderReq.input('orderNumber',       'ORD-' + Math.floor(100000 + Math.random() * 900000));

            const orderResult = await orderReq.query(`
                INSERT INTO Orders (
                    order_number, customer_id, billing_address_id, promo_id,
                    subtotal, tax_amount, discount_amount, payment_method,
                    order_status, payment_status
                )
                OUTPUT inserted.order_id, inserted.order_number
                VALUES (
                    @orderNumber, @customerId, @billingAddressId, @promoId,
                    @subtotal, @taxAmount, @discountAmount, @paymentMethod,
                    @orderStatus, @paymentStatus
                );
            `);

            const orderId     = orderResult.recordset[0].order_id;
            const orderNumber = orderResult.recordset[0].order_number;

            // 2. Insert Delivery (logistics concern only)
            const deliveryReq = transaction.request();
            deliveryReq.input('orderId',               orderId);
            deliveryReq.input('shippingAddressId',     orderData.shippingAddressId);
            deliveryReq.input('deliveryFee',           orderData.deliveryFee);
            deliveryReq.input('estimatedDeliveryDate', orderData.estimatedDeliveryDate || null);

            await deliveryReq.query(`
                INSERT INTO Deliveries (order_id, shipping_address_id, delivery_fee, estimated_delivery_date)
                VALUES (@orderId, @shippingAddressId, @deliveryFee, @estimatedDeliveryDate);
            `);

            // 3. Insert Order Items
            for (const item of itemsData) {
                const itemReq = transaction.request();
                itemReq.input('orderId',   orderId);
                itemReq.input('productId', item.productId);
                itemReq.input('sellerId',  item.sellerId || null);
                itemReq.input('quantity',  item.quantity);
                itemReq.input('unitPrice', item.price);

                await itemReq.query(`
                    INSERT INTO OrderItems (order_id, product_id, seller_id, quantity, unit_price)
                    VALUES (@orderId, @productId, @sellerId, @quantity, @unitPrice);
                `);

                const invReq = transaction.request();
                invReq.input('qty',    item.quantity);
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

            // 5. Create Notifications for Sellers
            const uniqueSellers = [...new Set(itemsData.map(i => i.sellerId).filter(id => id != null))];
            for (const sellerId of uniqueSellers) {
                const notifyReq = transaction.request();
                notifyReq.input('sellerId', sellerId);
                notifyReq.input('title',    'New Order Received');
                notifyReq.input('message',  `You have a new order: ${orderNumber}`);
                notifyReq.input('refId',    orderId);

                await notifyReq.query(`
                    INSERT INTO Notifications (user_id, notification_type, title, message, reference_id, is_read)
                    VALUES (@sellerId, 'order', @title, @message, @refId, 0)
                `);
            }

            await transaction.commit();
            return { orderId, orderNumber };
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

    async getUserOrders(customerId) {
        const req = this.pool.request();
        req.input('customerId', customerId);

        const result = await req.query(`
            SELECT
                owt.order_id, owt.order_number, owt.customer_id,
                owt.subtotal, owt.tax_amount, owt.discount_amount,
                owt.total_delivery_fee, owt.total_amount,
                owt.order_status, owt.payment_status, owt.payment_method, owt.created_at,
                d.delivery_fee, d.delivery_status, d.estimated_delivery_date, d.actual_delivery_date,
                oi.order_item_id, oi.product_id, oi.quantity, oi.unit_price,
                p.product_name, p.image_url, p.brand
            FROM OrdersWithTotal owt
            LEFT JOIN Deliveries d ON owt.order_id = d.order_id
            LEFT JOIN OrderItems oi ON owt.order_id = oi.order_id
            LEFT JOIN Products p ON oi.product_id = p.product_id
            WHERE owt.customer_id = @customerId
            ORDER BY owt.created_at DESC
        `);

        return result.recordset;
    }

    async getActiveTrackingOrders(customerId) {
        const req = this.pool.request();
        req.input('customerId', customerId);

        const result = await req.query(`
            SELECT
                owt.order_id, owt.order_number, owt.order_status, owt.total_amount,
                d.delivery_instructions, d.estimated_delivery_date, d.delivery_status, d.delivery_fee,
                (SELECT COUNT(*) FROM OrderItems oi WHERE oi.order_id = owt.order_id) AS items_count,
                sh.status, sh.notes, sh.created_at AS status_time
            FROM OrdersWithTotal owt
            LEFT JOIN Deliveries d ON owt.order_id = d.order_id
            LEFT JOIN OrderStatusHistory sh ON owt.order_id = sh.order_id
            WHERE owt.customer_id = @customerId
              AND owt.order_status NOT IN ('cancelled', 'refunded')
              AND (d.delivery_status IS NULL OR d.delivery_status NOT IN ('delivered', 'returned'))
            ORDER BY owt.created_at DESC, sh.created_at ASC
        `);

        return result.recordset;
    }

    async getDummyCustomerAndAddress() {
        const req    = this.pool.request();
        const result = await req.query(`
            SELECT TOP 1
                c.customer_id,
                (SELECT TOP 1 address_id FROM Addresses WHERE user_id = c.customer_id) AS address_id
            FROM Customers c
            ORDER BY c.customer_id ASC
        `);
        return result.recordset[0] || null;
    }

    async getDefaultAddressId(userId) {
        const req = this.pool.request();
        req.input('userId', userId);
        const result = await req.query(`
            SELECT TOP 1 address_id 
            FROM Addresses 
            WHERE user_id = @userId 
            ORDER BY is_default DESC, created_at DESC
        `);
        return result.recordset[0]?.address_id || null;
    }

    async ensureAddress(userId, addressData) {
        if (!addressData || !addressData.addressLine1) return null;

        const req = this.pool.request();
        req.input('userId', userId);
        req.input('addr1',  addressData.addressLine1);
        req.input('city',   addressData.city);
        req.input('state',  addressData.state);

        // Try to find existing
        const check = await req.query(`
            SELECT TOP 1 address_id FROM Addresses 
            WHERE user_id = @userId AND address_line1 = @addr1 AND city = @city
        `);

        if (check.recordset.length > 0) return check.recordset[0].address_id;

        // Otherwise create new
        const result = await req.query(`
            INSERT INTO Addresses (user_id, address_type, full_name, phone, address_line1, city, state, postal_code, is_default)
            OUTPUT inserted.address_id
            VALUES (@userId, 'home', (SELECT first_name + ' ' + last_name FROM Users WHERE user_id = @userId), 
                    (SELECT phone FROM Users WHERE user_id = @userId), @addr1, @city, @state, '00000', 0);
        `);
        return result.recordset[0].address_id;
    }
}

module.exports = OrderRepository;
