const express = require('express');
const router = express.Router();
const { 
    createUser, 
    showUser, 
    deleteUser, 
    editUser, 
    sendAgain 
} = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');

/**
 * @swagger
 * /api/user/create:
 *   post:
 *     summary: Create a new staff user
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Creates a new staff user under the owner's account.
 *       Only owners can create staff accounts.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dataUser
 *               - user
 *             properties:
 *               dataUser:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: User's name
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: User's email
 *                   password:
 *                     type: string
 *                     format: password
 *                     description: User's password
 *                   role:
 *                     type: string
 *                     description: User's role
 *                   id_owner:
 *                     type: string
 *                     description: Owner's ID
 *                   confirmOtp:
 *                     type: boolean
 *                     description: Whether this is an OTP confirmation
 *                   code:
 *                     type: string
 *                     description: Verification code (required if confirmOtp is true)
 *               user:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Current user's ID
 *                   id_owner:
 *                     type: string
 *                     description: Current user's owner ID
 *     responses:
 *       200:
 *         description: User updated or staff created successfully
 *       201:
 *         description: Confirmation code sent
 *       400:
 *         description: Invalid request or user not found
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.post('/create', authenticateToken, createUser);

/**
 * @swagger
 * /api/user/resend:
 *   post:
 *     summary: Resend verification code
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Resends verification code for staff account creation.
 *       Only owners can resend verification codes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dataUser
 *               - user
 *             properties:
 *               dataUser:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: User's name
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: User's email
 *                   password:
 *                     type: string
 *                     format: password
 *                     description: User's password
 *                   role:
 *                     type: string
 *                     description: User's role
 *                   id_owner:
 *                     type: string
 *                     description: Owner's ID
 *               user:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Current user's ID
 *                   id_owner:
 *                     type: string
 *                     description: Current user's owner ID
 *     responses:
 *       201:
 *         description: Confirmation code sent
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.post('/resend', authenticateToken, sendAgain);

/**
 * @swagger
 * /api/user/list:
 *   get:
 *     summary: Get all users under an owner
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: Owner's ID
 *     responses:
 *       200:
 *         description: List of users
 *       400:
 *         description: Missing userId parameter
 *       404:
 *         description: No users found
 *       500:
 *         description: Server error
 */
router.get('/list', authenticateToken, showUser);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticateToken, deleteUser);

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password (optional)
 *               role:
 *                 type: string
 *                 description: User's role
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticateToken, editUser);

module.exports = router;