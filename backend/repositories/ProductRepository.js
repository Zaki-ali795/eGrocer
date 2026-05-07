// repositories/ProductRepository.js
const BaseRepository = require('./BaseRepository');

/**
 * Handles all DB queries related to Products and Categories.
 * SRP: Only responsible for data access — no business logic here.
 * OCP: Add new query methods without modifying existing ones.
 */
class ProductRepository extends BaseRepository {
    constructor(pool) {
        super(pool);
    }

    /**
     * Fetch all active top-level categories (no parent).
     */
    async getAllCategories() {
        const result = await this.pool.request().query(`
            SELECT
                category_id,
                category_name,
                description,
                image_url,
                parent_category_id
            FROM Categories
            WHERE is_active = 1
            ORDER BY category_name ASC
        `);
        return result.recordset;
    }

    /**
     * Fetch all active products for a given category_id.
     * Joins with Inventory so stock info is included.
     */
    async getProductsByCategory(categoryId) {
        const result = await this.pool
            .request()
            .input('categoryId', categoryId)
            .query(`
                SELECT
                    p.product_id,
                    p.product_name,
                    p.description,
                    p.brand,
                    p.sku,
                    p.unit,
                    p.base_price,
                    p.sale_price,
                    p.image_url,
                    p.nutritional_info,
                    p.is_perishable,
                    p.tax_percentage,
                    c.category_name,
                    ISNULL(i.quantity_in_stock, 0) AS quantity_in_stock
                FROM Products p
                INNER JOIN Categories c ON p.category_id = c.category_id
                LEFT JOIN Inventory i ON p.product_id = i.product_id
                WHERE p.is_active = 1
                  AND p.category_id = @categoryId
                ORDER BY p.product_name ASC
            `);
        return result.recordset;
    }

    /**
     * Fetch all active products across all categories (with optional limit).
     */
    async getAllProducts(limit = 50) {
        const result = await this.pool
            .request()
            .input('limit', limit)
            .query(`
                SELECT TOP (@limit)
                    p.product_id,
                    p.product_name,
                    p.description,
                    p.brand,
                    p.unit,
                    p.base_price,
                    p.sale_price,
                    p.image_url,
                    p.tax_percentage,
                    c.category_id,
                    c.category_name,
                    ISNULL(i.quantity_in_stock, 0) AS quantity_in_stock
                FROM Products p
                INNER JOIN Categories c ON p.category_id = c.category_id
                LEFT JOIN Inventory i ON p.product_id = i.product_id
                WHERE p.is_active = 1
                ORDER BY p.created_at DESC
            `);
        return result.recordset;
    }

    /**
     * Search products with optional filters:
     * keyword, minPrice, maxPrice, brands (array), categoryId, inStockOnly.
     * Builds the WHERE clause dynamically — only adds conditions that are provided.
     */
    async searchProducts({ keyword, minPrice, maxPrice, brands, categoryId, inStockOnly } = {}) {
        const req = this.pool.request();
        const conditions = ["p.is_active = 1"];

        if (keyword) {
            req.input('keyword', `%${keyword}%`);
            conditions.push("(p.product_name LIKE @keyword OR p.description LIKE @keyword OR p.brand LIKE @keyword)");
        }
        if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
            req.input('minPrice', parseFloat(minPrice));
            conditions.push("ISNULL(p.sale_price, p.base_price) >= @minPrice");
        }
        if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
            req.input('maxPrice', parseFloat(maxPrice));
            conditions.push("ISNULL(p.sale_price, p.base_price) <= @maxPrice");
        }
        if (categoryId) {
            req.input('categoryId', parseInt(categoryId));
            conditions.push("p.category_id = @categoryId");
        }
        if (inStockOnly) {
            conditions.push("ISNULL(i.quantity_in_stock, 0) > 0");
        }
        // Brand filter — inject safely as a numbered param list
        if (brands && brands.length > 0) {
            const brandParams = brands.map((b, idx) => {
                req.input(`brand${idx}`, b);
                return `@brand${idx}`;
            });
            conditions.push(`p.brand IN (${brandParams.join(',')})`);
        }

        const where = conditions.join(' AND ');
        const result = await req.query(`
            SELECT
                p.product_id,
                p.product_name,
                p.description,
                p.brand,
                p.sku,
                p.unit,
                p.base_price,
                p.sale_price,
                p.image_url,
                p.nutritional_info,
                p.is_perishable,
                p.tax_percentage,
                c.category_id,
                c.category_name,
                ISNULL(i.quantity_in_stock, 0) AS quantity_in_stock
            FROM Products p
            INNER JOIN Categories c ON p.category_id = c.category_id
            LEFT JOIN Inventory i ON p.product_id = i.product_id
            WHERE ${where}
            ORDER BY p.product_name ASC
        `);
        return result.recordset;
    }

    /**
     * Get all distinct non-null brands (optionally scoped to a category).
     */
    async getBrands(categoryId) {
        const req = this.pool.request();
        let where = "p.is_active = 1 AND p.brand IS NOT NULL";
        if (categoryId) {
            req.input('categoryId', parseInt(categoryId));
            where += " AND p.category_id = @categoryId";
        }
        const result = await req.query(`
            SELECT DISTINCT p.brand
            FROM Products p
            WHERE ${where}
            ORDER BY p.brand ASC
        `);
        return result.recordset.map(r => r.brand);
    }

    /**
     * Fetch a single product by its ID.
     */
    async getProductById(productId) {
        const result = await this.pool
            .request()
            .input('productId', productId)
            .query(`
                SELECT
                    p.product_id,
                    p.product_name,
                    p.description,
                    p.brand,
                    p.sku,
                    p.unit,
                    p.base_price,
                    p.sale_price,
                    p.image_url,
                    p.nutritional_info,
                    p.is_perishable,
                    p.tax_percentage,
                    c.category_id,
                    c.category_name,
                    ISNULL(i.quantity_in_stock, 0) AS quantity_in_stock
                FROM Products p
                INNER JOIN Categories c ON p.category_id = c.category_id
                LEFT JOIN Inventory i ON p.product_id = i.product_id
                WHERE p.is_active = 1
                  AND p.product_id = @productId
            `);
        return result.recordset[0] || null;
    }

    /**
     * Fetch active flash deals
     */
    async getActiveFlashDeals() {
        const result = await this.pool.request().query(`
            SELECT 
                fd.deal_id,
                fd.deal_name,
                p.product_id,
                p.product_name,
                p.image_url,
                p.base_price as original_price,
                fd.deal_price,
                fd.discount_percentage,
                fd.max_quantity as total_stock,
                (fd.max_quantity - fd.sold_quantity) as available_stock,
                fd.end_datetime
            FROM FlashDeals fd
            INNER JOIN Products p ON fd.product_id = p.product_id
            WHERE fd.is_active = 1 
              AND GETDATE() BETWEEN fd.start_datetime AND fd.end_datetime
              AND (fd.max_quantity - fd.sold_quantity) > 0
            ORDER BY fd.end_datetime ASC
        `);
        return result.recordset;
    }
}

module.exports = ProductRepository;
