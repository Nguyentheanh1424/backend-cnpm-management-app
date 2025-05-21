# Error Handler Utility Documentation

## Overview
The Error Handler utility provides standardized error handling for controller functions. It wraps controller functions with try-catch blocks to ensure consistent error handling and logging across the application.

## Functions

### asyncHandler(controllerFn, options)
**Description:** Wraps a controller function with standardized error handling.

**Parameters:**
- `controllerFn`: The controller function to wrap
- `options` (object, optional): Configuration options
  - `useLogger` (boolean, default: true): Whether to use the logger for error logging
  - `errorMessage` (string, default: 'Có lỗi xảy ra. Vui lòng thử lại!'): Default error message to return

**Returns:** A wrapped function that handles errors consistently

**Process:**
1. Returns a new function that wraps the original controller function
2. Executes the controller function within a try-catch block
3. If an error occurs:
   - Logs the error using the logger or console
   - Sends a standardized error response using the responseHandler
4. The wrapped function maintains the same signature as the original controller function

## Usage Example
```javascript
const { asyncHandler } = require('../utils/errorHandler');

// Without options
const getUsers = asyncHandler(async (req, res) => {
  // Controller logic here
  const users = await User.find();
  res.json(users);
});

// With custom options
const createUser = asyncHandler(
  async (req, res) => {
    // Controller logic here
    const user = await User.create(req.body);
    res.status(201).json(user);
  },
  { 
    errorMessage: 'Failed to create user. Please try again.' 
  }
);
```

## Benefits
- Reduces boilerplate try-catch blocks in controllers
- Ensures consistent error handling across the application
- Centralizes error logging
- Allows for customization of error messages