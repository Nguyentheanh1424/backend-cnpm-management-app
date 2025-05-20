# Profile Controller Documentation

## Overview
The profile controller manages user profile operations. It provides functionality to retrieve user profiles, update profile information, and change profile avatars.

## Functions

### get_profile
**Description:** Retrieves a user's profile information including role permissions.
**Parameters:**
- `user`: User object containing email

**Process:**
1. Finds the user by email and populates owner information
2. If the user is found, retrieves the user's role permissions
3. Returns the user profile with role permissions
4. Returns an error if the user is not found

### change_profile
**Description:** Updates a user's profile information (name and password).
**Parameters:**
- `user`: User object containing ID, name, and password

**Process:**
1. Finds the user by owner ID and updates name and password
2. Returns a success message if the update is successful
3. Returns an error if the update fails

### update_profile
**Description:** Updates a user's profile avatar.
**Parameters:**
- `user`: User object containing ID
- `newPr`: Object containing image information with secure_url

**Process:**
1. Finds the user by owner ID and updates the avatar URL
2. Returns a success message if the update is successful
3. Returns an error if the update fails