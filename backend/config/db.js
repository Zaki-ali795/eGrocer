// config/db.js
const sql = require('mssql');
const dbconfig = require('../dbconfig');

let pool = null;

/**
 * Returns a shared connection pool (singleton).
 * Satisfies DIP — higher-level modules depend on this abstraction, not raw mssql.
 *
 * mssql v12 requires a flat config object with `server` as a string.
 */
async function getPool() {
    if (pool) return pool;

    const config = {
        server: String(dbconfig.server),         // must be string
        port: Number(dbconfig.port || 1433),
        database: String(dbconfig.database),
        user: String(dbconfig.user),
        password: String(dbconfig.password),
        options: {
            trustServerCertificate: true,
            encrypt: false,
            enableArithAbort: true,
        },
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000,
        },
    };

    pool = await sql.connect(config);
    console.log('✅ Connected to SQL Server');
    return pool;
}

module.exports = { getPool, sql };
