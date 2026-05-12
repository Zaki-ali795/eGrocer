// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getPool } = require('../config/db');
const AdminRepository = require('../repositories/AdminRepository');
const OrderRepository = require('../repositories/OrderRepository');
const AdminService = require('../services/AdminService');
const AdminController = require('../controllers/AdminController');

// Lazy initialization of the controller to avoid blocking route registration
let controller = null;
async function getController() {
    if (controller) return controller;
    const pool = await getPool();
    const adminRepo = new AdminRepository(pool);
    const orderRepo = new OrderRepository(pool);
    const service = new AdminService(adminRepo, orderRepo);
    controller = new AdminController(service);
    return controller;
}

// Helper to wrap controller methods with lazy initialization and error handling
const handle = (method) => async (req, res, next) => {
    console.log(`[AdminRoutes] Handling ${req.method} ${req.url} with method ${method}`);
    try {
        const ctrl = await getController();
        await ctrl[method](req, res, next);
    } catch (err) {
        console.error(`[AdminRoutes] Error in ${method}:`, err);
        next(err);
    }
};

// ── Read Routes ──────────────────────────────────────────────────
router.get('/dashboard/overview', handle('getDashboardOverview'));
router.get('/users', handle('getUsers'));
router.get('/categories', handle('getCategories'));
router.get('/products', handle('getProducts'));
router.get('/orders', handle('getOrders'));
router.get('/flash-deals', handle('getFlashDeals'));
router.get('/inventory', handle('getInventory'));
router.get('/promotions', handle('getPromotions'));
router.get('/payments', handle('getPayments'));
router.get('/product-requests', handle('getProductRequests'));
router.get('/notifications', handle('getNotifications'));
router.put('/notifications/:id/read', handle('markNotificationAsRead'));

// ── Write Routes ─────────────────────────────────────────────────
router.post('/products', handle('createProduct'));
router.put('/products/:id', handle('updateProduct'));
router.delete('/products/:id', handle('deleteProduct'));

router.post('/categories', handle('createCategory'));
router.put('/categories/:id', handle('updateCategory'));
router.delete('/categories/:id', handle('deleteCategory'));

router.put('/orders/:id/status', handle('updateOrderStatus'));
router.put('/inventory/:id/adjust', handle('adjustStock'));

router.post('/flash-deals', handle('createFlashDeal'));
router.put('/flash-deals/:id/end', handle('endFlashDeal'));

router.post('/promotions', handle('createPromotion'));
router.delete('/promotions/:id', handle('deletePromotion'));

router.put('/users/:id/status', handle('toggleUserStatus'));
router.put('/settings', handle('updateSettings'));
router.put('/change-password', handle('changePassword'));
router.put('/update-profile', handle('updateAdminProfile'));
router.post('/orders/refund', handle('processRefund'));

router.use((req, res, next) => {
    console.log(`[AdminRoutes] Catch-all: ${req.method} ${req.url}`);
    next();
});

module.exports = router;
