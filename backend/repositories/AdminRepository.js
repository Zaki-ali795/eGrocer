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
}

module.exports = AdminRepository;
