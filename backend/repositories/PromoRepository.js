// backend/repositories/PromoRepository.js
const BaseRepository = require('./BaseRepository');

class PromoRepository extends BaseRepository {
    constructor(pool) {
        super(pool);
    }

    async getByCode(code) {
        const req = this.pool.request();
        req.input('code', code);

        const result = await req.query(`
            SELECT * FROM PromoCodes 
            WHERE code = @code AND is_active = 1
            AND GETDATE() BETWEEN valid_from AND valid_until
        `);
        
        return result.recordset[0];
    }

    async incrementUsage(promoId) {
        const req = this.pool.request();
        req.input('promoId', promoId);
        await req.query('UPDATE PromoCodes SET used_count = used_count + 1 WHERE promo_id = @promoId');
    }
}

module.exports = PromoRepository;
