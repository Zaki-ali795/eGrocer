// controllers/AdminController.js

class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
        this.getDashboardOverview = this.getDashboardOverview.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.getCategories = this.getCategories.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.getOrders = this.getOrders.bind(this);
        this.getFlashDeals = this.getFlashDeals.bind(this);
        this.getInventory = this.getInventory.bind(this);
        this.getPromotions = this.getPromotions.bind(this);
        this.getPayments = this.getPayments.bind(this);
        this.getProductRequests = this.getProductRequests.bind(this);

        // Bind write methods
        this.createProduct = this.createProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.createCategory = this.createCategory.bind(this);
        this.updateCategory = this.updateCategory.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
        this.updateOrderStatus = this.updateOrderStatus.bind(this);
        this.adjustStock = this.adjustStock.bind(this);
        this.createFlashDeal = this.createFlashDeal.bind(this);
        this.endFlashDeal = this.endFlashDeal.bind(this);
        this.createPromotion = this.createPromotion.bind(this);
        this.deletePromotion = this.deletePromotion.bind(this);
        this.toggleUserStatus = this.toggleUserStatus.bind(this);
        this.updateSettings = this.updateSettings.bind(this);
        this.getNotifications = this.getNotifications.bind(this);
        this.markNotificationAsRead = this.markNotificationAsRead.bind(this);
    }

    async getDashboardOverview(req, res, next) {
        try {
            const overview = await this.adminService.getDashboardOverview();
            res.json({ success: true, data: overview });
        } catch (err) {
            next(err);
        }
    }

    async getUsers(req, res, next) {
        try {
            const data = await this.adminService.getUsersData();
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    async getCategories(req, res, next) {
        try {
            const data = await this.adminService.getCategories();
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    async getProducts(req, res, next) {
        try {
            const data = await this.adminService.getProducts();
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    async getOrders(req, res, next) {
        try {
            const data = await this.adminService.getOrders();
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    async getFlashDeals(req, res, next) {
        try {
            const data = await this.adminService.getFlashDeals();
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    async getInventory(req, res, next) {
        try {
            const data = await this.adminService.getInventory();
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    async getPromotions(req, res, next) {
        try {
            const data = await this.adminService.getPromotions();
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    async getPayments(req, res, next) {
        try {
            const data = await this.adminService.getPayments();
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    async getProductRequests(req, res, next) {
        try {
            const data = await this.adminService.getProductRequests();
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    // --- WRITE OPERATIONS ---

    async createProduct(req, res, next) {
        try {
            const result = await this.adminService.createProduct(req.body);
            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    async updateProduct(req, res, next) {
        try {
            const result = await this.adminService.updateProduct(req.params.id, req.body);
            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const result = await this.adminService.deleteProduct(req.params.id);
            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    async createCategory(req, res, next) {
        try {
            const result = await this.adminService.createCategory(req.body);
            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    async updateCategory(req, res, next) {
        try {
            const result = await this.adminService.updateCategory(req.params.id, req.body);
            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    async deleteCategory(req, res, next) {
        try {
            const result = await this.adminService.deleteCategory(req.params.id);
            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    async updateOrderStatus(req, res, next) {
        try {
            const result = await this.adminService.updateOrderStatus(req.params.id, req.body.status);
            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    async adjustStock(req, res, next) {
        try {
            const result = await this.adminService.adjustStock(req.params.id, req.body.quantity);
            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    async createFlashDeal(req, res, next) {
        try {
            const result = await this.adminService.createFlashDeal(req.body);
            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    async endFlashDeal(req, res, next) {
        try {
            const result = await this.adminService.endFlashDeal(req.params.id);
            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    async createPromotion(req, res, next) {
        try {
            const result = await this.adminService.createPromotion(req.body);
            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    async deletePromotion(req, res, next) {
        try {
            const result = await this.adminService.deletePromotion(req.params.id);
            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    async toggleUserStatus(req, res, next) {
        try {
            const result = await this.adminService.toggleUserStatus(req.params.id, req.body.isActive);
            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    async updateSettings(req, res, next) {
        try {
            const result = await this.adminService.updateSettings(req.body);
            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    async getNotifications(req, res, next) {
        try {
            // In a real app, get admin ID from token/session. Defaulting to 1.
            const data = await this.adminService.getNotifications(1);
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    async markNotificationAsRead(req, res, next) {
        try {
            const result = await this.adminService.markNotificationAsRead(req.params.id);
            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = AdminController;
