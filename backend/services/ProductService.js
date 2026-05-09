// services/ProductService.js

/**
 * Business logic layer for products.
 * SRP: Transforms and validates data; does NOT talk to DB directly.
 * DIP: Depends on ProductRepository abstraction injected via constructor.
 */
class ProductService {
    constructor(productRepository) {
        this.productRepo = productRepository;
    }

    /**
     * Returns all active categories.
     */
    async getCategories() {
        const categories = await this.productRepo.getAllCategories();
        return categories;
    }

    /**
     * Returns products for a specific category with enriched fields
     * (effective price, discount %, in-stock flag).
     */
    async getProductsByCategory(categoryId) {
        if (!categoryId || isNaN(Number(categoryId))) {
            const err = new Error('Invalid category ID.');
            err.status = 400;
            throw err;
        }

        const products = await this.productRepo.getProductsByCategory(Number(categoryId));
        return products.map(this._enrichProduct);
    }

    /**
     * Returns featured/latest products (for homepage).
     */
    async getFeaturedProducts(limit = 8) {
        const products = await this.productRepo.getAllProducts(limit);
        return products.map(this._enrichProduct);
    }

    /**
     * Returns a single product by ID.
     */
    async getProductById(productId) {
        if (!productId || isNaN(Number(productId))) {
            const err = new Error('Invalid product ID.');
            err.status = 400;
            throw err;
        }

        const product = await this.productRepo.getProductById(Number(productId));
        if (!product) {
            const err = new Error('Product not found.');
            err.status = 404;
            throw err;
        }

        return this._enrichProduct(product);
    }

    /**
     * Full-text + filter search across products.
     * All filters are optional — omitting a filter returns all products.
     * @param {object} filters - { keyword, minPrice, maxPrice, brands[], categoryId, inStockOnly }
     */
    async searchProducts(filters = {}) {
        const { keyword, minPrice, maxPrice, brands, categoryId, inStockOnly } = filters;

        // Validate numeric inputs
        if (minPrice && isNaN(Number(minPrice))) {
            const err = new Error('minPrice must be a number.'); err.status = 400; throw err;
        }
        if (maxPrice && isNaN(Number(maxPrice))) {
            const err = new Error('maxPrice must be a number.'); err.status = 400; throw err;
        }
        if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
            const err = new Error('minPrice cannot be greater than maxPrice.'); err.status = 400; throw err;
        }

        // brands may come in as comma-separated string from query params
        const brandsArray = Array.isArray(brands)
            ? brands
            : (brands ? brands.split(',').map(b => b.trim()).filter(Boolean) : []);

        const products = await this.productRepo.searchProducts({
            keyword: keyword || '',
            minPrice, maxPrice,
            brands: brandsArray,
            categoryId: categoryId || null,
            inStockOnly: inStockOnly === 'true' || inStockOnly === true,
        });

        return products.map(this._enrichProduct);
    }

    /**
     * Returns distinct brand names — used to populate filter checkboxes on the frontend.
     * Optionally scoped to a category.
     */
    async getBrands(categoryId) {
        return this.productRepo.getBrands(categoryId || null);
    }

    /**
     * Returns active flash deals formatted for the frontend.
     */
    async getFlashDealsData() {
        const rawRows = await this.productRepo.getActiveFlashDeals();
        
        return rawRows.map(row => ({
            id: String(row.deal_id),
            name: row.deal_name,
            productId: String(row.product_id),
            productName: row.product_name,
            image: row.image_url,
            price: parseFloat(row.deal_price),
            originalPrice: parseFloat(row.original_price),
            discount: parseFloat(row.discount_percentage),
            stock: row.available_stock,
            totalStock: row.total_stock,
            endsAt: row.end_datetime
        }));
    }

    /**
     * Private helper — adds computed fields to a raw DB product row.
     * OCP: Add more enrichment here without touching repo or controller.
     */
    _enrichProduct(p) {
        const basePrice = parseFloat(p.base_price);
        const salePrice = p.sale_price ? parseFloat(p.sale_price) : null;
        const effectivePrice = salePrice ?? basePrice;
        const discountPercent = salePrice
            ? Math.round(((basePrice - salePrice) / basePrice) * 100)
            : 0;

        return {
            id: p.product_id,
            name: p.product_name,
            description: p.description,
            brand: p.brand,
            storeName: p.store_name,
            sku: p.sku,
            unit: p.unit,
            price: effectivePrice,
            originalPrice: salePrice ? basePrice : null,
            discountPercent,
            taxPercent: parseFloat(p.tax_percentage || 0),
            image: p.image_url || '',
            nutritionalInfo: p.nutritional_info || null,
            isPerishable: !!p.is_perishable,
            inStock: p.quantity_in_stock > 0,
            stockQty: p.quantity_in_stock,
            category: p.category_name,
            categoryId: p.category_id,
        };
    }
}

module.exports = ProductService;
