// repositories/AdminRepository.js
const BaseRepository = require('./BaseRepository');
const bcrypt = require('bcryptjs');

class AdminRepository extends BaseRepository {
    constructor(pool) {
        super(pool);
    }

    async getPlatformStats() {
        const stats = await this.pool.request().query(`
            SELECT 
                (SELECT COUNT(*) FROM Users WHERE user_type = 'customer') as customer_count,
                (SELECT COUNT(*) FROM Sellers) as seller_count,
                (SELECT COUNT(*) FROM Orders WHERE CAST(created_at AS DATE) = CAST(GETDATE() AS DATE) AND order_status NOT IN ('cancelled', 'refunded')) as today_orders,
                (SELECT COUNT(*) FROM Orders WHERE order_status = 'processing' AND CAST(created_at AS DATE) = CAST(GETDATE() AS DATE)) as today_processing,
                (SELECT COUNT(*) FROM Orders WHERE order_status = 'delivered' AND CAST(created_at AS DATE) = CAST(GETDATE() AS DATE)) as today_delivered,
                ISNULL((SELECT SUM(subtotal - discount_amount + tax_amount) FROM Orders WHERE created_at >= DATEADD(month, DATEDIFF(month, 0, GETDATE()), 0) AND order_status NOT IN ('cancelled', 'refunded')), 0) as monthly_revenue,
                (SELECT COUNT(*) FROM FlashDeals WHERE is_active = 1 AND end_datetime > GETDATE()) as active_flash_deals,
                (SELECT COUNT(*) FROM Inventory i INNER JOIN Products p ON i.product_id = p.product_id WHERE i.quantity_in_stock < 20 AND p.is_active = 1) as low_stock_count,
                (SELECT COUNT(*) FROM Orders WHERE order_status = 'refund_requested') as pending_refunds_count
        `);
        return stats.recordset[0];
    }

