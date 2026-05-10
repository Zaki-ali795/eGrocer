const { getPool } = require('./config/db');
require('dotenv').config();

(async () => {
    try {
        const pool = await getPool();
        const result = await pool.request().query('SELECT * FROM Sellers s INNER JOIN Users u ON s.seller_id = u.user_id');
        console.log('--- SELLERS IN DATABASE ---');
        console.table(result.recordset.map(s => ({
            id: s.seller_id,
            name: s.first_name + ' ' + s.last_name,
            store: s.store_name,
            email: s.email
        })));
        process.exit(0);
    } catch (err) {
        console.error('Error fetching sellers:', err.message);
        process.exit(1);
    }
})();
