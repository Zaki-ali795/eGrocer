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
            const customerId = req.user.user_id; 
            const wishlist = await this.wishlistRepo.getWishlist(customerId);
            res.json({ success: true, data: wishlist });
        } catch (err) {
            next(err);
        }
    }

    async toggleWishlist(req, res, next) {
        try {
            const customerId = Number(req.user?.user_id);
            const productId = Number(req.body.productId);
            
            console.log(`[WishlistToggle] Start - Customer: ${customerId}, Product: ${productId}`);
            
            if (!customerId || isNaN(customerId)) {
                console.warn('[WishlistToggle] Unauthorized or Invalid Customer ID');
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            
            if (!productId || isNaN(productId)) {
                console.warn('[WishlistToggle] Bad Request: Missing or Invalid Product ID');
                return res.status(400).json({ success: false, message: 'Product ID is required' });
            }

            const exists = await this.wishlistRepo.isInWishlist(customerId, productId);
            console.log(`[WishlistToggle] Product ${productId} exists in wishlist: ${exists}`);

            if (exists) {
                await this.wishlistRepo.removeFromWishlist(customerId, productId);
                console.log(`[WishlistToggle] Removed product ${productId} for customer ${customerId}`);
                return res.status(200).json({ 
                    success: true, 
                    message: 'Removed from wishlist', 
                    data: { action: 'removed' } 
                });
            } else {
                await this.wishlistRepo.addToWishlist(customerId, productId);
                console.log(`[WishlistToggle] Added product ${productId} for customer ${customerId}`);
                return res.status(200).json({ 
                    success: true, 
                    message: 'Added to wishlist', 
                    data: { action: 'added' } 
                });
            }
        } catch (err) {
            console.error('[WishlistToggle] Error:', err.message);
            next(err);
        }
    }

    async removeFromWishlist(req, res, next) {
        try {
            const customerId = req.user?.user_id;
            if (!customerId) return res.status(401).json({ success: false, message: 'Unauthorized' });
            const { productId } = req.params;
            await this.wishlistRepo.removeFromWishlist(customerId, productId);
            res.json({ success: true, message: 'Removed from wishlist' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = WishlistController;
