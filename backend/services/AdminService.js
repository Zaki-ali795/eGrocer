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

    // --- WRITE OPERATIONS ---

    async createProduct(data) {
        return await this.adminRepository.createProduct(data);
    }

    async updateProduct(id, data) {
        return await this.adminRepository.updateProduct(id, data);
    }

    async deleteProduct(id) {
        return await this.adminRepository.deleteProduct(id);
    }

    async createCategory(data) {
        return await this.adminRepository.createCategory(data);
    }

    async updateCategory(id, data) {
        return await this.adminRepository.updateCategory(id, data);
    }

    async deleteCategory(id) {
        return await this.adminRepository.deleteCategory(id);
    }

    async updateOrderStatus(id, status) {
        return await this.adminRepository.updateOrderStatus(id, status);
    }

    async adjustStock(productId, quantity) {
        return await this.adminRepository.adjustStock(productId, quantity);
    }

    async createFlashDeal(data) {
        return await this.adminRepository.createFlashDeal(data);
    }

    async endFlashDeal(id) {
        return await this.adminRepository.endFlashDeal(id);
    }

    async createPromotion(data) {
        return await this.adminRepository.createPromotion(data);
    }

    async deletePromotion(id) {
        return await this.adminRepository.deletePromotion(id);
    }

    async toggleUserStatus(id, isActive) {
        return await this.adminRepository.toggleUserStatus(id, isActive);
    }

    async updateSettings(data) {
        return await this.adminRepository.updateSettings(data);
    }
}

module.exports = AdminService;
