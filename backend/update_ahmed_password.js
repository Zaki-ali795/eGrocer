const { getPool } = require('./config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

(async () => {
    try {
        const pool = await getPool();
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('password123', salt);
        
        await pool.request()
            .input('email', 'ahmed1@gmail.com')
            .input('hash', hash)
            .query('UPDATE Users SET password_hash = @hash WHERE email = @email');
            
        console.log('✅ Password for Ahmed Imran (ahmed1@gmail.com) updated to: password123');
        process.exit(0);
    } catch (err) {
        console.error('Error updating password:', err.message);
        process.exit(1);
    }
})();
