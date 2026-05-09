// routes/wishlistRoutes.js
const express = require('express');
const { getPool } = require('../config/db');
const WishlistRepository = require('../repositories/WishlistRepository');
const WishlistController = require('../controllers/WishlistController');

const router = express.Router();

async function getController() {
    const pool = await getPool();
    const repo = new WishlistRepository(pool);
    return new WishlistController(repo);
}

router.get('/', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getWishlist(req, res, next);
});

router.post('/toggle', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.toggleWishlist(req, res, next);
});

router.delete('/:productId', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.removeFromWishlist(req, res, next);
});

module.exports = router;
