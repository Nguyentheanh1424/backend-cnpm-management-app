# Product Controller Documentation

## Overview
The product controller manages product and supplier-related functionalities. It provides endpoints for creating, reading, updating, and deleting products and suppliers, as well as tracking history of changes.

## Product Functions

### show
**Description:** Retrieves all products for the current owner.
**Parameters:**
- `user`: User object containing owner ID

**Process:**
1. Fetches all products associated with the owner
2. Returns the product list

### edit
**Description:** Updates an existing product.
**Parameters:**
- `user`: User object containing owner ID
- `product_edit`: Updated product data
- `detail`: Additional details about the update
- `check`: Flag to determine if image should be deleted

**Process:**
1. Finds the product to be updated
2. Deletes the old image from Cloudinary if needed
3. Updates the product with new data
4. Tracks changes by comparing old and new values
5. Creates a history record of the changes
6. Returns success message

### deletes
**Description:** Deletes a product.
**Parameters:**
- `user`: User object containing owner ID
- `product_delete`: Product to be deleted
- `detail`: Additional details about the deletion

**Process:**
1. Deletes the product from the database
2. Creates a history record of the deletion
3. Deletes the product image from Cloudinary if it exists
4. Returns success message

### show_detail
**Description:** Retrieves detailed information about a specific product.
**Parameters:**
- `id`: Product ID (from request params)

**Process:**
1. Finds the product by ID and populates supplier information
2. Returns the detailed product data

### create
**Description:** Creates a new product.
**Parameters:**
- `user`: User object containing owner ID
- `newPr`: New product data
- `detail`: Additional details about the creation

**Process:**
1. Checks if the SKU already exists
2. Creates a new product with the provided data
3. Creates a history record of the product creation
4. Returns success message

### get_history
**Description:** Retrieves the history of product changes.
**Parameters:**
- `user`: User object containing owner ID

**Process:**
1. Fetches all history records for the owner
2. Populates employee information
3. Returns the sorted history records

## Supplier Functions

### get_supplier
**Description:** Retrieves all suppliers for the current owner.
**Parameters:**
- `user`: User object containing owner ID

**Process:**
1. Fetches all suppliers associated with the owner
2. Populates creator information
3. Returns the supplier list

### create_supplier
**Description:** Creates a new supplier.
**Parameters:**
- `name`: Supplier name
- `email`: Supplier email
- `phone`: Supplier phone number
- `address`: Supplier address
- `user`: User object containing owner ID

**Process:**
1. Checks if the phone number already exists
2. Creates a new supplier with the provided data
3. Returns the new supplier and success message

### edit_supplier
**Description:** Updates an existing supplier.
**Parameters:**
- `user`: User object containing owner ID
- `supplier_edit`: Updated supplier data

**Process:**
1. Finds the supplier to be updated
2. Checks if the phone number is already used by another supplier
3. Updates the supplier with new data
4. Tracks changes by comparing old and new values
5. Creates a history record of the changes
6. Returns success message

### get_history_supplier
**Description:** Retrieves the history of supplier changes.
**Parameters:**
- `user`: User object containing owner ID

**Process:**
1. Fetches all supplier history records for the owner
2. Populates employee and supplier information
3. Returns the sorted history records

### delete_supplier
**Description:** Deletes a supplier.
**Parameters:**
- `user`: User object containing owner ID
- `supplier_delete`: Supplier to be deleted
- `detail`: Additional details about the deletion

**Process:**
1. Deletes the supplier from the database
2. Creates a history record of the deletion
3. Returns success message

## Product Search Functions

### getProductsBySupplier
**Description:** Retrieves products from a specific supplier.
**Parameters:**
- `productId`: Supplier ID
- `ownerId`: Owner ID

**Process:**
1. Uses aggregation to find products with the specified supplier
2. Returns the list of products with supplier details

### getProductsByProductName
**Description:** Searches for products by name.
**Parameters:**
- `query`: Search term
- `ownerId`: Owner ID

**Process:**
1. Uses aggregation to find products with names matching the query
2. Returns the list of products with supplier details