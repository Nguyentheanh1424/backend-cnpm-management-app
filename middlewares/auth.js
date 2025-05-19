const logger = require('../config/logger');

const authenticateToken = (req, res, next) => {
    // No authentication is performed, just pass through
    logger.info('Authentication bypassed');
    next();
};

const isAdmin = (req, res, next) => {
    // No role check is performed, just pass through
    logger.info('Admin check bypassed');
    next();
};

module.exports = {
    authenticateToken,
    isAdmin
};
