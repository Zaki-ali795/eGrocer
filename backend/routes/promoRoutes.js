// backend/routes/promoRoutes.js
const express = require('express');
const { getPool } = require('../config/db');
const PromoRepository = require('../repositories/PromoRepository');
const PromoController = require('../controllers/PromoController');

const router = express.Router();

async function getController() {
    const pool = await getPool();
    const repo = new PromoRepository(pool);
    return new PromoController(repo);
}

router.post('/validate', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.validateCode(req, res, next);
});

module.exports = router;
