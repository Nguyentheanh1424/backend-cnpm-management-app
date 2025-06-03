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
 *     summary: Get user profile information
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *             properties:
 *               user:
 *                 type: object
 *                 required:
 *                   - email
 *                 properties:
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: User's email
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 id_owner:
 *                   type: object
 *                 right:
 *                   type: object
 *                   description: User permissions
 *       400:
 *         description: User not found
 *       500:
 *         description: Error retrieving user profile
 */
router.post('/get_profile', getProfile)

/**
 * @swagger
 * /api/profile/change_profile:
 *   post:
 *     summary: Update user name and password
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *             properties:
 *               user:
 *                 type: object
 *                 required:
 *                   - _id
 *                   - name
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: User's ID
 *                   name:
 *                     type: string
 *                     description: User's new name
 *                   password:
 *                     type: string
 *                     description: User's new password
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   example: Success
 *       400:
 *         description: Change profile error
 *       500:
 *         description: Error updating profile
 */
router.post('/change_profile', changeProfile)

/**
 * @swagger
 * /api/profile/update_profile:
 *   post:
 *     summary: Update user avatar
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - newPr
 *             properties:
 *               user:
 *                 type: object
 *                 required:
 *                   - _id
 *                   - email
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: User's ID
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: User's email
 *               newPr:
 *                 type: object
 *                 required:
 *                   - image
 *                 properties:
 *                   image:
 *                     type: object
 *                     properties:
 *                       secure_url:
 *                         type: string
 *                         description: URL of the uploaded avatar image
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   example: Success change avatar
 *       400:
 *         description: Change avatar error
 *       500:
 *         description: Error updating avatar
 */
router.post('/update_profile', updateProfile)

module.exports = router;
