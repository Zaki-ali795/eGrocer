
const bcrypt = require('bcryptjs');
const sql = require('mssql');
require('dotenv').config();

const config = {
    user: 'zaki',
    password: 'zaki@1234',
    server: 'localhost',
    database: 'eGrocer',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function createAdmin() {
    try {
        const pool = await sql.connect(config);
        const email = 'l240768@gmail.com';
        const rawPassword = 'Motababy$1';
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        console.log('Checking if user exists...');
        const checkUser = await pool.request()
            .input('email', email)
            .query('SELECT user_id FROM Users WHERE email = @email');

        let userId;
        if (checkUser.recordset.length > 0) {
            userId = checkUser.recordset[0].user_id;
            console.log('User already exists with ID:', userId, '. Updating password and user_type...');
            await pool.request()
                .input('userId', userId)
                .input('password', hashedPassword)
                .query('UPDATE Users SET password_hash = @password, user_type = \'admin\' WHERE user_id = @userId');
        } else {
            console.log('Creating new user...');
            const insertUser = await pool.request()
                .input('email', email)
                .input('password', hashedPassword)
                .query(`
                    INSERT INTO Users (email, password_hash, user_type, first_name, last_name, phone, is_active)
                    OUTPUT inserted.user_id
                    VALUES (@email, @password, 'admin', 'System', 'Admin', '+920000000000', 1)
                `);
            userId = insertUser.recordset[0].user_id;
            console.log('User created with ID:', userId);
        }

        console.log('Ensuring record in Admins table...');
        const checkAdmin = await pool.request()
            .input('userId', userId)
            .query('SELECT admin_id FROM Admins WHERE admin_id = @userId');

        if (checkAdmin.recordset.length === 0) {
            await pool.request()
                .input('userId', userId)
                .query('INSERT INTO Admins (admin_id, role_level, department) VALUES (@userId, \'super\', \'Management\')');
            console.log('Admin record created.');
        } else {
            console.log('Admin record already exists.');
        }

        await pool.close();
        console.log('Success!');
    } catch (err) {
        console.error('Error:', err);
    }
}

createAdmin();
