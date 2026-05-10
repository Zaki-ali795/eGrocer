// controllers/NotificationController.js

class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
        this.getNotifications = this.getNotifications.bind(this);
        this.markAsRead = this.markAsRead.bind(this);
        this.markAllAsRead = this.markAllAsRead.bind(this);
        this.getSettings = this.getSettings.bind(this);
        this.updateSettings = this.updateSettings.bind(this);
    }

    async getNotifications(req, res, next) {
        try {
            const userId = req.query.userId || req.params.userId;
            const notifications = await this.notificationService.getNotifications(userId);
            res.json({ success: true, data: notifications });
        } catch (err) {
            next(err);
        }
    }

    async markAsRead(req, res, next) {
        try {
            const { notificationId } = req.params;
            await this.notificationService.markAsRead(notificationId);
            res.json({ success: true, message: 'Notification marked as read' });
        } catch (err) {
            next(err);
        }
    }

    async markAllAsRead(req, res, next) {
        try {
            const { userId } = req.body;
            await this.notificationService.markAllAsRead(userId);
            res.json({ success: true, message: 'All notifications marked as read' });
        } catch (err) {
            next(err);
        }
    }

    async getSettings(req, res, next) {
        try {
            const { userId } = req.params;
            const settings = await this.notificationService.getSettings(userId);
            res.json({ success: true, data: settings });
        } catch (err) {
            next(err);
        }
    }

    async updateSettings(req, res, next) {
        try {
            const { userId } = req.params;
            await this.notificationService.updateSettings(userId, req.body);
            res.json({ success: true, message: 'Notification settings updated' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = NotificationController;
