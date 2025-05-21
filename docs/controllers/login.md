# Login Controller Documentation

## Overview
The login controller handles user authentication, registration, and password management functionalities. It provides endpoints for logging in with email/password, logging in with Google, registering new users, and resetting passwords.

## Functions

### loginWithEmail
**Description:** Authenticates a user with email and password.
**Parameters:**
- `email`: User's email address
- `password`: User's password

**Process:**
1. Finds a user with the provided email
2. Compares the provided password with the stored hashed password
3. Returns user data if authentication is successful

### loginWithGoogle
**Description:** Authenticates a user with Google credentials or creates a new user if not found.
**Parameters:**
- `GoogleID`: Google's unique identifier
- `family_name`: User's family name from Google
- `given_name`: User's given name from Google
- `email`: User's email from Google

**Process:**
1. Searches for an existing user with the GoogleID or email
2. Updates the GoogleID if the user exists but doesn't have a GoogleID
3. Creates a new user if no matching user is found
4. Returns user data

### registerUser
**Description:** Registers a new user with email verification.
**Parameters:**
- `name`: User's full name
- `email`: User's email address

**Process:**
1. Checks if the email already exists
2. Generates a random password and verification code
3. Creates a temporary user record
4. Sends a verification email with the code and password
5. Returns a success message

### sendResetCode
**Description:** Sends a password reset code to the user's email.
**Parameters:**
- `email`: User's email address

**Process:**
1. Finds the user with the provided email
2. Generates a reset code and sets an expiration time
3. Sends the reset code to the user's email
4. Returns a success message

### resetPassword
**Description:** Resets a user's password or completes the registration process.
**Parameters:**
- `email`: User's email address
- `code`: Verification code
- `newPassword`: New password (optional for registration verification)

**Process:**
1. Checks if this is a registration verification or password reset
2. For registration: verifies the code and creates a new user
3. For password reset: verifies the code and updates the password
4. Returns a success message and user data for registration