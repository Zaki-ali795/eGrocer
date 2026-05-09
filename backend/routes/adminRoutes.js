// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getPool } = require('../config/db');
const AdminRepository = require('../repositories/AdminRepository');
const AdminService = require('../services/AdminService');
const AdminController = require('../controllers/AdminController');

(async () => {
    const pool = await getPool();
    const repo = new AdminRepository(pool);
    const service = new AdminService(repo);
    const controller = new AdminController(service);

    router.get('/dashboard/overview', controller.getDashboardOverview);
    router.get('/users', controller.getUsers);
    router.get('/categories', controller.getCategories);
    router.get('/products', controller.getProducts);
    router.get('/orders', controller.getOrders);
    router.get('/flash-deals', controller.getFlashDeals);
    router.get('/inventory', controller.getInventory);
    router.get('/promotions', controller.getPromotions);
    router.get('/payments', controller.getPayments);
    router.get('/product-requests', controller.getProductRequests);
})();

module.exports = router;
