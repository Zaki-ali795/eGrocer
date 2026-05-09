// repositories/SellerRepository.js
const BaseRepository = require('./BaseRepository');

class SellerRepository extends BaseRepository {
    constructor(pool) {
        super(pool);
    }

    async getSellerProfile(sellerId) {
        const result = await this.pool
            .request()
            .input('sellerId', sellerId)
            .query(`
                SELECT 
                    s.seller_id,
                    s.store_name,
                    s.store_description,
                    s.business_license_number,
                    s.store_rating,
                    s.verification_status,
                    u.email,
                    u.first_name,
                    u.last_name,
                    u.phone
                FROM Sellers s
                INNER JOIN Users u ON s.seller_id = u.user_id
                WHERE s.seller_id = @sellerId
            `);
        return result.recordset[0] || null;
    }

    async getAllProductRequests() {
        const result = await this.pool.request().query(`
            SELECT 
                pr.request_id,
                pr.customer_id,
                pr.product_name,
                pr.description,
                pr.quantity,
                pr.max_budget,
                pr.request_status,
                pr.created_at,
                u.first_name + ' ' + u.last_name AS customer_name,
                c.category_name
            FROM ProductRequests pr
            INNER JOIN Users u ON pr.customer_id = u.user_id
            LEFT JOIN Categories c ON pr.category_id = c.category_id
            WHERE pr.request_status = 'open'
            ORDER BY pr.created_at DESC
        `);
        return result.recordset;
    }

    async submitBid({ requestId, sellerId, productId, bidPrice, estimatedDeliveryDays }) {
        const result = await this.pool
            .request()
            .input('requestId', requestId)
            .input('sellerId', sellerId)
            .input('productId', productId)
            .input('bidPrice', bidPrice)
            .input('deliveryDays', estimatedDeliveryDays)
            .query(`
                INSERT INTO ProductRequestBids (
                    request_id, seller_id, product_id, bid_price, estimated_delivery_days, bid_status
                )
                VALUES (@requestId, @sellerId, @productId, @bidPrice, @deliveryDays, 'pending');
                SELECT SCOPE_IDENTITY() AS bid_id;
            `);
        return result.recordset[0].bid_id;
    }

    async getSellerBids(sellerId) {
        const result = await this.pool
            .request()
            .input('sellerId', sellerId)
            .query(`
                SELECT 
                    b.bid_id,
                    b.bid_price,
                    b.bid_status,
                    b.created_at,
                    pr.product_name,
                    pr.quantity
                FROM ProductRequestBids b
                INNER JOIN ProductRequests pr ON b.request_id = pr.request_id
                WHERE b.seller_id = @sellerId
                ORDER BY b.created_at DESC
            `);
        return result.recordset;
    }

    async getSellerProducts(sellerId) {
        const result = await this.pool
            .request()
            .input('sellerId', sellerId)
            .query(`
                SELECT 
                    p.product_id,
                    p.product_name,
                    p.brand,
                    p.base_price,
                    p.sale_price,
                    p.image_url,
                    p.is_active,
                    p.category_id,
                    c.category_name,
                    ISNULL(i.quantity_in_stock, 0) AS inventory
                FROM Products p
                INNER JOIN Categories c ON p.category_id = c.category_id
                LEFT JOIN Inventory i ON p.product_id = i.product_id
                WHERE p.seller_id = @sellerId AND p.is_active = 1
                ORDER BY p.created_at DESC
            `);
        return result.recordset;
    }

    async updateInventory(productId, quantity) {
        await this.pool
            .request()
            .input('productId', productId)
            .input('quantity', quantity)
            .query(`
                UPDATE Inventory
                SET quantity_in_stock = @quantity,
                    last_restocked_date = CASE WHEN (SELECT quantity_in_stock FROM Inventory WHERE product_id = @productId) = 0 AND @quantity > 0 THEN GETDATE() ELSE last_restocked_date END,
                    updated_at = GETDATE()
                WHERE product_id = @productId
            `);
    }

    async getSellerOrders(sellerId) {
        const result = await this.pool
            .request()
            .input('sellerId', sellerId)
            .query(`
                SELECT 
                    o.order_id,
                    o.order_number,
                    o.order_status,
                    o.created_at,
                    oi.quantity,
                    oi.unit_price,
                    p.product_name,
                    u.first_name + ' ' + u.last_name AS customer_name
                FROM Orders o
                INNER JOIN OrderItems oi ON o.order_id = oi.order_id
                INNER JOIN Products p ON oi.product_id = p.product_id
                INNER JOIN Users u ON o.customer_id = u.user_id
                WHERE oi.seller_id = @sellerId
                ORDER BY o.created_at DESC
            `);
        return result.recordset;
    }

