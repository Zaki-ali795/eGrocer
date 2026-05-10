// routes/userRoutes.js
const express = require('express');
const { getPool } = require('../config/db');
const UserRepository = require('../repositories/UserRepository');
const UserService = require('../services/UserService');
const UserController = require('../controllers/UserController');

const router = express.Router();

async function buildController() {
    const pool = await getPool();
    const repo = new UserRepository(pool);
    const service = new UserService(repo);
    return new UserController(service);
}

let controller;
async function getController() {
    if (!controller) controller = await buildController();
    return controller;
}

// GET /api/users/me
router.get('/me', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getProfile(req, res, next);
});

// GET /api/users/profile/:id
router.get('/profile/:id', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getProfile(req, res, next);
});

// PUT /api/users/me
router.put('/me', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.updateProfile(req, res, next);
});

// PUT /api/users/profile/:id
router.put('/profile/:id', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.updateProfile(req, res, next);
});

module.exports = router;
