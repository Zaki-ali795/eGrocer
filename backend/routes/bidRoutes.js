// backend/routes/bidRoutes.js
//
// DESIGN PATTERN: Singleton (controller instance)
//   The controller (and by extension the service + repo) is built ONCE and
//   reused for every request via the `getController()` lazy-init pattern,
//   consistent with orderRoutes.js and productRoutes.js.
//
// SOLID:
//   SRP  — this file only declares routes and wires the DI chain.
//   DIP  — route handlers depend on the controller abstraction, not DB directly.

const express         = require('express');
const { getPool }     = require('../config/db');
const BidRepository   = require('../repositories/BidRepository');
const BidService      = require('../services/BidService');
const BidController   = require('../controllers/BidController');

const router = express.Router();

// ── Dependency Injection chain ─────────────────────────────────────────────
// Pool (Singleton) → Repository → Service → Controller
async function buildController() {
    const pool    = await getPool();            // Singleton pool
    const repo    = new BidRepository(pool);
    const service = new BidService(repo);
    return new BidController(service);
}

let controller;
async function getController() {
    if (!controller) controller = await buildController();
    return controller;
}

// ── Routes ──────────────────────────────────────────────────────────────────

// POST /api/bids/requests  — customer submits a product request
router.post('/requests', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.submitRequest(req, res, next);
});

// GET /api/bids/requests   — list all open requests (for the UI bidding section)
router.get('/requests', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getOpenRequests(req, res, next);
});

// GET /api/bids/requests/:requestId  — get a request + all its bids
router.get('/requests/:requestId', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.getRequestWithBids(req, res, next);
});

// POST /api/bids/requests/:requestId/bids  — seller places a bid
router.post('/requests/:requestId/bids', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.submitBid(req, res, next);
});

// PATCH /api/bids/requests/:requestId/bids/:bidId/accept  — customer accepts a bid
router.patch('/requests/:requestId/bids/:bidId/accept', async (req, res, next) => {
    const ctrl = await getController();
    return ctrl.acceptBid(req, res, next);
});

module.exports = router;
