# User Controller Documentation

## Overview
The user controller manages user-related operations including creating, retrieving, updating, and deleting users. It also handles user verification processes and permission checks.

## Functions

### createUser
**Description:** Creates a new user or updates an existing one, with optional OTP verification.
**Parameters:**
- `dataUser`: Object containing user details (name, email, password, role, id_owner, confirmOtp, code)
- `user`: Current authenticated user

**Process:**
1. Checks if the requester has owner permissions
2. Checks if a user with the provided email already exists
   - If exists, updates the user information
   - If not, proceeds with creation
3. For new users:
   - If confirmOtp is true, verifies the OTP code and creates the user
   - If confirmOtp is false, creates a temporary user and sends a verification code
4. Returns appropriate success or error messages

### sendAgain
**Description:** Resends verification code for user registration.
**Parameters:**
- `dataUser`: Object containing user details (name, email, password)
- `user`: Current authenticated user

**Process:**
1. Checks if the requester has owner permissions
2. Generates a new verification code
3. Deletes any existing temporary user records with the same email
4. Creates a new temporary user record
5. Sends the verification code via email
6. Returns a success message

### showUser
**Description:** Retrieves all users associated with a specific owner.
**Parameters:**
- `userId`: The owner ID to filter users by (from query parameters)

**Process:**
1. Validates that userId is provided
2. Finds all users with the matching id_owner
3. Formats the user data for response
4. Returns the list of users

### deleteUser
**Description:** Deletes a user by ID.
**Parameters:**
- `id`: User ID to delete (from route parameters)

**Process:**
1. Finds and deletes the user with the specified ID
2. Returns a success message if deletion is successful
3. Returns an error if the user is not found

### editUser
**Description:** Updates user information.
**Parameters:**
- `id`: User ID to update (from route parameters)
- Request body containing fields to update (name, email, password, role)

**Process:**
1. Prepares the update data from the request body
2. Hashes the password if a new one is provided
3. Updates the user record
4. Returns the updated user data
5. Returns an error if the user is not found