const { getPool } = require('./config/db');
require('dotenv').config();

(async () => {
    try {
        const pool = await getPool();
        const sellerId = 2;
        console.log(`Testing stats for sellerId: ${sellerId}`);
        
        const result = await pool.request()
            .input('sellerId', sellerId)
            .query(`
                SELECT 
                    ISNULL((SELECT SUM(quantity * unit_price) FROM OrderItems WHERE seller_id = @sellerId), 0) AS total_revenue,
                    (SELECT COUNT(DISTINCT order_id) FROM OrderItems WHERE seller_id = @sellerId) AS total_orders,
                    (SELECT COUNT(*) FROM ProductRequests WHERE request_status = 'open') AS pending_requests,
                    (SELECT COUNT(*) FROM Inventory i INNER JOIN Products p ON i.product_id = p.product_id WHERE p.seller_id = @sellerId AND p.is_active = 1 AND i.quantity_in_stock < 20) AS low_stock_count
            `);
        
        console.log('Stats Result:', result.recordset[0]);
        process.exit(0);
    } catch (err) {
        console.error('Error fetching stats:', err.message);
        process.exit(1);
    }
})();
