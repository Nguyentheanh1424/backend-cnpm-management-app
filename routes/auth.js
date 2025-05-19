const express = require('express');
const router = express.Router();
const { 
    loginWithEmail, 
    loginWithGoogle, 
    registerUser, 
    sendResetCode, 
    resetPassword 
} = require('../controllers/login');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     avatar:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', loginWithEmail);

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Login with Google
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - GoogleID
 *               - family_name
 *               - given_name
 *               - email
 *             properties:
 *               GoogleID:
 *                 type: string
 *                 description: Google user ID
 *               family_name:
 *                 type: string
 *                 description: User's family name
 *               given_name:
 *                 type: string
 *                 description: User's given name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     avatar:
 *                       type: string
 *       201:
 *         description: New user created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     avatar:
 *                       type: string
 *       401:
 *         description: Invalid Google credentials
 *       500:
 *         description: Server error
 */
router.post('/google', loginWithGoogle);

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Start the registration process
 *     tags: [Authentication]
 *     description: |
 *       This endpoint initiates the registration process by:
 *       1. Creating a temporary user with the provided email and name
 *       2. Generating a random password
 *       3. Sending a verification code to the user's email
 *       
 *       To complete registration, the user must verify their email using the /reset_password endpoint.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email
 *               name:
 *                 type: string
 *                 description: User's name
 *     responses:
 *       201:
 *         description: Verification code sent successfully
 *       400:
 *         description: Email already in use
 *       500:
 *         description: Server error
 */
router.post('/signup', registerUser);

/**
 * @swagger
 * /api/auth/forgot_password:
 *   post:
 *     summary: Send password reset code
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email
 *     responses:
 *       200:
 *         description: Reset code sent successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/forgot_password', sendResetCode);


/**
 * @swagger
 * /api/auth/reset_password:
 *   post:
 *     summary: Reset password or complete registration
 *     tags: [Authentication]
 *     description: |
 *       This endpoint serves two purposes:
 *       1. Complete registration - Verify email and set a password for a temporary user
 *       2. Reset password - Change password for an existing user
 *       The same verification code is used for both processes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email
 *               code:
 *                 type: string
 *                 description: Verification code received via email
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: New password (optional for registration if you want to use the auto-generated password)
 *     responses:
 *       200:
 *         description: Password reset or registration completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Success message
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                         avatar:
 *                           type: string
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Success message
 *       400:
 *         description: Invalid verification code
 *       404:
 *         description: Email not found
 *       500:
 *         description: Server error
 */
router.post('/reset_password', resetPassword);

module.exports = router;
