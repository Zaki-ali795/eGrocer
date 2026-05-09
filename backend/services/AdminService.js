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
}

module.exports = AdminService;
