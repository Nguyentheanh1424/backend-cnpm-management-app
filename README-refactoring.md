# Controller Refactoring Guide

## Overview

This guide explains the refactoring done to eliminate duplicated code in controllers. Three utility modules were created:

1. `utils/responseHandler.js` - Standardizes API responses
2. `utils/errorHandler.js` - Provides error handling with try-catch blocks
3. `utils/dataFormatter.js` - Ensures consistent data formatting

## Utility Functions

### Response Handler (`utils/responseHandler.js`)

Provides standardized methods for API responses:

- `sendSuccess(res, data, message, statusCode)` - For successful responses
- `sendError(res, message, statusCode, error)` - For error responses
- `sendNotFound(res, message)` - For 404 responses
- `sendBadRequest(res, message)` - For 400 responses
- `sendUnauthorized(res, message)` - For 403 responses

### Error Handler (`utils/errorHandler.js`)

Wraps controller functions with standardized error handling:

- `asyncHandler(controllerFn, options)` - Wraps a controller function with try-catch

### Data Formatter (`utils/dataFormatter.js`)

Ensures consistent data formatting:

- `formatUser(user, includePrivate)` - Formats user data
- `formatProduct(product)` - Formats product data

## How to Use

### Step 1: Import the utilities

```javascript
const { sendSuccess, sendError, sendNotFound, sendBadRequest, sendUnauthorized } = require('../utils/responseHandler');
const { asyncHandler } = require('../utils/errorHandler');
const { formatUser, formatProduct } = require('../utils/dataFormatter');
```

### Step 2: Refactor controller functions

Before:
```javascript
const someFunction = async (req, res) => {
    try {
        // Function logic
        res.status(200).json({ message: 'Success', data });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error occurred' });
    }
};
```

After:
```javascript
const someFunction = asyncHandler(async (req, res) => {
    // Function logic
    return sendSuccess(res, data, 'Success');
}, { errorMessage: 'Error occurred' });
```

## Examples

### Example 1: Basic CRUD Operation

```javascript
const getUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    if (!user) {
        return sendNotFound(res, 'User not found');
    }
    
    return sendSuccess(res, formatUser(user));
});
```

### Example 2: Validation

```javascript
const createItem = asyncHandler(async (req, res) => {
    const { name, price } = req.body;
    
    if (!name || !price) {
        return sendBadRequest(res, 'Name and price are required');
    }
    
    const newItem = await Item.create({ name, price });
    return sendSuccess(res, newItem, 'Item created successfully', 201);
});
```

## Benefits

1. **Consistency** - All API responses follow the same format
2. **Reduced Duplication** - Eliminates repeated try-catch blocks and response formatting
3. **Maintainability** - Changes to error handling or response format can be made in one place
4. **Readability** - Controller functions are more focused on business logic

## Next Steps

Apply this pattern to all remaining controllers in the project to eliminate duplicated code.