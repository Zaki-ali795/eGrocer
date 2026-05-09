// repositories/AdminRepository.js
const BaseRepository = require('./BaseRepository');

class AdminRepository extends BaseRepository {
    constructor(pool) {
        super(pool);
    }

    async getPlatformStats() {
        const stats = await this.pool.request().query(`
            SELECT 
                (SELECT COUNT(*) FROM Users WHERE role = 'customer') as customer_count,
                (SELECT COUNT(*) FROM Sellers) as seller_count,
                (SELECT COUNT(*) FROM Orders WHERE CAST(created_at AS DATE) = CAST(GETDATE() AS DATE)) as today_orders,
                (SELECT COUNT(*) FROM Orders WHERE order_status = 'processing' AND CAST(created_at AS DATE) = CAST(GETDATE() AS DATE)) as today_processing,
                (SELECT COUNT(*) FROM Orders WHERE order_status = 'delivered' AND CAST(created_at AS DATE) = CAST(GETDATE() AS DATE)) as today_delivered,
                ISNULL((SELECT SUM(total_amount) FROM Orders WHERE created_at >= DATEADD(month, DATEDIFF(month, 0, GETDATE()), 0)), 0) as monthly_revenue,
                (SELECT COUNT(*) FROM FlashDeals WHERE is_active = 1 AND end_datetime > GETDATE()) as active_flash_deals,
                (SELECT COUNT(*) FROM Inventory i INNER JOIN Products p ON i.product_id = p.product_id WHERE i.quantity_in_stock < 20 AND p.is_active = 1) as low_stock_count,
                (SELECT COUNT(*) FROM ProductRequests WHERE request_status = 'open') as pending_refunds_count -- Placeholder logic for refunds if not in schema
        `);
        return stats.recordset[0];
    }

    async getRevenueHistory() {
        const result = await this.pool.request().query(`
            SELECT TOP 7
                FORMAT(created_at, 'MMM') as name,
                SUM(total_amount) as revenue,
                COUNT(order_id) as orders
            FROM Orders
            WHERE created_at >= DATEADD(month, -7, GETDATE())
            GROUP BY FORMAT(created_at, 'MMM'), MONTH(created_at), YEAR(created_at)
            ORDER BY YEAR(created_at) ASC, MONTH(created_at) ASC
        `);
        return result.recordset;
    }

    async getTopCategories() {
        const result = await this.pool.request().query(`
            SELECT TOP 5
                c.category_name as name,
                SUM(oi.quantity * oi.unit_price) as sales
            FROM OrderItems oi
            INNER JOIN Products p ON oi.product_id = p.product_id
            INNER JOIN Categories c ON p.category_id = c.category_id
            GROUP BY c.category_name
            ORDER BY sales DESC
        `);
        return result.recordset;
    }

    async getRecentActivity() {
        // Combined activity from various tables
        const result = await this.pool.request().query(`
            SELECT TOP 5 * FROM (
                SELECT 'order' as type, 'New order #' + CAST(order_id AS VARCHAR) + ' received' as message, created_at as time FROM Orders
                UNION ALL
                SELECT 'user' as type, 'New seller registration: ' + store_name as message, created_at as time FROM Sellers
                UNION ALL
                SELECT 'inventory' as type, 'Low stock alert: ' + product_name as message, p.created_at as time 
                FROM Products p INNER JOIN Inventory i ON p.product_id = i.product_id WHERE i.quantity_in_stock < 10
            ) a
            ORDER BY time DESC
        `);
        return result.recordset;
    }

    /**
     * Returns all customers and sellers with their activity metrics.
     * Customers get order_count; Sellers get total_revenue from OrderItems.
     */
    async getAllUsers() {
        const result = await this.pool.request().query(`
            SELECT * FROM (
                -- Customers with order count
                SELECT
                    'U' + CAST(u.user_id AS VARCHAR) AS id,
                    u.first_name + ' ' + u.last_name AS name,
                    u.email,
                    'customer' AS type,
                    CASE WHEN u.is_active = 1 THEN 'active' ELSE 'inactive' END AS status,
                    u.created_at AS joined,
                    ISNULL(oc.order_count, 0) AS orders,
                    NULL AS revenue
                FROM Users u
                INNER JOIN Customers c ON u.user_id = c.customer_id
                LEFT JOIN (
                    SELECT customer_id, COUNT(*) AS order_count
                    FROM Orders
                    GROUP BY customer_id
                ) oc ON c.customer_id = oc.customer_id

                UNION ALL

                -- Sellers with revenue
                SELECT
                    'U' + CAST(u.user_id AS VARCHAR) AS id,
                    s.store_name AS name,
                    u.email,
                    'seller' AS type,
                    CASE WHEN u.is_active = 1 THEN 'active' ELSE 'inactive' END AS status,
                    u.created_at AS joined,
                    NULL AS orders,
                    ISNULL(sr.total_revenue, 0) AS revenue
                FROM Users u
                INNER JOIN Sellers s ON u.user_id = s.seller_id
                LEFT JOIN (
                    SELECT seller_id, SUM(quantity * unit_price) AS total_revenue
                    FROM OrderItems
                    GROUP BY seller_id
                ) sr ON s.seller_id = sr.seller_id
            ) combined
            ORDER BY joined DESC
        `);
        return result.recordset;
    }

