// routes/productRoutes.js
const express = require('express');
const { getPool } = require('../config/db');
const ProductRepository = require('../repositories/ProductRepository');
const ProductService = require('../services/ProductService');
const ProductController = require('../controllers/ProductController');

const router = express.Router();

// Wire up the dependency chain: Pool → Repo → Service → Controller
async function buildController() {
    const pool = await getPool();
    const repo = new ProductRepository(pool);
    const service = new ProductService(repo);
    return new ProductController(service);
}

// Lazy-initialise controller on first request (pool is ready by then)
let controller;
async function getController() {
    if (!controller) controller = await buildController();
    return controller;
}

// ── Routes ────────────────────────────────────────────────────────
// GET /api/products/categories
router.get('/categories', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getCategories(req, res, next);
});

// GET /api/products/featured?limit=8
router.get('/featured', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getFeaturedProducts(req, res, next);
});

// GET /api/products/flash-deals
router.get('/flash-deals', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getFlashDeals(req, res, next);
});

// GET /api/products/search?q=&minPrice=&maxPrice=&brands=&categoryId=&inStockOnly=
router.get('/search', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.searchProducts(req, res, next);
});

// GET /api/products/brands?categoryId=
router.get('/brands', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getBrands(req, res, next);
});

// GET /api/products/category/:categoryId
router.get('/category/:categoryId', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getProductsByCategory(req, res, next);
});

// GET /api/products/:productId
router.get('/:productId', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getProductById(req, res, next);
});

module.exports = router;
