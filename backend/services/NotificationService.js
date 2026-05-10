// services/NotificationService.js

class NotificationService {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    async getNotifications(userId) {
        return await this.notificationRepository.getNotifications(userId);
    }

    async markAsRead(notificationId) {
        return await this.notificationRepository.markAsRead(notificationId);
    }

    async markAllAsRead(userId) {
        return await this.notificationRepository.markAllAsRead(userId);
    }

    async getSettings(userId) {
        return await this.notificationRepository.getSettings(userId);
    }

    async updateSettings(userId, settings) {
        return await this.notificationRepository.updateSettings(userId, settings);
    }

    async notify(userId, type, title, message, referenceId) {
        // Business Rule: Check settings before sending (optional, usually done at trigger point)
        const settings = await this.notificationRepository.getSettings(userId);
        
        let shouldNotify = true;
        if (type === 'order' && !settings.new_orders) shouldNotify = false;
        if (type === 'stock' && !settings.low_stock) shouldNotify = false;
        if (type === 'request' && !settings.new_customer_requests) shouldNotify = false;
        if (type === 'promotion' && !settings.promotion_updates) shouldNotify = false;

        if (shouldNotify) {
            await this.notificationRepository.addNotification({ userId, type, title, message, referenceId });
        }
    }
}

module.exports = NotificationService;