    async getRevenueHistory() {
        const result = await this.pool.request().query(`
            SELECT TOP 7
                FORMAT(created_at, 'MMM') as name,
                SUM(subtotal - discount_amount + tax_amount) as revenue,
                COUNT(order_id) as orders
            FROM Orders
            WHERE created_at >= DATEADD(month, -7, GETDATE())
              AND order_status NOT IN ('cancelled', 'refunded')
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
            INNER JOIN Orders o ON oi.order_id = o.order_id
            WHERE o.order_status NOT IN ('cancelled', 'refunded')
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
                    SELECT s.seller_id, SUM(oi.quantity * oi.unit_price) AS total_revenue
                    FROM Sellers s
                    INNER JOIN OrderItems oi ON s.seller_id = oi.seller_id
                    INNER JOIN Orders o ON oi.order_id = o.order_id
                    WHERE o.order_status NOT IN ('cancelled', 'refunded')
                    GROUP BY s.seller_id
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
                p.image_url as image,
                s.store_name as seller
            FROM Products p
            INNER JOIN Categories c ON p.category_id = c.category_id
            LEFT JOIN Inventory i ON p.product_id = i.product_id
            LEFT JOIN Sellers s ON p.seller_id = s.seller_id
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
            LEFT JOIN Sellers s ON p.seller_id = s.seller_id
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
                minimum_order_amount as minOrder,
                used_count as usage,
                usage_limit as limit,
                valid_until as expiry,
                CASE WHEN is_active = 1 AND valid_until > GETDATE() THEN 'active' ELSE 'inactive' END as status
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

    // --- WRITE OPERATIONS ---

    async createProduct(data) {
        const transaction = new this.sql.Transaction(this.pool);
        try {
            await transaction.begin();
            const result = await transaction.request()
                .input('name', this.sql.VarChar, data.name)
                .input('description', this.sql.VarChar, data.description)
                .input('categoryId', this.sql.Int, data.categoryId)
                .input('brand', this.sql.VarChar, data.brand)
                .input('sku', this.sql.VarChar, data.sku)
                .input('unit', this.sql.VarChar, data.unit)
                .input('basePrice', this.sql.Decimal(10, 2), data.basePrice)
                .input('salePrice', this.sql.Decimal(10, 2), data.salePrice)
                .input('imageUrl', this.sql.VarChar, data.imageUrl)
                .input('nutritionalInfo', this.sql.VarChar, data.nutritionalInfo)
                .input('isPerishable', this.sql.Bit, data.isPerishable ? 1 : 0)
                .query(`
                    INSERT INTO Products (product_name, description, category_id, brand, sku, unit, base_price, sale_price, image_url, nutritional_info, is_perishable)
                    OUTPUT INSERTED.product_id
                    VALUES (@name, @description, @categoryId, @brand, @sku, @unit, @basePrice, @salePrice, @imageUrl, @nutritionalInfo, @isPerishable)
                `);
            
            const productId = result.recordset[0].product_id;

            // Initialize inventory
            await transaction.request()
                .input('productId', this.sql.Int, productId)
                .input('quantity', this.sql.Int, data.stock || 0)
                .input('reorderLevel', this.sql.Int, 10)
                .query(`
                    INSERT INTO Inventory (product_id, quantity_in_stock, reorder_level, last_restocked_date)
                    VALUES (@productId, @quantity, @reorderLevel, GETDATE())
                `);

            await transaction.commit();
            return { success: true, productId };
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

    async updateProduct(id, data) {
        const result = await this.pool.request()
            .input('id', this.sql.Int, id)
            .input('name', this.sql.VarChar, data.name)
            .input('description', this.sql.VarChar, data.description)
            .input('categoryId', this.sql.Int, data.categoryId)
            .input('brand', this.sql.VarChar, data.brand)
            .input('basePrice', this.sql.Decimal(10, 2), data.basePrice)
            .input('salePrice', this.sql.Decimal(10, 2), data.salePrice)
            .input('imageUrl', this.sql.VarChar, data.imageUrl)
            .input('isActive', this.sql.Bit, data.isActive ? 1 : 0)
            .query(`
                UPDATE Products 
                SET product_name = @name, description = @description, category_id = @categoryId, 
                    brand = @brand, base_price = @basePrice, sale_price = @salePrice, 
                    image_url = @imageUrl, is_active = @isActive, updated_at = GETDATE()
                WHERE product_id = @id
            `);
        return result.rowsAffected[0] > 0;
    }

    async deleteProduct(id) {
        const result = await this.pool.request()
            .input('id', this.sql.Int, id)
            .query('DELETE FROM Products WHERE product_id = @id');
        return result.rowsAffected[0] > 0;
    }

    async createCategory(data) {
        const result = await this.pool.request()
            .input('name', this.sql.VarChar, data.name)
            .input('description', this.sql.VarChar, data.description)
            .input('imageUrl', this.sql.VarChar, data.imageUrl)
            .input('parentId', this.sql.Int, data.parentId || null)
            .query(`
                INSERT INTO Categories (category_name, description, image_url, parent_category_id)
                VALUES (@name, @description, @imageUrl, @parentId)
            `);
        return result.rowsAffected[0] > 0;
    }

    async updateCategory(id, data) {
        const result = await this.pool.request()
            .input('id', this.sql.Int, id)
            .input('name', this.sql.VarChar, data.name)
            .input('description', this.sql.VarChar, data.description)
            .input('imageUrl', this.sql.VarChar, data.imageUrl)
            .input('isActive', this.sql.Bit, data.isActive ? 1 : 0)
            .query(`
                UPDATE Categories 
                SET category_name = @name, description = @description, image_url = @imageUrl, is_active = @isActive
                WHERE category_id = @id
            `);
        return result.rowsAffected[0] > 0;
    }

    async deleteCategory(id) {
        const result = await this.pool.request()
            .input('id', this.sql.Int, id)
            .query('DELETE FROM Categories WHERE category_id = @id');
        return result.rowsAffected[0] > 0;
    }

    async updateOrderStatus(id, status) {
        const result = await this.pool.request()
            .input('id', this.sql.Int, id)
            .input('status', this.sql.VarChar, status)
            .query('UPDATE Orders SET order_status = @status, updated_at = GETDATE() WHERE order_id = @id');
        return result.rowsAffected[0] > 0;
    }

    async adjustStock(productId, quantity) {
        const result = await this.pool.request()
            .input('productId', this.sql.Int, productId)
            .input('quantity', this.sql.Int, quantity)
            .query(`
                UPDATE Inventory 
                SET quantity_in_stock = quantity_in_stock + @quantity, 
                    last_restocked_date = CASE WHEN @quantity > 0 THEN GETDATE() ELSE last_restocked_date END,
                    updated_at = GETDATE()
                WHERE product_id = @productId
            `);
        return result.rowsAffected[0] > 0;
    }

    async createFlashDeal(data) {
        const result = await this.pool.request()
            .input('name', this.sql.VarChar, data.name)
            .input('description', this.sql.VarChar, data.description)
            .input('productId', this.sql.Int, data.productId)
            .input('discount', this.sql.Decimal(5, 2), data.discount)
            .input('price', this.sql.Decimal(10, 2), data.price)
            .input('start', this.sql.DateTime, new Date(data.start))
            .input('end', this.sql.DateTime, new Date(data.end))
            .input('max', this.sql.Int, data.max)
            .input('adminId', this.sql.Int, (await this.pool.request().query('SELECT TOP 1 admin_id FROM Admins')).recordset[0].admin_id)
            .query(`
                INSERT INTO FlashDeals (deal_name, description, product_id, discount_percentage, deal_price, start_datetime, end_datetime, max_quantity, created_by)
                VALUES (@name, @description, @productId, @discount, @price, @start, @end, @max, @adminId)
            `);
        return result.rowsAffected[0] > 0;
    }

    async endFlashDeal(id) {
        const result = await this.pool.request()
            .input('id', this.sql.Int, id)
            .query('UPDATE FlashDeals SET is_active = 0, end_datetime = GETDATE() WHERE deal_id = @id');
        return result.rowsAffected[0] > 0;
    }

    async createPromotion(data) {
        const result = await this.pool.request()
            .input('code', this.sql.VarChar, data.code)
            .input('description', this.sql.VarChar, data.description)
            .input('type', this.sql.VarChar, data.type)
            .input('value', this.sql.Decimal(10, 2), data.value)
            .input('minOrder', this.sql.Decimal(10, 2), data.minOrder)
            .input('limit', this.sql.Int, data.limit)
            .input('start', this.sql.DateTime, new Date(data.start))
            .input('end', this.sql.DateTime, new Date(data.end))
            .input('maxCap', this.sql.Decimal(10, 2), data.maxCap || null)
            .input('adminId', this.sql.Int, (await this.pool.request().query('SELECT TOP 1 admin_id FROM Admins')).recordset[0].admin_id)
            .query(`
                INSERT INTO PromoCodes (code, description, discount_type, discount_value, minimum_order_amount, usage_limit, valid_from, valid_until, created_by, max_discount_amount)
                VALUES (@code, @description, @type, @value, @minOrder, @limit, @start, @end, @adminId, @maxCap)
            `);
        return result.rowsAffected[0] > 0;
    }

    async deletePromotion(id) {
        const result = await this.pool.request()
            .input('id', this.sql.Int, id)
            .query('DELETE FROM PromoCodes WHERE promo_id = @id');
        return result.rowsAffected[0] > 0;
    }

    async toggleUserStatus(id, isActive) {
        const result = await this.pool.request()
            .input('id', this.sql.Int, id)
            .input('isActive', this.sql.Bit, isActive ? 1 : 0)
            .query('UPDATE Users SET is_active = @isActive, updated_at = GETDATE() WHERE user_id = @id');
        return result.rowsAffected[0] > 0;
    }

    async updateAdminProfile(userId, data) {
        const result = await this.pool.request()
            .input('id', this.sql.Int, userId)
            .input('firstName', this.sql.VarChar, data.firstName)
            .input('lastName', this.sql.VarChar, data.lastName)
            .input('email', this.sql.VarChar, data.email)
            .query(`
                UPDATE Users 
                SET first_name = @firstName, last_name = @lastName, email = @email, updated_at = GETDATE()
                WHERE user_id = @id
            `);
        return result.rowsAffected[0] > 0;
    }

    async updateSettings(data) {
        return true;
    }

    async getNotifications(adminId) {
        const result = await this.pool.request()
            .input('adminId', this.sql.Int, adminId)
            .query(`
                SELECT 
                    notification_id as id,
                    notification_type as type,
                    title,
                    message,
                    is_read as isRead,
                    created_at as time
                FROM Notifications
                WHERE user_id = @adminId
                ORDER BY created_at DESC
            `);
        return result.recordset;
    }

    async markNotificationAsRead(id) {
        const result = await this.pool.request()
            .input('id', this.sql.Int, id)
            .query('UPDATE Notifications SET is_read = 1 WHERE notification_id = @id');
        return result.rowsAffected[0] > 0;
    }

    async changePassword(userId, currentPassword, newPassword) {
        const result = await this.pool.request()
            .input('id', this.sql.Int, userId)
            .query('SELECT password_hash FROM Users WHERE user_id = @id');
        
        if (result.recordset.length === 0) throw new Error('User not found');
        
        const isMatch = await bcrypt.compare(currentPassword, result.recordset[0].password_hash);
        if (!isMatch) throw new Error('Current password is incorrect');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updateResult = await this.pool.request()
            .input('id', this.sql.Int, userId)
            .input('hash', this.sql.VarChar, hashedPassword)
            .query('UPDATE Users SET password_hash = @hash, updated_at = GETDATE() WHERE user_id = @id');
        
        return updateResult.rowsAffected[0] > 0;
    }

    async updateAdminProfile(userId, data) {
        const result = await this.pool.request()
            .input('userId', this.sql.Int, userId)
            .input('firstName', this.sql.VarChar, data.firstName)
            .input('lastName', this.sql.VarChar, data.lastName)
            .input('email', this.sql.VarChar, data.email)
            .query(`
                UPDATE Users 
                SET first_name = @firstName, last_name = @lastName, email = @email, updated_at = GETDATE()
                WHERE user_id = @userId
            `);
        return result.rowsAffected[0] > 0;
    }
}

module.exports = AdminRepository;