    /**
     * Returns aggregate user stats for the KPI cards.
     */
    async getUserStats() {
        const result = await this.pool.request().query(`
            SELECT
                (SELECT COUNT(*) FROM Customers) AS customers,
                (SELECT COUNT(*) FROM Sellers) AS sellers,
                (SELECT COUNT(*) FROM Users WHERE is_active = 1 AND user_type IN ('customer', 'seller')) AS active
        `);
        return result.recordset[0];
    }

    async getAllCategories() {
        const result = await this.pool.request().query(`
            SELECT 
                category_id as id,
                category_name as name,
                description,
                (SELECT COUNT(*) FROM Products p WHERE p.category_id = c.category_id) as productCount,
                CASE WHEN is_active = 1 THEN 'active' ELSE 'inactive' END as status,
                image_url as image
            FROM Categories c
            ORDER BY category_name
        `);
        return result.recordset;
    }

    async getAllProducts() {
        const result = await this.pool.request().query(`
            SELECT 
                p.product_id as id,
                p.product_name as name,
                c.category_name as category,
                p.brand,
                p.base_price as price,
                i.quantity_in_stock as stock,
                CASE WHEN p.is_active = 1 THEN 'active' ELSE 'inactive' END as status,
                p.image_url as image
            FROM Products p
            INNER JOIN Categories c ON p.category_id = c.category_id
            LEFT JOIN Inventory i ON p.product_id = i.product_id
            ORDER BY p.created_at DESC
        `);
        return result.recordset;
    }

    async getAllOrders() {
        const result = await this.pool.request().query(`
            SELECT 
                o.order_id as id,
                o.order_number as orderNumber,
                u.first_name + ' ' + u.last_name as customer,
                (SELECT COUNT(*) FROM OrderItems oi WHERE oi.order_id = o.order_id) as items,
                o.subtotal - o.discount_amount + o.tax_amount as total,
                o.created_at as date,
                o.order_status as status
            FROM Orders o
            INNER JOIN Users u ON o.customer_id = u.user_id
            ORDER BY o.created_at DESC
        `);
        return result.recordset;
    }

    async getAllFlashDeals() {
        const result = await this.pool.request().query(`
            SELECT 
                fd.deal_id as id,
                p.product_name as product,
                p.base_price as originalPrice,
                fd.discount_percentage as discount,
                fd.start_datetime as startTime,
                fd.end_datetime as endTime,
                CASE WHEN fd.is_active = 1 AND fd.end_datetime > GETDATE() THEN 'active' ELSE 'inactive' END as status,
                fd.sold_quantity as sold,
                fd.max_quantity as max
            FROM FlashDeals fd
            INNER JOIN Products p ON fd.product_id = p.product_id
            ORDER BY fd.created_at DESC
        `);
        return result.recordset;
    }

    async getInventoryData() {
        const result = await this.pool.request().query(`
            SELECT 
                p.product_id as id,
                p.product_name as name,
                i.quantity_in_stock as stock,
                i.reorder_level as reorderLevel,
                CASE WHEN p.is_active = 1 THEN 'active' ELSE 'inactive' END as status
            FROM Products p
            LEFT JOIN Inventory i ON p.product_id = i.product_id
            ORDER BY i.quantity_in_stock ASC
        `);
        return result.recordset;
    }

    async getAllPromotions() {
        const result = await this.pool.request().query(`
            SELECT 
                promo_id as id,
                code,
                discount_type as type,
                discount_value as value,
                min_order_amount as minOrder,
                used_count as usage,
                usage_limit as limit,
                end_date as expiry,
                CASE WHEN is_active = 1 AND end_date > GETDATE() THEN 'active' ELSE 'inactive' END as status
            FROM PromoCodes
            ORDER BY created_at DESC
        `);
        return result.recordset;
    }

    async getAllPayments() {
        const result = await this.pool.request().query(`
            SELECT 
                pt.payment_id as id,
                o.order_number as orderId,
                pt.amount,
                pt.gateway as method,
                pt.status,
                pt.created_at as date
            FROM PaymentTransactions pt
            INNER JOIN Orders o ON pt.order_id = o.order_id
            ORDER BY pt.created_at DESC
        `);
        return result.recordset;
    }

    async getAllProductRequests() {
        const result = await this.pool.request().query(`
            SELECT 
                pr.request_id as id,
                u.first_name + ' ' + u.last_name as customer,
                pr.product_name as product,
                pr.max_budget as budget,
                pr.request_status as status,
                pr.created_at as date,
                (SELECT COUNT(*) FROM ProductRequestBids prb WHERE prb.request_id = pr.request_id) as bids
            FROM ProductRequests pr
            INNER JOIN Users u ON pr.customer_id = u.user_id
            ORDER BY pr.created_at DESC
        `);
        return result.recordset;
    }
}

module.exports = AdminRepository;
