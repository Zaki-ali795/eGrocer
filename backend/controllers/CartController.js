// backend/controllers/CartController.js

class CartController {
    constructor(cartRepository) {
        this.cartRepo = cartRepository;

        this.getCart = this.getCart.bind(this);
        this.addItem = this.addItem.bind(this);
        this.updateQuantity = this.updateQuantity.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.clearCart = this.clearCart.bind(this);
    }

    async getCart(req, res, next) {
        try {
            // Hardcoded for John (customer_id = 3) until full auth is implemented
            const customerId = req.user?.user_id;
            if (!customerId) return res.status(401).json({ success: false, message: 'Unauthorized' });
            const items = await this.cartRepo.getCartByCustomerId(customerId);
            res.json({ success: true, data: items });
        } catch (err) {
            next(err);
        }
    }

    async addItem(req, res, next) {
        try {
            const customerId = req.user?.user_id;
            if (!customerId) return res.status(401).json({ success: false, message: 'Unauthorized' });
            const { productId, quantity } = req.body;
            
            if (!productId) {
                return res.status(400).json({ success: false, message: 'Product ID is required' });
            }

            await this.cartRepo.addItem(customerId, productId, quantity || 1);
            res.json({ success: true, message: 'Item added to cart' });
        } catch (err) {
            next(err);
        }
    }

    async updateQuantity(req, res, next) {
        try {
            const customerId = req.user?.user_id;
            if (!customerId) return res.status(401).json({ success: false, message: 'Unauthorized' });
            const { productId } = req.params;
            const { quantity } = req.body;

            if (quantity === undefined || quantity < 1) {
                return res.status(400).json({ success: false, message: 'Valid quantity is required' });
            }

            await this.cartRepo.updateQuantity(customerId, productId, quantity);
            res.json({ success: true, message: 'Quantity updated' });
        } catch (err) {
            next(err);
        }
    }

    async removeItem(req, res, next) {
        try {
            const customerId = req.user?.user_id;
            if (!customerId) return res.status(401).json({ success: false, message: 'Unauthorized' });
            const { productId } = req.params;
            await this.cartRepo.removeItem(customerId, productId);
            res.json({ success: true, message: 'Item removed from cart' });
        } catch (err) {
            next(err);
        }
    }

    async clearCart(req, res, next) {
        try {
            const customerId = req.user?.user_id;
            if (!customerId) return res.status(401).json({ success: false, message: 'Unauthorized' });
            await this.cartRepo.clearCart(customerId);
            res.json({ success: true, message: 'Cart cleared' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = CartController;
