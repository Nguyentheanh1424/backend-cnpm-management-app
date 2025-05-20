# Sell Controller Documentation

## Overview
The sell controller manages sales operations, customer management, and transaction history. It provides functionality for retrieving products, managing customers, creating sales records, and tracking transaction history.

## Functions

### find_code
**Description:** Retrieves all products belonging to a specific owner.
**Parameters:**
- `user`: User object containing owner ID

**Process:**
1. Finds all products associated with the owner ID
2. Returns the list of products with a success message
3. Returns an error if the products cannot be retrieved

### get_customer
**Description:** Retrieves all customers belonging to a specific owner.
**Parameters:**
- `user`: User object containing owner ID

**Process:**
1. Finds all customers associated with the owner ID
2. Populates creator information and sorts by order date
3. Returns the list of customers with a success message
4. Returns an error if the customers cannot be retrieved

### create_customer
**Description:** Creates a new customer.
**Parameters:**
- `name`: Customer name
- `email`: Customer email
- `phone`: Customer phone number
- `user`: User object containing owner ID and user ID

**Process:**
1. Checks if a customer with the provided phone number already exists
2. Creates a new customer with the provided information
3. Returns the new customer with a success message
4. Returns an error if the customer cannot be created

### history
**Description:** Creates a new sales record (bill) and updates inventory.
**Parameters:**
- `owner`: Owner ID
- `customerId`: Customer phone number (optional)
- `totalAmount`: Total amount of the sale
- `items`: Array of items sold (product ID and quantity)
- `paymentMethod`: Method of payment
- `notes`: Additional notes
- `discount`: Discount amount
- `vat`: VAT amount
- `creator`: Creator ID

**Process:**
1. If a customer ID is provided:
   - Finds or creates the customer
   - Updates customer purchase history and loyalty metrics
2. Creates a new bill with the provided information
3. Updates product inventory by reducing stock for each item sold
4. Returns a success message
5. Returns an error if the bill cannot be created

### get_history
**Description:** Retrieves sales history for a specific owner.
**Parameters:**
- `user`: User object containing owner ID

**Process:**
1. Finds all bills associated with the owner ID
2. Populates owner, creator, customer, and product information
3. Sorts by order date in descending order
4. Returns the list of bills
5. Returns an error if the history cannot be retrieved

### get_history_customer
**Description:** Retrieves customer change history for a specific owner.
**Parameters:**
- `user`: User object containing owner ID

**Process:**
1. Finds all customer change history records associated with the owner ID
2. Populates employee and customer information
3. Sorts by timestamp in descending order
4. Returns the list of history records
5. Returns an error if the history cannot be retrieved

### edit_customer
**Description:** Updates an existing customer.
**Parameters:**
- `user`: User object containing owner ID and user ID
- `customer_edit`: Updated customer data

**Process:**
1. Finds the customer to be updated
2. Checks if the phone number is already used by another customer
3. Updates the customer with the provided information
4. Tracks changes by comparing old and new values
5. Creates a history record of the changes
6. Returns a success message
7. Returns an error if the customer cannot be updated

### delete_customer
**Description:** Deletes a customer.
**Parameters:**
- `user`: User object containing owner ID and user ID
- `customer_delete`: Customer to be deleted
- `detail`: Additional details about the deletion

**Process:**
1. Deletes the customer from the database
2. Creates a history record of the deletion
3. Returns a success message
4. Returns an error if the customer cannot be deleted