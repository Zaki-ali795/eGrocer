// routes/sellerRoutes.js
const express = require('express');
const router = express.Router();

// Dependency Injection Factory (Simple Version)
const { getPool } = require('../config/db');
const SellerRepository = require('../repositories/SellerRepository');
const SellerService = require('../services/SellerService');
const SellerController = require('../controllers/SellerController');

async function getController() {
    const pool = await getPool();
    const repo = new SellerRepository(pool);
    const service = new SellerService(repo);
    return new SellerController(service);
}

router.get('/profile/:sellerId', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getProfile(req, res, next);
});

router.get('/requests', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getOpenRequests(req, res, next);
});

router.get('/bids/:sellerId', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getSellerBids(req, res, next);
});

router.get('/products/:sellerId', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getProducts(req, res, next);
});

router.patch('/inventory', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.updateInventory(req, res, next);
});

router.get('/stats/:sellerId', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getDashboardStats(req, res, next);
});

router.get('/stats/history/:sellerId', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getSalesHistory(req, res, next);
});

router.get('/orders/:sellerId', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getOrders(req, res, next);
});

router.post('/products', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.addProduct(req, res, next);
});

router.put('/products/:productId', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.updateProduct(req, res, next);
});

router.delete('/products/:productId', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.deleteProduct(req, res, next);
});

router.get('/promotions/:sellerId', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getPromotions(req, res, next);
});

router.post('/promotions', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.createPromotion(req, res, next);
});

router.delete('/promotions/:dealId', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.deletePromotion(req, res, next);
});

router.get('/earnings/:sellerId', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getEarnings(req, res, next);
});

router.post('/bid', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.placeBid(req, res, next);
});

router.patch('/orders/status', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.updateOrderStatus(req, res, next);
});

router.put('/profile/:sellerId', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.updateProfile(req, res, next);
});

router.get('/categories', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getCategories(req, res, next);
});

module.exports = router;