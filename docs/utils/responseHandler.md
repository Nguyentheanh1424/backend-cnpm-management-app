# Response Handler Utility Documentation

## Overview
The Response Handler utility provides standardized API response functions. It ensures consistent response formats across the application, making the API more predictable and easier to use.

## Functions

### sendSuccess(res, data, message, statusCode)
**Description:** Sends a success response with optional data.

**Parameters:**
- `res`: Express response object
- `data` (optional, default: null): Data to include in the response
- `message` (optional, default: 'Success'): Success message
- `statusCode` (optional, default: 200): HTTP status code

**Process:**
1. Creates a response object with the provided message
2. If data is provided:
   - For simple objects, merges the data with the response object
   - For arrays or other types, adds the data as a 'data' property
3. Sends the response with the specified status code

### sendError(res, message, statusCode, error)
**Description:** Sends an error response.

**Parameters:**
- `res`: Express response object
- `message` (optional, default: 'An error occurred'): Error message
- `statusCode` (optional, default: 500): HTTP status code
- `error` (optional, default: null): Error object or message

**Process:**
1. Creates a response object with the provided message
2. In non-production environments, includes the error message if provided
3. Sends the response with the specified status code

### sendNotFound(res, message)
**Description:** Sends a 404 Not Found response.

**Parameters:**
- `res`: Express response object
- `message` (optional, default: 'Resource not found'): Error message

**Process:**
1. Calls sendError with a 404 status code and the provided message

### sendBadRequest(res, message)
**Description:** Sends a 400 Bad Request response.

**Parameters:**
- `res`: Express response object
- `message` (optional, default: 'Bad request'): Error message

**Process:**
1. Calls sendError with a 400 status code and the provided message

### sendUnauthorized(res, message)
**Description:** Sends a 403 Unauthorized response.

**Parameters:**
- `res`: Express response object
- `message` (optional, default: 'Unauthorized access'): Error message

**Process:**
1. Calls sendError with a 403 status code and the provided message

## Usage Example
```javascript
const { 
  sendSuccess, 
  sendError, 
  sendNotFound, 
  sendBadRequest, 
  sendUnauthorized 
} = require('../utils/responseHandler');

// Success response
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  sendSuccess(res, users, 'Users retrieved successfully');
});

// Error response
app.post('/api/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    sendSuccess(res, { user }, 'User created successfully', 201);
  } catch (error) {
    sendError(res, 'Failed to create user', 500, error);
  }
});

// Not found response
app.get('/api/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return sendNotFound(res, 'User not found');
  }
  sendSuccess(res, { user });
});

// Bad request response
app.put('/api/users/:id', async (req, res) => {
  if (!req.body.name) {
    return sendBadRequest(res, 'Name is required');
  }
  // Update user...
});

// Unauthorized response
app.delete('/api/users/:id', async (req, res) => {
  if (!req.user.isAdmin) {
    return sendUnauthorized(res, 'Only admins can delete users');
  }
  // Delete user...
});
```