    async getDashboardStats(sellerId) {
        const statsResult = await this.pool
            .request()
            .input('sellerId', sellerId)
            .query(`
                SELECT 
                    ISNULL((SELECT SUM(quantity * unit_price) FROM OrderItems WHERE seller_id = @sellerId), 0) AS total_revenue,
                    (SELECT COUNT(DISTINCT order_id) FROM OrderItems WHERE seller_id = @sellerId) AS total_orders,
                    (SELECT COUNT(*) FROM ProductRequests WHERE request_status = 'open') AS pending_requests,
                    (SELECT COUNT(*) FROM Inventory i INNER JOIN Products p ON i.product_id = p.product_id WHERE p.seller_id = @sellerId AND p.is_active = 1 AND i.quantity_in_stock < 20) AS low_stock_count
            `);

        const recentOrdersResult = await this.pool
            .request()
            .input('sellerId', sellerId)
            .query(`
                SELECT TOP 5
                    o.order_id,
                    o.order_number,
                    o.order_status,
                    o.created_at,
                    u.first_name + ' ' + u.last_name AS customer_name,
                    (SELECT SUM(quantity) FROM OrderItems WHERE order_id = o.order_id AND seller_id = @sellerId) AS item_count,
                    (SELECT SUM(quantity * unit_price) FROM OrderItems WHERE order_id = o.order_id AND seller_id = @sellerId) AS total_price
                FROM Orders o
                INNER JOIN Users u ON o.customer_id = u.user_id
                WHERE EXISTS (SELECT 1 FROM OrderItems WHERE order_id = o.order_id AND seller_id = @sellerId)
                ORDER BY o.created_at DESC
            `);

        return {
            ...statsResult.recordset[0],
            recent_orders: recentOrdersResult.recordset
        };
    }

    async getSalesHistory(sellerId) {
        const result = await this.pool
            .request()
            .input('sellerId', sellerId)
            .query(`
                SELECT 
                    CAST(o.created_at AS DATE) as date,
                    SUM(oi.quantity * oi.unit_price) as sales,
                    COUNT(DISTINCT o.order_id) as orders
                FROM OrderItems oi
                INNER JOIN Orders o ON oi.order_id = o.order_id
                WHERE oi.seller_id = @sellerId 
                  AND o.created_at >= DATEADD(day, -30, GETDATE())
                GROUP BY CAST(o.created_at AS DATE)
                ORDER BY date ASC
            `);
        return result.recordset;
    }

    async addProduct(sellerId, productData) {
        const { name, categoryId, brand, basePrice, salePrice, unit, description, imageUrl, nutritionalInfo, isPerishable, stockQuantity } = productData;

        const result = await this.pool
            .request()
            .input('sellerId', sellerId)
            .input('name', name)
            .input('categoryId', categoryId)
            .input('brand', brand)
            .input('basePrice', basePrice)
            .input('salePrice', salePrice)
            .input('unit', unit || 'piece')
            .input('description', description)
            .input('imageUrl', imageUrl)
            .input('nutritionalInfo', nutritionalInfo)
            .input('isPerishable', isPerishable || 0)
            .input('initialStock', stockQuantity || 0)
            .query(`
                BEGIN TRANSACTION;
                BEGIN TRY
                    DECLARE @InsertedID TABLE (ID INT);
                    INSERT INTO Products (product_name, description, category_id, brand, seller_id, unit, base_price, sale_price, image_url, nutritional_info, is_perishable, sku)
                    OUTPUT INSERTED.product_id INTO @InsertedID
                    VALUES (@name, @description, @categoryId, @brand, @sellerId, @unit, @basePrice, @salePrice, @imageUrl, @nutritionalInfo, @isPerishable, 'SKU-' + CAST(ABS(CHECKSUM(NEWID())) AS VARCHAR(20)));
                    DECLARE @newId INT = (SELECT ID FROM @InsertedID);
                    INSERT INTO Inventory (product_id, quantity_in_stock) VALUES (@newId, @initialStock);
                    SELECT @newId AS product_id;
                    COMMIT TRANSACTION;
                END TRY
                BEGIN CATCH
                    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
                    THROW;
                END CATCH
            `);
        return result.recordset[0].product_id;
    }

