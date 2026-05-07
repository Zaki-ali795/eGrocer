const { getPool } = require('./backend/config/db');

async function run() {
  const pool = await getPool();
  const res = await pool.request().query('SELECT * FROM FlashDeals');
  console.log('All FlashDeals:', res.recordset);
  
  const activeRes = await pool.request().query(`
    SELECT * FROM FlashDeals 
    WHERE is_active = 1 
      AND GETDATE() BETWEEN start_datetime AND end_datetime 
      AND (max_quantity - sold_quantity) > 0
  `);
  console.log('Active FlashDeals (no join):', activeRes.recordset);
  
  const joinRes = await pool.request().query(`
    SELECT *
    FROM FlashDeals fd
    INNER JOIN Products p ON fd.product_id = p.product_id
    WHERE fd.is_active = 1 
      AND GETDATE() BETWEEN fd.start_datetime AND fd.end_datetime
      AND (fd.max_quantity - fd.sold_quantity) > 0
  `);
  console.log('Active FlashDeals (with join):', joinRes.recordset);
  
  process.exit(0);
}

run().catch(console.error);
