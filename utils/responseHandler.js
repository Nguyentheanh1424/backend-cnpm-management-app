/**
 * Utility functions for standardized API responses
 */

// Send a success response
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = { message };
  
  if (data !== null) {
    // If data is a simple object, include it directly
    if (typeof data === 'object' && !Array.isArray(data)) {
      Object.assign(response, data);
    } else {
      // Otherwise, include it as a data property
      response.data = data;
    }
  }
  
  return res.status(statusCode).json(response);
};

// Send an error response
const sendError = (res, message = 'An error occurred', statusCode = 500, error = null) => {
  const response = { message };
  
  if (error && process.env.NODE_ENV !== 'production') {
    response.error = error.message || error;
  }
  
  return res.status(statusCode).json(response);
};

// Send a not-found response
const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, message, 404);
};

// Send a bad request response
const sendBadRequest = (res, message = 'Bad request') => {
  return sendError(res, message, 400);
};

// Send an unauthorized response
const sendUnauthorized = (res, message = 'Unauthorized access') => {
  return sendError(res, message, 403);
};

module.exports = {
  sendSuccess,
  sendError,
  sendNotFound,
  sendBadRequest,
  sendUnauthorized
};