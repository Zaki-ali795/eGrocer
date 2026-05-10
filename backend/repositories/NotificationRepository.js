// repositories/NotificationRepository.js
const BaseRepository = require('./BaseRepository');

class NotificationRepository extends BaseRepository {
    constructor(pool) {
        super(pool);
    }

    async getNotifications(userId) {
        const result = await this.pool
            .request()
            .input('userId', userId)
            .query(`
                SELECT TOP 20
                    notification_id,
                    notification_type,
                    title,
                    message,
                    reference_id,
                    is_read,
                    created_at
                FROM Notifications
                WHERE user_id = @userId
                ORDER BY created_at DESC
            `);
        return result.recordset;
    }

    async markAsRead(notificationId) {
        await this.pool
            .request()
            .input('id', notificationId)
            .query(`UPDATE Notifications SET is_read = 1 WHERE notification_id = @id`);
    }

    async markAllAsRead(userId) {
        await this.pool
            .request()
            .input('userId', userId)
            .query(`UPDATE Notifications SET is_read = 1 WHERE user_id = @userId`);
    }

    async getSettings(userId) {
        const result = await this.pool
            .request()
            .input('userId', userId)
            .query(`SELECT * FROM NotificationSettings WHERE user_id = @userId`);
        
        if (result.recordset.length === 0) {
            // Create default settings if they don't exist
            await this.pool.request()
                .input('userId', userId)
                .query(`INSERT INTO NotificationSettings (user_id) VALUES (@userId)`);
            
            const newResult = await this.pool.request()
                .input('userId', userId)
                .query(`SELECT * FROM NotificationSettings WHERE user_id = @userId`);
            return newResult.recordset[0];
        }
        return result.recordset[0];
    }

    async updateSettings(userId, settings) {
        const { new_orders, low_stock, new_customer_requests, promotion_updates, weekly_sales_report } = settings;
        await this.pool
            .request()
            .input('userId', userId)
            .input('new_orders', new_orders ? 1 : 0)
            .input('low_stock', low_stock ? 1 : 0)
            .input('new_customer_requests', new_customer_requests ? 1 : 0)
            .input('promotion_updates', promotion_updates ? 1 : 0)
            .input('weekly_sales_report', weekly_sales_report ? 1 : 0)
            .query(`
                UPDATE NotificationSettings
                SET new_orders = @new_orders,
                    low_stock = @low_stock,
                    new_customer_requests = @new_customer_requests,
                    promotion_updates = @promotion_updates,
                    weekly_sales_report = @weekly_sales_report,
                    updated_at = GETDATE()
                WHERE user_id = @userId
            `);
    }

    async addNotification({ userId, type, title, message, referenceId }) {
        await this.pool
            .request()
            .input('userId', userId)
            .input('type', type)
            .input('title', title)
            .input('message', message)
            .input('refId', referenceId || null)
            .query(`
                INSERT INTO Notifications (user_id, notification_type, title, message, reference_id)
                VALUES (@userId, @type, @title, @message, @refId)
            `);
    }
}

module.exports = NotificationRepository;
