// backend/controllers/BidController.js
//
// SOLID:
//   SRP  — handles HTTP concerns ONLY (parse body, call service, format response).
//          No DB queries, no business logic.
//   DIP  — depends on the BidService abstraction injected in the constructor.

class BidController {
    /**
     * @param {import('../services/BidService')} bidService
     */
    constructor(bidService) {
        this.bidService = bidService;
    }

    // ── ProductRequests ────────────────────────────────────────────────────────

    /**
     * POST /api/bids/requests
     * Submit a new product request (customer).
     */
    async submitRequest(req, res, next) {
        try {
            // No auth yet → use first customer as fallback (same pattern as OrderController)
            const customerId = req.user?.user_id ?? 3;

            const { productName, description, categoryId, quantity, maxBudget } = req.body;
            const result = await this.bidService.submitRequest(customerId, {
                productName, description, categoryId, quantity, maxBudget,
            });

            res.status(201).json({
                success: true,
                message: 'Product request submitted successfully!',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/bids/requests
     * List all open product requests.
     */
    async getOpenRequests(req, res, next) {
        try {
            const requests = await this.bidService.getOpenRequests();
            res.json({ success: true, data: requests });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/bids/requests/:requestId
     * Get a single request with all its bids.
     */
    async getRequestWithBids(req, res, next) {
        try {
            const requestId = parseInt(req.params.requestId, 10);
            if (isNaN(requestId)) {
                return res.status(400).json({ success: false, message: 'Invalid request ID.' });
            }
            const data = await this.bidService.getRequestWithBids(requestId);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    // ── ProductRequestBids ─────────────────────────────────────────────────────

    /**
     * POST /api/bids/requests/:requestId/bids
     * Submit a bid on a product request (seller action).
     */
    async submitBid(req, res, next) {
        try {
            const requestId = parseInt(req.params.requestId, 10);
            if (isNaN(requestId)) {
                return res.status(400).json({ success: false, message: 'Invalid request ID.' });
            }

            // No auth yet → use seeded seller_id = 2
            const sellerId = req.user?.user_id ?? 2;

            const { bidPrice, estimatedDeliveryDays, productId } = req.body;
            const result = await this.bidService.submitBid(sellerId, requestId, {
                bidPrice, estimatedDeliveryDays, productId,
            });

            res.status(201).json({
                success: true,
                message: 'Bid submitted successfully!',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /api/bids/requests/:requestId/bids/:bidId/accept
     * Accept a bid on a request (customer action).
     */
    async acceptBid(req, res, next) {
        try {
            const requestId = parseInt(req.params.requestId, 10);
            const bidId     = parseInt(req.params.bidId,     10);
            if (isNaN(requestId) || isNaN(bidId)) {
                return res.status(400).json({ success: false, message: 'Invalid IDs.' });
            }

            const result = await this.bidService.acceptBid(bidId, requestId);
            res.json({ success: true, message: 'Bid accepted! Request fulfilled.', data: result });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = BidController;
