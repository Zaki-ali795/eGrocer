// backend/repositories/CartRepository.js
const BaseRepository = require('./BaseRepository');

class CartRepository extends BaseRepository {
    constructor(pool) {
        super(pool);
    }

    /**
     * Get or create a cart for a customer.
     * @param {number} customerId 
     * @returns {number} cartId
     */
    async _getOrCreateCart(customerId) {
        const req = this.pool.request();
        req.input('customerId', customerId);

        let result = await req.query('SELECT cart_id FROM Cart WHERE customer_id = @customerId');
        
        if (result.recordset.length > 0) {
            return result.recordset[0].cart_id;
        }

        result = await req.query(`
            INSERT INTO Cart (customer_id) 
            OUTPUT inserted.cart_id
            VALUES (@customerId)
        `);
        
        return result.recordset[0].cart_id;
    }

    /**
     * Fetch all items in the customer's cart.
     */
    async getCartByCustomerId(customerId) {
        const req = this.pool.request();
        req.input('customerId', customerId);

        const result = await req.query(`
            SELECT 
                ci.cart_item_id,
                p.product_id as id,
                p.product_name as name,
                ISNULL(p.sale_price, p.base_price) as price,
                p.image_url as image,
                ci.quantity
            FROM Cart c
            INNER JOIN CartItems ci ON c.cart_id = ci.cart_id
            INNER JOIN Products p ON ci.product_id = p.product_id
            WHERE c.customer_id = @customerId
            ORDER BY ci.added_at DESC
        `);
        return result.recordset;
    }

    /**
     * Add or update an item in the cart.
     */
    async addItem(customerId, productId, quantity) {
        const cartId = await this._getOrCreateCart(customerId);
        
        const req = this.pool.request();
        req.input('cartId', cartId);
        req.input('productId', productId);
        req.input('quantity', quantity);

        await req.query(`
            IF EXISTS (SELECT 1 FROM CartItems WHERE cart_id = @cartId AND product_id = @productId)
            BEGIN
                UPDATE CartItems 
                SET quantity = quantity + @quantity
                WHERE cart_id = @cartId AND product_id = @productId
            END
            ELSE
            BEGIN
                INSERT INTO CartItems (cart_id, product_id, quantity)
                VALUES (@cartId, @productId, @quantity)
            END
        `);
    }

    /**
     * Update quantity of an item.
     */
    async updateQuantity(customerId, productId, quantity) {
        const cartId = await this._getOrCreateCart(customerId);

        const req = this.pool.request();
        req.input('cartId', cartId);
        req.input('productId', productId);
        req.input('quantity', quantity);

        await req.query(`
            UPDATE CartItems 
            SET quantity = @quantity
            WHERE cart_id = @cartId AND product_id = @productId
        `);
    }

    /**
     * Remove an item from the cart.
     */
    async removeItem(customerId, productId) {
        const cartId = await this._getOrCreateCart(customerId);

        const req = this.pool.request();
        req.input('cartId', cartId);
        req.input('productId', productId);

        await req.query('DELETE FROM CartItems WHERE cart_id = @cartId AND product_id = @productId');
    }

    /**
     * Clear all items from the customer's cart.
     */
    async clearCart(customerId) {
        const cartId = await this._getOrCreateCart(customerId);
        const req = this.pool.request();
        req.input('cartId', cartId);
        await req.query('DELETE FROM CartItems WHERE cart_id = @cartId');
    }

    /**
     * Merge items from a guest cart into a logged-in user's cart.
     */
    async mergeCarts(guestId, loggedInId) {
        if (guestId === loggedInId) return;

        const guestCartId = await this._getOrCreateCart(guestId);
        const loggedInCartId = await this._getOrCreateCart(loggedInId);

        const req = this.pool.request();
        req.input('guestCartId', guestCartId);
        req.input('loggedInCartId', loggedInCartId);

        await req.query(`
            UPDATE li
            SET li.quantity = li.quantity + g.quantity
            FROM CartItems li
            JOIN CartItems g ON li.product_id = g.product_id
            WHERE li.cart_id = @loggedInCartId AND g.cart_id = @guestCartId;

            INSERT INTO CartItems (cart_id, product_id, quantity)
            SELECT @loggedInCartId, g.product_id, g.quantity
            FROM CartItems g
            WHERE g.cart_id = @guestCartId
            AND g.product_id NOT IN (
                SELECT li.product_id 
                FROM CartItems li 
                WHERE li.cart_id = @loggedInCartId
            );

            DELETE FROM CartItems WHERE cart_id = @guestCartId;
        `);
    }
}

module.exports = CartRepository;
