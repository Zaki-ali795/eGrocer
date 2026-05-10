// repositories/WishlistRepository.js
const BaseRepository = require('./BaseRepository');

class WishlistRepository extends BaseRepository {
    constructor(pool) {
        super(pool);
    }

    async getWishlist(customerId) {
        const result = await this.pool
            .request()
            .input('customerId', customerId)
            .query(`
                SELECT 
                    p.product_id as id,
                    p.product_name as name,
                    p.description,
                    p.brand,
                    CASE WHEN p.sale_price IS NOT NULL THEN p.base_price ELSE NULL END as originalPrice,
                    ISNULL(p.sale_price, p.base_price) as price,
                    p.image_url as image,
                    c.category_name as category,
                    w.added_at
                FROM Wishlists w
                INNER JOIN Products p ON w.product_id = p.product_id
                INNER JOIN Categories c ON p.category_id = c.category_id
                WHERE w.customer_id = @customerId
                ORDER BY w.added_at DESC
            `);
        return result.recordset;
    }

    async addToWishlist(customerId, productId) {
        await this.pool
            .request()
            .input('customerId', customerId)
            .input('productId', productId)
            .query(`
                IF NOT EXISTS (SELECT 1 FROM Wishlists WHERE customer_id = @customerId AND product_id = @productId)
                BEGIN
                    INSERT INTO Wishlists (customer_id, product_id)
                    VALUES (@customerId, @productId)
                END
            `);
    }

    async removeFromWishlist(customerId, productId) {
        await this.pool
            .request()
            .input('customerId', customerId)
            .input('productId', productId)
            .query(`
                DELETE FROM Wishlists 
                WHERE customer_id = @customerId AND product_id = @productId
            `);
    }

    async isInWishlist(customerId, productId) {
        const result = await this.pool
            .request()
            .input('customerId', customerId)
            .input('productId', productId)
            .query(`
                SELECT 1 FROM Wishlists 
                WHERE customer_id = @customerId AND product_id = @productId
            `);
        return result.recordset.length > 0;
    }
}

module.exports = WishlistRepository;
