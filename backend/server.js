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
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// ── Health check ────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: '✅ eGrocer API is running.' }));

app.use('/api/auth',        require('./routes/authRoutes'));
app.use('/api/users',       require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/sellers', require('./routes/sellerRoutes'));
// app.use('/api/flash-deals', require('./routes/flashDealRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/bids',     require('./routes/bidRoutes'));

// ── 404 Handler ────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

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
