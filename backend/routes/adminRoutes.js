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
})();

module.exports = router;
