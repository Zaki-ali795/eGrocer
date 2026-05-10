// backend/routes/cartRoutes.js
const express = require('express');
const { getPool } = require('../config/db');
const CartRepository = require('../repositories/CartRepository');
const CartController = require('../controllers/CartController');

const router = express.Router();

async function getController() {
    const pool = await getPool();
    const repo = new CartRepository(pool);
    return new CartController(repo);
}

router.get('/', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getCart(req, res, next);
});

router.post('/items', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.addItem(req, res, next);
});

router.put('/items/:productId', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.updateQuantity(req, res, next);
});

router.delete('/items/:productId', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.removeItem(req, res, next);
});

router.delete('/', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.clearCart(req, res, next);
});

module.exports = router;
