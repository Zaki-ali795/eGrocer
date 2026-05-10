// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { getPool } = require('../config/db');
const NotificationRepository = require('../repositories/NotificationRepository');
const NotificationService = require('../services/NotificationService');
const NotificationController = require('../controllers/NotificationController');

// Manual DI
async function getController() {
    const pool = await getPool();
    const repository = new NotificationRepository(pool);
    const service = new NotificationService(repository);
    return new NotificationController(service);
}

router.get('/settings/:userId', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getSettings(req, res, next);
});

router.put('/settings/:userId', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.updateSettings(req, res, next);
});

router.get('/:userId', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getNotifications(req, res, next);
});

router.patch('/read/:notificationId', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.markAsRead(req, res, next);
});

router.post('/read-all', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.markAllAsRead(req, res, next);
});

module.exports = router;
