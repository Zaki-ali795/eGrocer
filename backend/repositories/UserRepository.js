// repositories/UserRepository.js
const BaseRepository = require('./BaseRepository');

class UserRepository extends BaseRepository {
    constructor(pool) {
        super(pool);
    }

    async getUserProfile(userId) {
        const query = `
            SELECT 
                u.user_id, u.first_name, u.last_name, u.phone as user_phone, u.email,
                a.address_id, a.address_line1, a.city, a.state, a.postal_code, a.phone as address_phone
            FROM Users u
            LEFT JOIN Addresses a ON u.user_id = a.user_id AND a.is_default = 1
            WHERE u.user_id = @userId
        `;
        const result = await this.pool.request()
            .input('userId', userId)
            .query(query);
            
        return result.recordset[0] || null;
    }

    async updateUserProfile(userId, profileData) {
        const transaction = this.pool.transaction();
        
        try {
            await transaction.begin();
            
            // 1. Update Users table
            await transaction.request()
                .input('userId', userId)
                .input('firstName', profileData.firstName)
                .input('lastName', profileData.lastName)
                .input('phone', profileData.phone)
                .query(`
                    UPDATE Users 
                    SET first_name = @firstName, 
                        last_name = @lastName, 
                        phone = @phone,
                        updated_at = GETDATE()
                    WHERE user_id = @userId
                `);

            // 2. Update or Insert Address
            const addressCheck = await transaction.request()
                .input('userId', userId)
                .query(`SELECT address_id FROM Addresses WHERE user_id = @userId AND is_default = 1`);
                
            const addressLine1 = profileData.address || '';
            const city = profileData.city || 'Default City';
            const state = profileData.state || 'Default State';
            const postalCode = profileData.postalCode || '000000';
            const fullName = `${profileData.firstName} ${profileData.lastName}`;

            if (addressCheck.recordset.length > 0) {
                // Update existing
                await transaction.request()
                    .input('addressId', addressCheck.recordset[0].address_id)
                    .input('addressLine1', addressLine1)
                    .input('city', city)
                    .input('state', state)
                    .input('postalCode', postalCode)
                    .input('phone', profileData.phone)
                    .input('fullName', fullName)
                    .query(`
                        UPDATE Addresses
                        SET address_line1 = @addressLine1,
                            city = @city,
                            state = @state,
                            postal_code = @postalCode,
                            phone = @phone,
                            full_name = @fullName
                        WHERE address_id = @addressId
                    `);
            } else {
                // Insert new address
                await transaction.request()
                    .input('userId', userId)
                    .input('addressLine1', addressLine1)
                    .input('city', city)
                    .input('state', state)
                    .input('postalCode', postalCode)
                    .input('phone', profileData.phone)
                    .input('fullName', fullName)
                    .query(`
                        INSERT INTO Addresses (user_id, address_type, full_name, phone, address_line1, city, state, postal_code, is_default)
                        VALUES (@userId, 'home', @fullName, @phone, @addressLine1, @city, @state, @postalCode, 1)
                    `);
            }
            
            await transaction.commit();
            return { success: true };
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }
}

module.exports = UserRepository;
