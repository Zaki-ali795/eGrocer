// routes/sellerRoutes.js
const express = require('express');
const router = express.Router();

// Dependency Injection Factory (Simple Version)
const { getPool } = require('../config/db');
const SellerRepository = require('../repositories/SellerRepository');
const SellerService = require('../services/SellerService');
const SellerController = require('../controllers/SellerController');

// Using a factory pattern or async closure to inject the DB pool
(async () => {
    const pool = await getPool();
    const repo = new SellerRepository(pool);
    const service = new SellerService(repo);
    const controller = new SellerController(service);

    router.get('/profile/:sellerId', controller.getProfile);
    router.get('/requests', controller.getOpenRequests);
    router.get('/bids/:sellerId', controller.getSellerBids);
    router.get('/products/:sellerId', controller.getProducts);
    router.patch('/inventory', controller.updateInventory);
    router.get('/stats/:sellerId', controller.getDashboardStats);
    router.get('/orders/:sellerId', controller.getOrders);
    router.post('/products', controller.addProduct);
    router.put('/products/:productId', controller.updateProduct);
    router.delete('/products/:productId', controller.deleteProduct);
    router.get('/promotions/:sellerId', controller.getPromotions);
    router.post('/promotions', controller.createPromotion);
    router.delete('/promotions/:dealId', controller.deletePromotion);
    router.get('/earnings/:sellerId', controller.getEarnings);
    router.post('/bid', controller.placeBid);
    router.patch('/orders/status', controller.updateOrderStatus);
    router.put('/profile/:sellerId', controller.updateProfile);
    router.get('/categories', controller.getCategories);
})();

module.exports = router;