// backend/factories/BidFactory.js
//
// DESIGN PATTERN: Factory Method
//   Centralises the transformation from raw DB rows into clean domain objects
//   (DTOs).  Controllers and services never manually map DB columns — they call
//   the factory.  This means column renames in the DB only require ONE change.
//
// SOLID:
//   SRP — this class has exactly one job: shape bid/request data for consumers.
//   OCP — add new factory methods for new shapes without touching existing ones.

class BidFactory {

    /**
     * Maps a single raw ProductRequests row → clean Request DTO.
     */
    static createRequest(row) {
        return {
            id:            row.request_id,
            productName:   row.product_name,
            description:   row.description   || '',
            category:      row.category_name || 'Uncategorised',
            quantity:      row.quantity,
            maxBudget:     row.max_budget    || null,
            status:        row.request_status,
            createdAt:     row.created_at,
            timeAgo:       BidFactory._timeAgo(row.created_at),
            customerName:  row.customer_name || 'Anonymous',
            bidCount:      row.bid_count     ?? 0,
            bids:          (row.bids || []).map(BidFactory.createBid),
        };
    }

    /**
     * Maps a single raw ProductRequestBids row → clean Bid DTO.
     */
    static createBid(row) {
        return {
            id:                   row.bid_id,
            storeName:            row.store_name,
            storeRating:          parseFloat(row.store_rating) || 0,
            bidPrice:             parseFloat(row.bid_price),
            estimatedDeliveryDays: row.estimated_delivery_days || null,
            status:               row.bid_status,
            createdAt:            row.created_at,
            linkedProductName:    row.linked_product_name  || null,
            linkedProductImage:   row.linked_product_image || null,
        };
    }

    /**
     * Maps a request row that also carries its bids array.
     */
    static createRequestWithBids(requestRow) {
        const request = BidFactory.createRequest(requestRow);
        request.bids = (requestRow.bids || []).map(BidFactory.createBid);
        request.bidCount = request.bids.length;
        return request;
    }

    /**
     * Maps an array of flat request rows (from getOpenRequests query).
     */
    static createMultipleRequests(rows) {
        return rows.map(BidFactory.createRequest);
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    static _timeAgo(dateString) {
        const now  = new Date();
        const past = new Date(dateString);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1)   return 'just now';
        if (diffMins < 60)  return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
        const diffHrs = Math.floor(diffMins / 60);
        if (diffHrs < 24)   return `${diffHrs} hour${diffHrs === 1 ? '' : 's'} ago`;
        const diffDays = Math.floor(diffHrs / 24);
        return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    }
}

module.exports = BidFactory;
