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
}

module.exports = AdminController;
