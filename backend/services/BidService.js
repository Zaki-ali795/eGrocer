// backend/services/BidService.js
//
// SOLID:
//   SRP — orchestrates bid/request business logic ONLY. No DB code, no HTTP.
//   DIP — depends on BidRepository abstraction (injected), not a concrete class.
//   OCP — extend with acceptBid(), closeBid() etc. without touching other services.
//
// DESIGN PATTERN: Adapter
//   BidService adapts raw repository data (DB rows) into application-level
//   domain objects via BidFactory.  The controller talks to BidService;
//   BidService adapts the BidRepository's persistence format to a clean API.

const BidFactory = require('../factories/BidFactory');

class BidService {
    /**
     * @param {BidRepository} bidRepo
     */
    constructor(bidRepo) {
        this.bidRepo = bidRepo;
    }

    /**
     * Submit a new product request from a customer.
     * Business rule: maxBudget must be positive if provided.
     */
    async submitRequest(customerId, { productName, description, categoryId, quantity, maxBudget }) {
        if (!productName || !productName.trim()) {
            throw new Error('Product name is required.');
        }
        if (maxBudget !== undefined && maxBudget !== null && maxBudget <= 0) {
            throw new Error('Max budget must be a positive number.');
        }

        return this.bidRepo.createRequest({
            customerId,
            productName: productName.trim(),
            description: description?.trim() || null,
            categoryId:  categoryId  || null,
            quantity:    quantity    || 1,
            maxBudget:   maxBudget   || null,
        });
    }

    /**
     * Fetch all open product requests with bid counts.
     */
    async getOpenRequests() {
        const rows = await this.bidRepo.getOpenRequests();
        return BidFactory.createMultipleRequests(rows);
    }

    /**
     * Fetch a single request with all its bids (sorted by price ASC in DB).
     */
    async getRequestWithBids(requestId) {
        const data = await this.bidRepo.getRequestWithBids(requestId);
        if (!data) throw new Error(`Request ${requestId} not found.`);
        return BidFactory.createRequestWithBids(data);
    }

    /**
     * Submit a bid on an existing request (seller action).
     * Business rule: bidPrice must be positive.
     */
    async submitBid(sellerId, requestId, { bidPrice, estimatedDeliveryDays, productId }) {
        if (!bidPrice || bidPrice <= 0) {
            throw new Error('Bid price must be a positive number.');
        }
        return this.bidRepo.createBid({
            requestId,
            sellerId,
            bidPrice,
            estimatedDeliveryDays: estimatedDeliveryDays || null,
            productId:             productId || null,
        });
    }

    /**
     * Accept a bid (customer action) — fulfils the request.
     */
    async acceptBid(bidId, requestId) {
        return this.bidRepo.acceptBid(bidId, requestId);
    }

    /**
     * Returns all requests made by a specific customer.
     */
    async getMyRequests(customerId) {
        if (!customerId || isNaN(Number(customerId))) {
            const err = new Error('Invalid customer ID.'); err.status = 400; throw err;
        }

        const rawRows = await this.bidRepo.getRequestsByCustomerId(Number(customerId));
        return rawRows.map(row => BidFactory.createRequest(row));
    }
}

module.exports = BidService;
