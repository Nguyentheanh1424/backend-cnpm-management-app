# Data Formatter Utility Documentation

## Overview
The Data Formatter utility provides functions for formatting data consistently across the application. It ensures that data objects like users and products are presented in a standardized format when returned in API responses.

## Functions

### formatUser(user, includePrivate)
**Description:** Formats user data for response, with an option to include private fields.

**Parameters:**
- `user`: The user object to format
- `includePrivate` (boolean, default: false): Whether to include private fields in the response

**Returns:** A formatted user object with the following properties:
- `_id`: User ID
- `name`: User's name
- `email`: User's email
- `role`: User's role
- `avatar`: User's avatar (if exists)
- `id_owner`: Owner ID (if exists)
- Private fields (if includePrivate is true):
  - `GoogleID`: Google ID (if exists)
  - Other private fields as needed

**Process:**
1. Checks if the user object exists
2. Creates a basic user object with safe fields
3. Adds optional fields if they exist
4. Adds private fields if requested
5. Returns the formatted user object

### formatProduct(product)
**Description:** Formats product data for response.

**Parameters:**
- `product`: The product object to format

**Returns:** A formatted product object with the following properties:
- `_id`: Product ID
- `name`: Product name
- `description`: Product description
- `image`: Product image
- `purchasePrice`: Product purchase price
- `sellingPrice`: Product selling price
- `sku`: Product SKU
- `supplier`: Product supplier

**Process:**
1. Checks if the product object exists
2. Returns a formatted product object with selected fields