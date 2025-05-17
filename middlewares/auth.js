const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

/**
 * Middleware to authenticate JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticateToken = (req, res, next) => {
    // Get the authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
    
    if (!token) {
        logger.warn('Authentication failed: No token provided');
        return res.status(401).json({ message: 'Authentication required' });
    }
    
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add the user data to the request object
        req.user = decoded;
        
        logger.info(`User authenticated: ${decoded.email}`);
        next();
    } catch (error) {
        logger.error(`Authentication error: ${error.message}`);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

/**
 * Middleware to check if user has admin role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        logger.warn(`Access denied for user: ${req.user ? req.user.email : 'unknown'}`);
        return res.status(403).json({ message: 'Access denied: Admin role required' });
    }
};

module.exports = {
    authenticateToken,
    isAdmin
};