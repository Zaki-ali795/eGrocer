// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getPool } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Middleware ──────────────────────────────────────────────────
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());

// ── Health check ────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: '✅ eGrocer API is running.' }));

// ── Routes (add here as features are implemented) ───────────────
// app.use('/api/auth',        require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/sellers', require('./routes/sellerRoutes'));
// app.use('/api/flash-deals', require('./routes/flashDealRoutes'));

// ── Global error handler ────────────────────────────────────────
app.use(errorHandler);

// ── Start ───────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;

(async () => {
    try {
        await getPool(); // initialise DB pool before accepting requests
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to connect to database:', err.message);
        process.exit(1);
    }
})();
