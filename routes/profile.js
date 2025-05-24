const express = require('express');
const {
    getProfile,
    changeProfile,
    updateProfile,
} = require('../controllers/profile');

const router = express.Router();

/**
 * @swagger
 * /api/profile/get_profile:
 *   post:
 *     summary: Retrieve user profile
 *     tags:
 *       - Profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     example: user@example.com
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 role:
 *                   type: string
 *                 right:
 *                   type: object
 *       400:
 *         description: User not found or invalid request
 *       500:
 *         description: Internal server error
 */
router.post('/get_profile', getProfile);

/**
 * @swagger
 * /api/profile/change_profile:
 *   post:
 *     summary: Change user name and password
 *     tags:
 *       - Profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 60d0fe4f5311236168a109ca
 *                   name:
 *                     type: string
 *                     example: John Doe
 *                   password:
 *                     type: string
 *                     example: newPassword123
 *     responses:
 *       200:
 *         description: Profile changed successfully
 *       400:
 *         description: Invalid input or user not found
 *       500:
 *         description: Internal server error
 */
router.post('/change_profile', changeProfile);

/**
 * @swagger
 * /api/profile/update_profile:
 *   post:
 *     summary: Update user avatar
 *     tags:
 *       - Profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 60d0fe4f5311236168a109ca
 *                   email:
 *                     type: string
 *                     example: user@example.com
 *               newPr:
 *                 type: object
 *                 properties:
 *                   image:
 *                     type: object
 *                     properties:
 *                       secure_url:
 *                         type: string
 *                         example: https://res.cloudinary.com/demo/image/upload/v1620000000/sample.jpg
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *       400:
 *         description: Invalid input or update failed
 *       500:
 *         description: Internal server error
 */
router.post('/update_profile', updateProfile);

module.exports = router;
