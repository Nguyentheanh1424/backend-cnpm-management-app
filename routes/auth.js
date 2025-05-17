const express = require('express');
const router = express.Router();
const { 
    loginWithEmail, 
    loginWithGoogle, 
    registerUser, 
    sendResetCode, 
    verifyResetCode, 
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', loginWithEmail);

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Login or register with Google
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
 *               family_name:
 *                 type: string
 *               given_name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Server error
 */
router.post('/google', loginWithGoogle);

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirm:
 *                 type: boolean
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *       201:
 *         description: Verification code sent
 *       400:
 *         description: Email already exists or invalid code
 *       500:
 *         description: Server error
 */
router.post('/signup', registerUser);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
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
 *     responses:
 *       200:
 *         description: Reset code sent
 *       404:
 *         description: Email not found
 *       500:
 *         description: Server error
 */
router.post('/forgot-password', sendResetCode);

/**
 * @swagger
 * /api/auth/verify-code:
 *   post:
 *     summary: Verify reset code
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - ma
 *             properties:
 *               email:
 *                 type: string
 *               ma:
 *                 type: string
 *     responses:
 *       200:
 *         description: Code verified
 *       400:
 *         description: Invalid or expired code
 *       500:
 *         description: Server error
 */
router.post('/verify-code', verifyResetCode);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       500:
 *         description: Server error
 */
router.post('/reset-password', resetPassword);

module.exports = router;
