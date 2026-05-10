// backend/repositories/BidRepository.js
//
// SOLID & Design Pattern Compliance:
//  SRP  — This class is ONLY responsible for DB access related to bids/requests.
//  DIP  — Depends on the BaseRepository abstraction, not a concrete pool caller.
//  OCP  — Add new query methods here; nothing else needs to change.
//  Singleton Pool — the pool injected here is the same singleton instance shared
//                   across all repositories (see config/db.js).

const BaseRepository = require('./BaseRepository');

class BidRepository extends BaseRepository {
    constructor(pool) {
        super(pool);
    }

    // ── ProductRequests ────────────────────────────────────────────────────────

    /**
     * Insert a new product request.
     * @param {object} data - { customerId, productName, description, categoryId, quantity, maxBudget }
     * @returns {object} { requestId }
     */
    async createRequest(data) {
        const req = this.pool.request();
        req.input('customerId',   data.customerId);
        req.input('productName',  data.productName);
        req.input('description',  data.description  || null);
        req.input('categoryId',   data.categoryId   || null);
        req.input('quantity',     data.quantity      || 1);
        req.input('maxBudget',    data.maxBudget     || null);

        const result = await req.query(`
            INSERT INTO ProductRequests
                (customer_id, product_name, description, category_id, quantity, max_budget)
            OUTPUT inserted.request_id
            VALUES
                (@customerId, @productName, @description, @categoryId, @quantity, @maxBudget);
        `);

        return { requestId: result.recordset[0].request_id };
    }

    /**
     * Fetch all open requests, newest first, with their associated bids.
     */
    async getOpenRequests() {
        const result = await this.pool.request().query(`
            SELECT
                pr.request_id,
                pr.product_name,
                pr.description,
                pr.quantity,
                pr.max_budget,
                pr.request_status,
                pr.created_at,
                c.category_name,
                u.first_name + ' ' + u.last_name AS customer_name
            FROM ProductRequests pr
            LEFT JOIN Categories c ON pr.category_id = c.category_id
            INNER JOIN Customers cu ON pr.customer_id = cu.customer_id
            INNER JOIN Users u ON cu.customer_id = u.user_id
            WHERE pr.request_status = 'open'
            ORDER BY pr.created_at DESC
        `);
        
        const requests = result.recordset;
        if (requests.length === 0) return [];

        const requestIds = requests.map(r => r.request_id).join(',');
        const bidsResult = await this.pool.request().query(`
            SELECT
                b.bid_id, b.request_id, b.bid_price, b.estimated_delivery_days,
                b.bid_status, b.created_at,
                s.store_name, s.store_rating,
                p.product_name AS linked_product_name, p.image_url AS linked_product_image
            FROM ProductRequestBids b
            INNER JOIN Sellers s ON b.seller_id = s.seller_id
            LEFT JOIN Products p ON b.product_id = p.product_id
            WHERE b.request_id IN (${requestIds})
            ORDER BY b.bid_price ASC
        `);

        const bids = bidsResult.recordset;

        // Group bids by request_id and merge into requests
        return requests.map(req => ({
            ...req,
            bid_count: bids.filter(b => b.request_id === req.request_id).length,
            bids:      bids.filter(b => b.request_id === req.request_id)
        }));
    }

    /**
     * Fetch a single request with all its bids.
     */
    async getRequestWithBids(requestId) {
        const req = this.pool.request();
        req.input('requestId', requestId);

        const reqResult = await req.query(`
            SELECT
                pr.request_id, pr.product_name, pr.description,
                pr.quantity, pr.max_budget, pr.request_status, pr.created_at,
                c.category_name,
                u.first_name + ' ' + u.last_name AS customer_name
            FROM ProductRequests pr
            LEFT JOIN Categories c ON pr.category_id = c.category_id
            INNER JOIN Customers cu ON pr.customer_id = cu.customer_id
            INNER JOIN Users u ON cu.customer_id = u.user_id
            WHERE pr.request_id = @requestId
        `);

        if (!reqResult.recordset.length) return null;

        const bidReq = this.pool.request();
        bidReq.input('requestId', requestId);

        const bidsResult = await bidReq.query(`
            SELECT
                b.bid_id, b.bid_price, b.estimated_delivery_days,
                b.bid_status, b.created_at,
                s.store_name, s.store_rating,
                p.product_name AS linked_product_name, p.image_url AS linked_product_image
            FROM ProductRequestBids b
            INNER JOIN Sellers s ON b.seller_id = s.seller_id
            LEFT JOIN Products p ON b.product_id = p.product_id
            WHERE b.request_id = @requestId
            ORDER BY b.bid_price ASC
        `);

        return {
            ...reqResult.recordset[0],
            bids: bidsResult.recordset
        };
    }

    // ── ProductRequestBids ─────────────────────────────────────────────────────

    /**
     * Insert a bid on an existing request.
     * @param {object} data - { requestId, sellerId, bidPrice, estimatedDeliveryDays, productId }
     * @returns {object} { bidId }
     */
    async createBid(data) {
        const req = this.pool.request();
        req.input('requestId',            data.requestId);
        req.input('sellerId',             data.sellerId);
        req.input('bidPrice',             data.bidPrice);
        req.input('estimatedDeliveryDays', data.estimatedDeliveryDays || null);
        req.input('productId',            data.productId || null);

        const result = await req.query(`
            INSERT INTO ProductRequestBids
                (request_id, seller_id, bid_price, estimated_delivery_days, product_id)
            OUTPUT inserted.bid_id
            VALUES
                (@requestId, @sellerId, @bidPrice, @estimatedDeliveryDays, @productId);
        `);

        return { bidId: result.recordset[0].bid_id };
    }

    /**
     * Accept a bid — marks bid as 'accepted', all others on same request as 'rejected',
     * and closes the request.  All inside a transaction.
     */
    async acceptBid(bidId, requestId) {
        const transaction = this.pool.transaction();
        try {
            await transaction.begin();

            const acceptReq = transaction.request();
            acceptReq.input('bidId', bidId);
            await acceptReq.query(`
                UPDATE ProductRequestBids SET bid_status = 'accepted' WHERE bid_id = @bidId;
            `);

            const rejectReq = transaction.request();
            rejectReq.input('bidId',      bidId);
            rejectReq.input('requestId',  requestId);
            await rejectReq.query(`
                UPDATE ProductRequestBids
                SET bid_status = 'rejected'
                WHERE request_id = @requestId AND bid_id <> @bidId;
            `);

            const closeReq = transaction.request();
            closeReq.input('requestId', requestId);
            await closeReq.query(`
                UPDATE ProductRequests SET request_status = 'fulfilled' WHERE request_id = @requestId;
            `);

            await transaction.commit();
            return { success: true };
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

    /**
     * Fetch all requests submitted by a specific customer.
     */
    async getRequestsByCustomerId(customerId) {
        const req = this.pool.request();
        req.input('customerId', customerId);

        const result = await req.query(`
            SELECT 
                pr.request_id, pr.product_name, pr.description, pr.quantity, pr.max_budget, pr.request_status, pr.created_at,
                c.category_name,
                u.first_name + ' ' + u.last_name as customer_name,
                (SELECT COUNT(*) FROM ProductRequestBids prb WHERE prb.request_id = pr.request_id) as bid_count
            FROM ProductRequests pr
            INNER JOIN Categories c ON pr.category_id = c.category_id
            INNER JOIN Users u ON pr.customer_id = u.user_id
            WHERE pr.customer_id = @customerId
            ORDER BY pr.created_at DESC
        `);

        return result.recordset;
    }
}

module.exports = BidRepository;
