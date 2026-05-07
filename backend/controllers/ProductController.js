// controllers/ProductController.js

/**
 * HTTP layer for product-related endpoints.
 * SRP: Only handles req/res — all logic delegated to ProductService.
 * OCP: Add new endpoints without modifying existing handler methods.
 */
class ProductController {
    constructor(productService) {
        this.productService = productService;

        // Bind so 'this' works correctly when used as route handlers
        this.getCategories         = this.getCategories.bind(this);
        this.getProductsByCategory = this.getProductsByCategory.bind(this);
        this.getFeaturedProducts   = this.getFeaturedProducts.bind(this);
        this.getProductById        = this.getProductById.bind(this);
        this.searchProducts        = this.searchProducts.bind(this);
        this.getBrands             = this.getBrands.bind(this);
        this.getFlashDeals         = this.getFlashDeals.bind(this);
    }

    /**
     * GET /api/products/categories
     */
    async getCategories(req, res, next) {
        try {
            const categories = await this.productService.getCategories();
            res.json({ success: true, data: categories });
        } catch (err) {
            next(err);
        }
    }

    /**
     * GET /api/products/category/:categoryId
     */
    async getProductsByCategory(req, res, next) {
        try {
            const products = await this.productService.getProductsByCategory(req.params.categoryId);
            res.json({ success: true, data: products });
        } catch (err) {
            next(err);
        }
    }

    /**
     * GET /api/products/featured?limit=8
     */
    async getFeaturedProducts(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 8;
            const products = await this.productService.getFeaturedProducts(limit);
            res.json({ success: true, data: products });
        } catch (err) {
            next(err);
        }
    }

    /**
     * GET /api/products/:productId
     */
    async getProductById(req, res, next) {
        try {
            const product = await this.productService.getProductById(req.params.productId);
            res.json({ success: true, data: product });
        } catch (err) {
            next(err);
        }
    }
    /**
     * GET /api/products/search?q=&minPrice=&maxPrice=&brands=A,B&categoryId=&inStockOnly=true
     */
    async searchProducts(req, res, next) {
        try {
            const { q, minPrice, maxPrice, brands, categoryId, inStockOnly } = req.query;
            const products = await this.productService.searchProducts({
                keyword: q,
                minPrice,
                maxPrice,
                brands,          // comma-separated string — service splits it
                categoryId,
                inStockOnly,
            });
            res.json({ success: true, data: products });
        } catch (err) {
            next(err);
        }
    }

    /**
     * GET /api/products/brands?categoryId=   (optional)
     */
    async getBrands(req, res, next) {
        try {
            const brands = await this.productService.getBrands(req.query.categoryId);
            res.json({ success: true, data: brands });
        } catch (err) {
            next(err);
        }
    }

    /**
     * GET /api/products/flash-deals
     */
    async getFlashDeals(req, res, next) {
        try {
            const deals = await this.productService.getFlashDealsData();
            res.json({ success: true, data: deals });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ProductController;
