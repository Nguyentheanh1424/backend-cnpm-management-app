const express = require('express');
const {
    getBank,
    addBank,
    deleteBank
} = require('../controllers/bank.js'); // Import controller

const router = express.Router();

/**
 * @swagger
 * /api/bank/get_bank:
 *   post:
 *     summary: Get bank accounts for a user
 *     tags: [Bank]
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
 *         description: List of bank accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   owner:
 *                     type: string
 *                   name:
 *                     type: string
 *                   bankName:
 *                     type: string
 *                   accountNumber:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.post('/get_bank', getBank);

/**
 * @swagger
 * /api/bank/add_bank:
 *   post:
 *     summary: Add a new bank account
 *     tags: [Bank]
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
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The user's ID
 *               newPr:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Account holder name
 *                   bankName:
 *                     type: string
 *                     description: Bank name
 *                   accountNumber:
 *                     type: string
 *                     description: Account number
 *     responses:
 *       201:
 *         description: Bank account added successfully
 *       500:
 *         description: Server error
 */
router.post('/add_bank', addBank);

/**
 * @swagger
 * /api/bank/delete_bank:
 *   post:
 *     summary: Delete a bank account
 *     tags: [Bank]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - accountNumber
 *               - bankName
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The user's ID
 *               accountNumber:
 *                 type: string
 *                 description: Account number to delete
 *               bankName:
 *                 type: string
 *                 description: Bank name
 *     responses:
 *       200:
 *         description: Bank account deleted successfully
 *       404:
 *         description: Account not found
 *       500:
 *         description: Server error
 */
router.post('/delete_bank', deleteBank);

module.exports = router;
