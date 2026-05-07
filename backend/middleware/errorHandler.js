// middleware/errorHandler.js

/**
 * Global error handler middleware.
 * Satisfies SRP — all error formatting is in one dedicated place.
 */
function errorHandler(err, req, res, next) {
    console.error(`[ERROR] ${err.message}`);
    const status = err.status || 500;
    res.status(status).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
}

module.exports = errorHandler;
