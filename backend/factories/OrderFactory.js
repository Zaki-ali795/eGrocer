/**
 * Factory Pattern (GoF Creational):
 * Reconstructs structured Order objects from flat SQL JOIN result rows.
 * 
 * Schema adaptation notes:
 * - delivery_fee now comes from the Deliveries table (joined in the query)
 * - total_amount is computed at runtime in the SQL query (BCNF compliance)
 * - user_id → customer_id (references Customers sub-table)
 * - delivery_status added from the Deliveries table
 */
class OrderFactory {
    /**
     * Reconstructs an Order object (with nested items array) from flat SQL rows.
     * @param {Array} rows - The flat rows returned by a SQL JOIN between Orders, Deliveries, and OrderItems
     * @returns {Object|null}
     */
    static createFromDbRows(rows) {
        if (!rows || rows.length === 0) return null;

        const order = {
            order_id: rows[0].order_id,
            order_number: rows[0].order_number,
            customer_id: rows[0].customer_id,
            subtotal: rows[0].subtotal,
            tax_amount: rows[0].tax_amount,
            discount_amount: rows[0].discount_amount,
            delivery_fee: rows[0].delivery_fee || 0,       // from Deliveries table
            total_amount: rows[0].total_amount,              // computed at runtime in SQL
            order_status: rows[0].order_status,
            delivery_status: rows[0].delivery_status || 'pending',  // from Deliveries table
            payment_status: rows[0].payment_status,
            created_at: rows[0].created_at,
            items: []
        };

        const itemMap = new Map();

        rows.forEach(row => {
            if (row.order_item_id && !itemMap.has(row.order_item_id)) {
                const item = {
                    order_item_id: row.order_item_id,
                    product_id: row.product_id,
                    product_name: row.product_name,
                    image_url: row.image_url,
                    quantity: row.quantity,
                    unit_price: row.unit_price,
                    brand: row.brand
                };
                itemMap.set(row.order_item_id, item);
                order.items.push(item);
            }
        });

        return order;
    }

    /**
     * Converts a flat array of multiple orders' rows into an array of structured Order objects.
     */
    static createMultipleFromDbRows(rows) {
        if (!rows || rows.length === 0) return [];

        const orderMap = new Map();

        rows.forEach(row => {
            if (!orderMap.has(row.order_id)) {
                orderMap.set(row.order_id, []);
            }
            orderMap.get(row.order_id).push(row);
        });

        return Array.from(orderMap.values()).map(orderRows => this.createFromDbRows(orderRows));
    }
}

module.exports = OrderFactory;
