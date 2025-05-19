const express = require('express');
const chat = require('../controllers/chat.js'); // Import controller

const router = express.Router();

/**
 * @swagger
 * /api/chat/getMessages:
 *   post:
 *     summary: Get chat messages for a user
 *     tags: [Chat]
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
 *                 properties:
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   sender:
 *                     type: object
 *                     description: User who sent the message
 *                   owner:
 *                     type: object
 *                     description: Owner of the message
 *                   content:
 *                     type: string
 *                     description: Message content
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Message creation time
 *       500:
 *         description: Server error
 */
router.post('/getMessages', chat.getMessages);
module.exports = router;
