// backend/controllers/PromoController.js

class PromoController {
    constructor(promoRepository) {
        this.promoRepo = promoRepository;
        this.validateCode = this.validateCode.bind(this);
    }

    async validateCode(req, res, next) {
        try {
            const { code, orderAmount } = req.body;
            if (!code) return res.status(400).json({ success: false, message: 'Promo code is required' });

            const promo = await this.promoRepo.getByCode(code);
            
            if (!promo) {
                return res.status(404).json({ success: false, message: 'Invalid or expired promo code' });
            }

            if (promo.usage_limit && promo.used_count >= promo.usage_limit) {
                return res.status(400).json({ success: false, message: 'Promo code usage limit reached' });
            }

            if (orderAmount < promo.minimum_order_amount) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Minimum order amount for this code is Rs ${promo.minimum_order_amount}` 
                });
            }

            res.json({
                success: true,
                data: {
                    promo_id: promo.promo_id,
                    code: promo.code,
                    discount_type: promo.discount_type,
                    discount_value: promo.discount_value,
                    max_discount_amount: promo.max_discount_amount
                }
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = PromoController;
