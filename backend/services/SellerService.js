// services/SellerService.js

/**
 * Orchestrates business logic for Seller Partners.
 * DIP: Depends on the SellerRepository abstraction.
 */
class SellerService {
    constructor(sellerRepository) {
        this.sellerRepository = sellerRepository;
    }

    async getProfile(sellerId) {
        return await this.sellerRepository.getSellerProfile(sellerId);
    }

    async getOpenRequests() {
        return await this.sellerRepository.getAllProductRequests();
    }

    async placeBid(bidData) {
        // Business Rule: Ensure bid price is positive
        if (bidData.bidPrice <= 0) {
            throw new Error('Bid price must be greater than zero.');
        }

        return await this.sellerRepository.submitBid(bidData);
    }

    async getBidsBySeller(sellerId) {
        return await this.sellerRepository.getSellerBids(sellerId);
    }

    async getProducts(sellerId) {
        return await this.sellerRepository.getSellerProducts(sellerId);
    }

    async updateInventory(productId, quantity) {
        return await this.sellerRepository.updateInventory(productId, quantity);
    }

    async getDashboardStats(sellerId) {
        return await this.sellerRepository.getDashboardStats(sellerId);
    }

    async getOrders(sellerId) {
        return await this.sellerRepository.getSellerOrders(sellerId);
    }

    async addProduct(sellerId, productData) {
        return await this.sellerRepository.addProduct(sellerId, productData);
    }

    async updateProduct(productId, productData) {
        return await this.sellerRepository.updateProduct(productId, productData);
    }

    async deleteProduct(productId) {
        return await this.sellerRepository.deleteProduct(productId);
    }

    async getPromotions(sellerId) {
        return await this.sellerRepository.getSellerPromotions(sellerId);
    }

    async createPromotion(promoData) {
        return await this.sellerRepository.createPromotion(promoData);
    }

    async getEarnings(sellerId) {
        return await this.sellerRepository.getSellerEarnings(sellerId);
    }

    async deletePromotion(dealId) {
        return await this.sellerRepository.deletePromotion(dealId);
    }

    async updateOrderStatus(orderId, status) {
        return await this.sellerRepository.updateOrderStatus(orderId, status);
    }

    async updateProfile(sellerId, profileData) {
        return await this.sellerRepository.updateProfile(sellerId, profileData);
    }

    async getCategories() {
        return await this.sellerRepository.getCategories();
    }
}

module.exports = SellerService;