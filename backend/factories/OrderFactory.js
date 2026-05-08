// backend/factories/OrderFactory.js

class OrderFactory {
    /**
     * Reconstructs a structured Order object (with nested items[]) from flat SQL JOIN rows.
     * - customer_id replaces user_id (Class Table Inheritance)
     * - total_amount from OrdersWithTotal view (BCNF — not stored)
     * - delivery_fee / total_delivery_fee from Deliveries join / view
     * - delivery_status, estimated_delivery_date, actual_delivery_date from Deliveries
     */
    static createFromDbRows(rows) {
        if (!rows || rows.length === 0) return null;

        const order = {
            order_id:                rows[0].order_id,
            order_number:            rows[0].order_number,
            customer_id:             rows[0].customer_id,
            subtotal:                rows[0].subtotal,
            tax_amount:              rows[0].tax_amount,
            discount_amount:         rows[0].discount_amount,
            delivery_fee:            rows[0].total_delivery_fee ?? rows[0].delivery_fee ?? 0,
            total_amount:            rows[0].total_amount,
            order_status:            rows[0].order_status,
            payment_status:          rows[0].payment_status,
            payment_method:          rows[0].payment_method,
            delivery_status:         rows[0].delivery_status || 'pending',
            estimated_delivery_date: rows[0].estimated_delivery_date,
            actual_delivery_date:    rows[0].actual_delivery_date,
            created_at:              rows[0].created_at,
            items:                   []
        };

        const itemMap = new Map();
        rows.forEach(row => {
            if (row.order_item_id && !itemMap.has(row.order_item_id)) {
                const item = {
                    order_item_id: row.order_item_id,
                    product_id:    row.product_id,
                    product_name:  row.product_name,
                    image_url:     row.image_url,
                    quantity:      row.quantity,
                    unit_price:    row.unit_price,
                    brand:         row.brand
                };
                itemMap.set(row.order_item_id, item);
                order.items.push(item);
            }
        });

        return order;
    }

    static createMultipleFromDbRows(rows) {
        if (!rows || rows.length === 0) return [];
        const orderMap = new Map();
        rows.forEach(row => {
            if (!orderMap.has(row.order_id)) orderMap.set(row.order_id, []);
            orderMap.get(row.order_id).push(row);
        });
        return Array.from(orderMap.values()).map(orderRows => this.createFromDbRows(orderRows));
    }
}

module.exports = OrderFactory;
