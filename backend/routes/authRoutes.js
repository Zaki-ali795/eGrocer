// routes/authRoutes.js
const express = require('express');
const { getPool } = require('../config/db');
const AuthRepository = require('../repositories/AuthRepository');
const AuthService = require('../services/AuthService');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

async function getController() {
    const pool = await getPool();
    const repo = new AuthRepository(pool);
    const service = new AuthService(repo);
    return new AuthController(service);
}

router.post('/signup', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.signup(req, res, next);
});

router.post('/login', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.login(req, res, next);
});

module.exports = router;
