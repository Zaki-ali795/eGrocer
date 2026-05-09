// controllers/SellerController.js

/**
 * HTTP layer for Seller-related endpoints.
 * SRP: Only handles request/response lifecycle.
 */
class SellerController {
    constructor(sellerService) {
        this.sellerService = sellerService;

        this.getProfile = this.getProfile.bind(this);
        this.getOpenRequests = this.getOpenRequests.bind(this);
        this.placeBid = this.placeBid.bind(this);
        this.getSellerBids = this.getSellerBids.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.updateInventory = this.updateInventory.bind(this);
        this.getDashboardStats = this.getDashboardStats.bind(this);
        this.getSalesHistory = this.getSalesHistory.bind(this);
        this.getOrders = this.getOrders.bind(this);
        this.addProduct = this.addProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.getPromotions = this.getPromotions.bind(this);
        this.createPromotion = this.createPromotion.bind(this);
        this.getEarnings = this.getEarnings.bind(this);
        this.deletePromotion = this.deletePromotion.bind(this);
        this.updateOrderStatus = this.updateOrderStatus.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.getCategories = this.getCategories.bind(this);
    }

    async getProfile(req, res, next) {
        try {
            // In a real app, sellerId would come from JWT/Session.
            // For now, we'll take it from query or params for testing.
            const sellerId = req.params.sellerId || req.query.sellerId;
            const profile = await this.sellerService.getProfile(sellerId);
            res.json({ success: true, data: profile });
        } catch (err) {
            next(err);
        }
    }

    async getOpenRequests(req, res, next) {
        try {
            const requests = await this.sellerService.getOpenRequests();
            res.json({ success: true, data: requests });
        } catch (err) {
            next(err);
        }
    }

    async placeBid(req, res, next) {
        try {
            const bidId = await this.sellerService.placeBid(req.body);
            res.status(201).json({ success: true, message: 'Bid placed successfully', data: { bidId } });
        } catch (err) {
            next(err);
        }
    }

    async getSellerBids(req, res, next) {
        try {
            const sellerId = req.params.sellerId;
            const bids = await this.sellerService.getBidsBySeller(sellerId);
            res.json({ success: true, data: bids });
        } catch (err) {
            next(err);
        }
    }

    async getProducts(req, res, next) {
        try {
            const sellerId = req.params.sellerId || req.query.sellerId;
            const products = await this.sellerService.getProducts(sellerId);
            res.json({ success: true, data: products });
        } catch (err) {
            next(err);
        }
    }

    async updateInventory(req, res, next) {
        try {
            const { productId, quantity } = req.body;
            await this.sellerService.updateInventory(productId, quantity);
            res.json({ success: true, message: 'Inventory updated successfully' });
        } catch (err) {
            next(err);
        }
    }

    async getDashboardStats(req, res, next) {
        try {
            const sellerId = req.params.sellerId || req.query.sellerId;
            const stats = await this.sellerService.getDashboardStats(sellerId);
            res.json({ success: true, data: stats });
        } catch (err) {
            next(err);
        }
    }

    async getSalesHistory(req, res, next) {
        try {
            const sellerId = req.params.sellerId || req.query.sellerId;
            const history = await this.sellerService.getSalesHistory(sellerId);
            res.json({ success: true, data: history });
        } catch (err) {
            next(err);
        }
    }

    async getOrders(req, res, next) {
        try {
            const sellerId = req.params.sellerId || req.query.sellerId;
            const orders = await this.sellerService.getOrders(sellerId);
            res.json({ success: true, data: orders });
        } catch (err) {
            next(err);
        }
    }

    async addProduct(req, res, next) {
        try {
            const sellerId = req.body.sellerId || req.query.sellerId;
            const productId = await this.sellerService.addProduct(sellerId, req.body);
            res.json({ success: true, data: { productId }, message: 'Product added successfully' });
        } catch (err) {
            next(err);
        }
    }

    async updateProduct(req, res, next) {
        try {
            const productId = req.params.productId;
            await this.sellerService.updateProduct(productId, req.body);
            res.json({ success: true, message: 'Product updated successfully' });
        } catch (err) {
            next(err);
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const productId = req.params.productId;
            await this.sellerService.deleteProduct(productId);
            res.json({ success: true, message: 'Product deleted successfully' });
        } catch (err) {
            next(err);
        }
    }

    async getPromotions(req, res, next) {
        try {
            const sellerId = req.params.sellerId || req.query.sellerId;
            const promos = await this.sellerService.getPromotions(sellerId);
            res.json({ success: true, data: promos });
        } catch (err) {
            next(err);
        }
    }

    async createPromotion(req, res, next) {
        try {
            await this.sellerService.createPromotion(req.body);
            res.json({ success: true, message: 'Promotion created successfully' });
        } catch (err) {
            next(err);
        }
    }

    async getEarnings(req, res, next) {
        try {
            const sellerId = req.params.sellerId || req.query.sellerId;
            const earnings = await this.sellerService.getEarnings(sellerId);
            res.json({ success: true, data: earnings });
        } catch (err) {
            next(err);
        }
    }

    async deletePromotion(req, res, next) {
        try {
            const dealId = req.params.dealId;
            await this.sellerService.deletePromotion(dealId);
            res.json({ success: true, message: 'Promotion deleted successfully' });
        } catch (err) {
            next(err);
        }
    }

    async updateOrderStatus(req, res, next) {
        try {
            const { orderId, status } = req.body;
            await this.sellerService.updateOrderStatus(orderId, status);
            res.json({ success: true, message: 'Order status updated successfully' });
        } catch (err) {
            next(err);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const sellerId = req.params.sellerId;
            await this.sellerService.updateProfile(sellerId, req.body);
            res.json({ success: true, message: 'Profile updated successfully' });
        } catch (err) {
            next(err);
        }
    }

    async getCategories(req, res, next) {
        try {
            const categories = await this.sellerService.getCategories();
            res.json({ success: true, data: categories });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = SellerController;