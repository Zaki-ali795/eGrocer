// backend/middleware/authMiddleware.js

/**
 * Simple authentication middleware for the development phase.
 * Extracts the user ID from the 'x-user-id' header.
 * 
 * If the header is missing, it falls back to user_id = 3 (John Doe)
 * to ensure that existing features don't break during the transition.
 */
function authMiddleware(req, res, next) {
    const headerUserId = req.headers['x-user-id'];
    
    if (headerUserId) {
        req.user = {
            user_id: parseInt(headerUserId, 10),
            id: parseInt(headerUserId, 10)
        };
    }

    next();
}

module.exports = authMiddleware;
