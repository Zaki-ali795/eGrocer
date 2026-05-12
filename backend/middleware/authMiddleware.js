// backend/middleware/authMiddleware.js

/**
 * Simple authentication middleware for the development phase.
 * Extracts the user ID from the 'x-user-id' header.
 * 
 * If the header is missing, it falls back to user_id = 3 (John Doe)
 * to ensure that existing features don't break during the transition.
 */
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    // 1. Skip auth for public routes (optional, or handle in routes)
    const publicPaths = ['/api/auth/login', '/api/auth/signup'];
    if (publicPaths.includes(req.path)) {
        return next();
    }

    // 2. Extract token from Authorization header (Bearer <token>)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // 3. Fallback to x-user-id for legacy support (temporarily)
    const legacyUserId = req.headers['x-user-id'];

    if (!token) {
        if (legacyUserId) {
            req.user = { user_id: parseInt(legacyUserId, 10), id: parseInt(legacyUserId, 10) };
            return next();
        }
        // If no token and no legacy ID, we don't block yet (to avoid breaking things), 
        // but individual routes can check req.user
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'egrocer_secret_key_123');
        req.user = decoded;
        next();
    } catch (err) {
        console.error('JWT Verification Error:', err.message);
        // If token is invalid, we still allow the request to proceed but without req.user
        // Routes that require auth should check if req.user exists.
        next();
    }
}

module.exports = authMiddleware;
