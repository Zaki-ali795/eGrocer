// controllers/WishlistController.js

class WishlistController {
    constructor(wishlistRepository) {
        this.wishlistRepo = wishlistRepository;
        
        this.getWishlist = this.getWishlist.bind(this);
        this.toggleWishlist = this.toggleWishlist.bind(this);
        this.removeFromWishlist = this.removeFromWishlist.bind(this);
    }

    async getWishlist(req, res, next) {
        try {
            // Hardcoded for John (customer_id = 3) until full auth is implemented
            const customerId = 3; 
            const wishlist = await this.wishlistRepo.getWishlist(customerId);
            res.json({ success: true, data: wishlist });
        } catch (err) {
            next(err);
        }
    }

    async toggleWishlist(req, res, next) {
        try {
            const customerId = 3;
            const { productId } = req.body;
            
            if (!productId) {
                return res.status(400).json({ success: false, message: 'Product ID is required' });
            }

            const exists = await this.wishlistRepo.isInWishlist(customerId, productId);
            if (exists) {
                await this.wishlistRepo.removeFromWishlist(customerId, productId);
                res.json({ success: true, message: 'Removed from wishlist', action: 'removed' });
            } else {
                await this.wishlistRepo.addToWishlist(customerId, productId);
                res.json({ success: true, message: 'Added to wishlist', action: 'added' });
            }
        } catch (err) {
            next(err);
        }
    }

    async removeFromWishlist(req, res, next) {
        try {
            const customerId = 3;
            const { productId } = req.params;
            await this.wishlistRepo.removeFromWishlist(customerId, productId);
            res.json({ success: true, message: 'Removed from wishlist' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = WishlistController;
