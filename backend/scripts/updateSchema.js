// eGrocer/backend/scripts/updateSchema.js
const mssql = require('mssql');
require('dotenv').config();

const config = {
    user: 'sa',
    password: 'Greygraphite1.6',
    server: 'localhost',
    database: 'eGrocer',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
};

async function updateSchema() {
    try {
        const pool = await mssql.connect(config);
        console.log('Connected to SQL Server');

        console.log('Adding updated_at to role tables...');
        const queries = [
            "IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Sellers') AND name = 'updated_at') ALTER TABLE Sellers ADD updated_at DATETIME DEFAULT GETDATE()",
            "IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Customers') AND name = 'updated_at') ALTER TABLE Customers ADD updated_at DATETIME DEFAULT GETDATE()",
            "IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Admins') AND name = 'updated_at') ALTER TABLE Admins ADD updated_at DATETIME DEFAULT GETDATE()"
        ];

        for (const query of queries) {
            await pool.request().query(query);
        }

        await pool.close();
        console.log('Schema updated successfully!');
    } catch (err) {
        console.error('Error updating schema:', err);
        process.exit(1);
    }
}

updateSchema();
