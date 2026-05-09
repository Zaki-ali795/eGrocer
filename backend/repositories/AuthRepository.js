// repositories/AuthRepository.js
const BaseRepository = require('./BaseRepository');

class AuthRepository extends BaseRepository {
    constructor(pool) {
        super(pool);
    }

    async findByEmail(email) {
        const query = `SELECT * FROM Users WHERE email = @email AND is_active = 1`;
        const result = await this.pool.request()
            .input('email', email)
            .query(query);
        return result.recordset[0] || null;
    }

    async createUser(userData) {
        const { email, passwordHash, firstName, lastName, phone, userType, roleData } = userData;
        const transaction = this.pool.transaction();
        
        try {
            await transaction.begin();
            
            // 1. Insert into Users
            const userResult = await transaction.request()
                .input('email', email)
                .input('passwordHash', passwordHash)
                .input('firstName', firstName)
                .input('lastName', lastName)
                .input('phone', phone)
                .input('userType', userType)
                .query(`
                    INSERT INTO Users (email, password_hash, first_name, last_name, phone, user_type)
                    OUTPUT INSERTED.user_id
                    VALUES (@email, @passwordHash, @firstName, @lastName, @phone, @userType)
                `);
            
            const userId = userResult.recordset[0].user_id;

            // 2. Insert into role-specific table
            if (userType === 'customer') {
                await transaction.request()
                    .input('userId', userId)
                    .query(`INSERT INTO Customers (customer_id) VALUES (@userId)`);
            } else if (userType === 'seller') {
                await transaction.request()
                    .input('userId', userId)
                    .input('storeName', roleData.storeName || `${firstName}'s Store`)
                    .input('storeDescription', roleData.storeDescription || '')
                    .input('license', roleData.businessLicenseNumber || '')
                    .query(`
                        INSERT INTO Sellers (seller_id, store_name, store_description, business_license_number)
                        VALUES (@userId, @storeName, @storeDescription, @license)
                    `);
            } else if (userType === 'admin') {
                await transaction.request()
                    .input('userId', userId)
                    .input('department', roleData.department || 'General')
                    .query(`
                        INSERT INTO Admins (admin_id, department)
                        VALUES (@userId, @department)
                    `);
            }

            await transaction.commit();
            return { user_id: userId, email, first_name: firstName, last_name: lastName, user_type: userType };
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }
}

module.exports = AuthRepository;
