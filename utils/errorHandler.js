/**
 * Utility functions for standardized error handling
 */
const logger = require('../config/logger');
const { sendError } = require('./responseHandler');

/**
 * Wraps a controller function with standardized error handling
 * @returns {Function} - Wrapped controller function with error handling
 */
const asyncHandler = (controllerFn, options = {}) => {
  const { 
    useLogger = true, 
    errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại!' 
  } = options;

  return async (req, res, next) => {
    try {
      await controllerFn(req, res, next);
    } catch (error) {
      // Log the error
      if (useLogger) {
        logger.error(`Error in ${controllerFn.name || 'controller'}:`, error);
      } else {
        logger.error(`Error in ${controllerFn.name || 'controller'}:`, error);
      }

      // Send error response
      sendError(res, errorMessage, 500, error);
    }
  };
};

module.exports = {
  asyncHandler
};
