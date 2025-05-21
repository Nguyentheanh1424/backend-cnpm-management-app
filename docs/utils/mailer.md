# Mailer Utility Documentation

## Overview
The Mailer utility provides email functionality for the application. It uses Nodemailer with Gmail as the email service to send verification codes and temporary passwords to users.

## Configuration
The mailer is configured using environment variables:
- `EMAIL_USER`: Gmail account username
- `EMAIL_PASS`: Gmail account password or app-specific password

## Functions

### sendCodeMail(to, code, password)
**Description:** Sends a verification code email to a user, with an optional temporary password.

**Parameters:**
- `to`: The recipient's email address
- `code`: The verification code to send
- `password` (optional): A temporary password to include in the email

**Process:**
1. Creates an email message with the verification code
2. If a password is provided, adds it to the email message
3. Sends the email using the configured transporter
4. Logs the successful sending of the email
5. If an error occurs, logs the error and throws an exception

## Email Content
The email contains:
1. A verification code that expires in 10 minutes
2. (Optional) A temporary password with instructions to change it after first login

## Error Handling
If the email fails to send:
1. The error is logged using the application logger
2. An error is thrown with the message 'Failed to send verification email'

## Usage Example
```javascript
const { sendCodeMail } = require('../utils/mailer');

// Send verification code only
try {
  await sendCodeMail('user@example.com', '123456');
  console.log('Verification email sent successfully');
} catch (error) {
  console.error('Failed to send verification email:', error);
}

// Send verification code with temporary password
try {
  await sendCodeMail('user@example.com', '123456', 'tempPassword123');
  console.log('Verification email with temporary password sent successfully');
} catch (error) {
  console.error('Failed to send verification email:', error);
}
```