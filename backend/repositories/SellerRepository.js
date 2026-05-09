// repositories/SellerRepository.js
const BaseRepository = require('./BaseRepository');

/**
 * Handles all DB queries related to Sellers, Store Profiles, and Bidding.
 * SRP: Only responsible for data access for the Seller domain.
 */
class SellerRepository extends BaseRepository {
    constructor(pool) {
        super(pool);
    }

    /**
     * Fetch a seller's profile by their user_id.
     */
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

    /**
     * Fetch all open product requests from customers.
     * This is used by sellers to find opportunities to bid.
     */
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

    /**
     * Submit a bid on a product request.
     */
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
                    request_id, 
                    seller_id, 
                    product_id, 
                    bid_price, 
                    estimated_delivery_days, 
                    bid_status
                )
                VALUES (
                    @requestId, 
                    @sellerId, 
                    @productId, 
                    @bidPrice, 
                    @deliveryDays, 
                    'pending'
                );
                SELECT SCOPE_IDENTITY() AS bid_id;
            `);
        return result.recordset[0].bid_id;
    }

    /**
     * Fetch all bids submitted by a specific seller.
     */
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

    /**
     * Fetch all products belonging to a specific seller.
     */
    async getSellerProducts(sellerId) {
        const result = await this.pool
            .request()
            .input('sellerId', sellerId)
            .query(`
                SELECT 
                    p.product_id,
                    p.product_name,
                    p.base_price,
                    p.sale_price,
                    p.image_url,
                    p.is_active,
                    c.category_name,
                    ISNULL(i.quantity_in_stock, 0) AS inventory
                FROM Products p
                INNER JOIN Categories c ON p.category_id = c.category_id
                LEFT JOIN Inventory i ON p.product_id = i.product_id
                WHERE p.seller_id = @sellerId
                ORDER BY p.created_at DESC
            `);
        return result.recordset;
    }

    /**
     * Update stock level for a seller's product.
     */
    async updateInventory(productId, quantity) {
        await this.pool
            .request()
            .input('productId', productId)
            .input('quantity', quantity)
            .query(`
                UPDATE Inventory
                SET quantity_in_stock = @quantity,
                    updated_at = GETDATE()
                WHERE product_id = @productId
            `);
    }

    /**
     * Fetch orders containing products from this seller.
     */
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

    /**
     * Fetch summary stats for the dashboard.
     */
    async getDashboardStats(sellerId) {
        const statsResult = await this.pool
            .request()
            .input('sellerId', sellerId)
            .query(`
                SELECT 
                    ISNULL((SELECT SUM(quantity * unit_price) FROM OrderItems WHERE seller_id = @sellerId), 0) AS total_revenue,
                    (SELECT COUNT(DISTINCT order_id) FROM OrderItems WHERE seller_id = @sellerId) AS total_orders,
                    (SELECT COUNT(*) FROM ProductRequests WHERE request_status = 'open') AS pending_requests,
                    (SELECT COUNT(*) FROM Inventory i INNER JOIN Products p ON i.product_id = p.product_id WHERE p.seller_id = @sellerId AND i.quantity_in_stock < 20) AS low_stock_count
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

    /**
     * Add a new product to the store.
     */
    async addProduct(sellerId, productData) {
        const { name, categoryId, brand, basePrice, salePrice, unit, description, imageUrl, nutritionalInfo, isPerishable } = productData;
        
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
            .query(`
                INSERT INTO Products (product_name, description, category_id, brand, seller_id, unit, base_price, sale_price, image_url, nutritional_info, is_perishable)
                VALUES (@name, @description, @categoryId, @brand, @sellerId, @unit, @basePrice, @salePrice, @imageUrl, @nutritionalInfo, @isPerishable);
                
                DECLARE @newId INT = SCOPE_IDENTITY();
                
                INSERT INTO Inventory (product_id, quantity_in_stock)
                VALUES (@newId, 0);
                
                SELECT @newId AS product_id;
            `);
        return result.recordset[0].product_id;
    }

    /**
     * Update an existing product.
     */
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

    /**
     * Delete (soft delete or hard delete) a product.
     */
    async deleteProduct(productId) {
        await this.pool
            .request()
            .input('productId', productId)
            .query(`
                DELETE FROM Inventory WHERE product_id = @productId;
                UPDATE Products SET is_active = 0 WHERE product_id = @productId;
            `);
    }

    /**
     * Fetch active flash deals/promotions for this seller.
     */
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
                WHERE p.seller_id = @sellerId
                ORDER BY fd.start_datetime DESC
            `);
        return result.recordset;
    }

    /**
     * Create a new flash deal for a product.
     */
    async createPromotion({ productId, discountPercentage, startDatetime, endDatetime }) {
        await this.pool
            .request()
            .input('productId', productId)
            .input('discount', discountPercentage)
            .input('start', startDatetime)
            .input('end', endDatetime)
            .query(`
                INSERT INTO FlashDeals (product_id, discount_percentage, start_datetime, end_datetime, is_active)
                VALUES (@productId, @discount, @start, @end, 1);
            `);
    }

    /**
     * Fetch earnings history for the seller.
     */
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
