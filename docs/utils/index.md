# Utils Documentation

This directory contains documentation for utility modules that provide common functionality used throughout the application.

## Available Utilities

- [Data Formatter](dataFormatter.md) - Provides functions for formatting data consistently across the application
- [Error Handler](errorHandler.md) - Provides standardized error handling for controller functions
- [Mailer](mailer.md) - Provides email functionality for sending verification codes and temporary passwords
- [Response Handler](responseHandler.md) - Provides standardized API response functions

## Purpose

These utility modules serve several important purposes in the application:

1. **Code Reusability** - Common functionality is centralized to avoid duplication
2. **Consistency** - Standardized approaches to common tasks ensure consistent behavior
3. **Maintainability** - Changes to common functionality can be made in one place
4. **Readability** - Controllers and other modules can focus on business logic rather than implementation details

## Usage

Utility modules are typically imported at the top of files where they are needed:

```javascript
// Import specific functions from utilities
const { formatUser } = require('../utils/dataFormatter');
const { asyncHandler } = require('../utils/errorHandler');
const { sendCodeMail } = require('../utils/mailer');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// Use the utility functions in your code
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return sendError(res, 'User not found', 404);
  }
  sendSuccess(res, formatUser(user));
});
```