// controllers/AdminController.js

class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
        this.getDashboardOverview = this.getDashboardOverview.bind(this);
    }

    async getDashboardOverview(req, res, next) {
        try {
            const overview = await this.adminService.getDashboardOverview();
            res.json({ success: true, data: overview });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = AdminController;
