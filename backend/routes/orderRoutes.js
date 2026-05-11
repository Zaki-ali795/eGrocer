// backend/routes/orderRoutes.js
const express = require('express');
const { getPool } = require('../config/db');
const OrderRepository = require('../repositories/OrderRepository');
const ProductRepository = require('../repositories/ProductRepository');
const OrderService = require('../services/OrderService');
const OrderController = require('../controllers/OrderController');

const router = express.Router();

async function buildController() {
    const pool = await getPool();
    const orderRepo = new OrderRepository(pool);
    const productRepo = new ProductRepository(pool);
    const service = new OrderService(orderRepo, productRepo);
    return new OrderController(service);
}

let controller;
async function getController() {
    if (!controller) controller = await buildController();
    return controller;
}

// POST /api/orders/checkout
router.post('/checkout', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.processCheckout(req, res, next);
});

// GET /api/orders/me
router.get('/me', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getMyOrders(req, res, next);
});

// GET /api/orders/tracking
router.get('/tracking', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getTracking(req, res, next);
});

// POST /api/orders/refund-request
router.post('/refund-request', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.requestRefund(req, res, next);
});

module.exports = router;
