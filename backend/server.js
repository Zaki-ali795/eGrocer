// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getPool } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// ── Middleware ──────────────────────────────────────────────────
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());
app.use(authMiddleware);
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// const notificationRoutes = require('./routes/notificationRoutes');

// ── Health check ────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: '✅ eGrocer API is running.' }));

// app.use('/api/notifications', notificationRoutes);

// Direct Notification Routes
const getNotifCtrl = async () => {
    const { getPool } = require('./config/db');
    const NotificationRepository = require('./repositories/NotificationRepository');
    const NotificationService = require('./services/NotificationService');
    const NotificationController = require('./controllers/NotificationController');
    const pool = await getPool();
    const repo = new NotificationRepository(pool);
    const service = new NotificationService(repo);
    return new NotificationController(service);
};

app.get('/api/notification-config/:userId', async (req, res, next) => {
    const ctrl = await getNotifCtrl();
    return ctrl.getSettings(req, res, next);
});

app.put('/api/notification-config/:userId', async (req, res, next) => {
    const ctrl = await getNotifCtrl();
    return ctrl.updateSettings(req, res, next);
});

app.get('/api/notifications/:userId', async (req, res, next) => {
    const ctrl = await getNotifCtrl();
    return ctrl.getNotifications(req, res, next);
});

app.patch('/api/notifications/read/:notificationId', async (req, res, next) => {
    const ctrl = await getNotifCtrl();
    return ctrl.markAsRead(req, res, next);
});

app.post('/api/notifications/read-all', async (req, res, next) => {
    const ctrl = await getNotifCtrl();
    return ctrl.markAllAsRead(req, res, next);
});
app.use('/api/auth',        require('./routes/authRoutes'));
app.use('/api/users',       require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/sellers', require('./routes/sellerRoutes'));
// app.use('/api/flash-deals', require('./routes/flashDealRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/cart',     require('./routes/cartRoutes'));
app.use('/api/bids',     require('./routes/bidRoutes'));
app.use('/api/admin',    require('./routes/adminRoutes'));

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
        // Keep the process alive
        setInterval(() => {}, 1000 * 60 * 60); 
    } catch (err) {
        console.error('❌ Failed to connect to database:', err.message);
        process.exit(1);
    }
})();
