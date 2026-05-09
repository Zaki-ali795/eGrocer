// services/AdminService.js

class AdminService {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }

    async getDashboardOverview() {
        const [stats, revenueHistory, topCategories, recentActivity] = await Promise.all([
            this.adminRepository.getPlatformStats(),
            this.adminRepository.getRevenueHistory(),
            this.adminRepository.getTopCategories(),
            this.adminRepository.getRecentActivity()
        ]);

        return {
            stats,
            revenueHistory,
            topCategories,
            recentActivity
        };
    }

    async getUsersData() {
        const [users, stats] = await Promise.all([
            this.adminRepository.getAllUsers(),
            this.adminRepository.getUserStats()
        ]);
        return { users, stats };
    }

    async getCategories() {
        return await this.adminRepository.getAllCategories();
    }

    async getProducts() {
        return await this.adminRepository.getAllProducts();
    }

    async getOrders() {
        return await this.adminRepository.getAllOrders();
    }

    async getFlashDeals() {
        return await this.adminRepository.getAllFlashDeals();
    }

    async getInventory() {
        return await this.adminRepository.getInventoryData();
    }

    async getPromotions() {
        return await this.adminRepository.getAllPromotions();
    }

    async getPayments() {
        return await this.adminRepository.getAllPayments();
    }

    async getProductRequests() {
        return await this.adminRepository.getAllProductRequests();
    }
}

module.exports = AdminService;
