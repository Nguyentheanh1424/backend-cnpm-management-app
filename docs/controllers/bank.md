# Bank Controller Documentation

## Overview
The bank controller manages bank account operations for users. It provides functionality to retrieve, add, and delete bank accounts associated with a user.

## Functions

### get_bank
**Description:** Retrieves all bank accounts for the current user's owner.
**Parameters:**
- `user`: User object containing owner ID

**Process:**
1. Finds all bank accounts associated with the user's owner ID
2. Returns the list of bank accounts

### add_bank
**Description:** Adds a new bank account for the user.
**Parameters:**
- `user`: User object containing user ID
- `newPr`: Bank account details to be added

**Process:**
1. Creates a new bank account with the provided details
2. Saves the bank account to the database
3. Returns a success message

### delete_bank
**Description:** Deletes a bank account for the user.
**Parameters:**
- `user`: User object containing user ID
- `accountNumber`: Account number of the bank account to delete
- `bankName`: Name of the bank for the account to delete

**Process:**
1. Validates that all required parameters are provided
2. Finds and deletes the bank account matching the criteria
3. Returns a success message if deletion is successful
4. Returns an error if the account is not found