    async updateProduct(productId, productData) {
        const { name, categoryId, brand, basePrice, salePrice, description, imageUrl } = productData;
        await this.pool
            .request()
            .input('productId', productId)
            .input('name', name)
            .input('categoryId', categoryId)
            .input('brand', brand)
            .input('basePrice', basePrice)
            .input('salePrice', salePrice)
            .input('description', description)
            .input('imageUrl', imageUrl)
            .query(`
                UPDATE Products
                SET product_name = @name,
                    category_id = @categoryId,
                    brand = @brand,
                    base_price = @basePrice,
                    sale_price = @salePrice,
                    description = @description,
                    image_url = @imageUrl,
                    updated_at = GETDATE()
                WHERE product_id = @productId
            `);
    }

    async deleteProduct(productId) {
        await this.pool
            .request()
            .input('productId', productId)
            .query(`
                DELETE FROM Inventory WHERE product_id = @productId;
                UPDATE Products SET is_active = 0 WHERE product_id = @productId;
            `);
    }

    async getSellerPromotions(sellerId) {
        const result = await this.pool
            .request()
            .input('sellerId', sellerId)
            .query(`
                SELECT 
                    fd.deal_id,
                    fd.discount_percentage,
                    fd.start_datetime,
                    fd.end_datetime,
                    fd.is_active,
                    p.product_name,
                    p.image_url
                FROM FlashDeals fd
                INNER JOIN Products p ON fd.product_id = p.product_id
                WHERE p.seller_id = @sellerId AND p.is_active = 1
                ORDER BY fd.start_datetime DESC
            `);
        return result.recordset;
    }

    async createPromotion({ productId, discountPercentage, startDatetime, endDatetime, maxQuantity }) {
        await this.pool
            .request()
            .input('productId', productId)
            .input('discount', discountPercentage)
            .input('start', startDatetime)
            .input('end', endDatetime)
            .input('maxQty', maxQuantity || 100)
            .query(`
                INSERT INTO FlashDeals (deal_name, product_id, discount_percentage, start_datetime, end_datetime, max_quantity, is_active, created_by)
                VALUES (
                    (SELECT product_name FROM Products WHERE product_id = @productId) + ' - ' + CAST(@discount AS VARCHAR) + '% Off',
                    @productId, @discount, @start, @end, @maxQty, 1,
                    (SELECT TOP 1 admin_id FROM Admins)
                );
            `);
    }

    async deletePromotion(dealId) {
        await this.pool
            .request()
            .input('dealId', dealId)
            .query(`DELETE FROM FlashDeals WHERE deal_id = @dealId`);
    }

    async updateOrderStatus(orderId, status) {
        await this.pool
            .request()
            .input('orderId', orderId)
            .input('status', status)
            .query(`UPDATE Orders SET order_status = @status WHERE order_id = @orderId`);
    }

    async updateProfile(sellerId, profileData) {
        const { storeName, storeDescription, phone } = profileData;
        await this.pool
            .request()
            .input('sellerId', sellerId)
            .input('storeName', storeName)
            .input('storeDescription', storeDescription)
            .input('phone', phone)
            .query(`
                UPDATE Sellers 
                SET store_name = @storeName, 
                    store_description = @storeDescription,
                    updated_at = GETDATE()
                WHERE seller_id = @sellerId;
                UPDATE Users SET phone = @phone WHERE user_id = @sellerId;
            `);
    }

    async getCategories() {
        const result = await this.pool.request().query(`SELECT category_id, category_name FROM Categories`);
        return result.recordset;
    }

    async getSellerEarnings(sellerId) {
        const result = await this.pool
            .request()
            .input('sellerId', sellerId)
            .query(`
                SELECT 
                    oi.order_item_id AS transaction_id,
                    oi.order_id,
                    o.created_at AS date,
                    oi.quantity * oi.unit_price AS amount,
                    o.order_status AS status,
                    'payment' AS type
                FROM OrderItems oi
                INNER JOIN Orders o ON oi.order_id = o.order_id
                WHERE oi.seller_id = @sellerId
                ORDER BY o.created_at DESC
            `);
        return result.recordset;
    }
}

module.exports = SellerRepository;