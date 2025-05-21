const express = require('express');
const sell = require('../controllers/sell'); // Import controller
const router = express.Router();

/**
 * @swagger
 * /api/sell/find_code:
 *   post:
 *     summary: Get products for a specific user
 *     tags: [Sell]
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
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   type: array
 *                   items:
 *                     type: object
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.post('/find_code', sell.findCode);

/**
 * @swagger
 * /api/sell/delete_customer:
 *   post:
 *     summary: Delete a customer
 *     tags: [Sell]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - customer_delete
 *               - detail
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *                   _id:
 *                     type: string
 *                     description: The user's ID
 *               customer_delete:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The customer's ID
 *               detail:
 *                 type: string
 *                 description: Details about the deletion
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
router.post('/delete_customer', sell.deleteCustomer);

/**
 * @swagger
 * /api/sell/history:
 *   post:
 *     summary: Create a new bill/transaction
 *     tags: [Sell]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - owner
 *               - totalAmount
 *               - items
 *             properties:
 *               owner:
 *                 type: string
 *                 description: Owner ID
 *               customerId:
 *                 type: string
 *                 description: Customer phone number
 *               totalAmount:
 *                 type: string
 *                 description: Total amount of the bill
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productID:
 *                       type: string
 *                       description: Product ID
 *                     quantity:
 *                       type: number
 *                       description: Quantity of the product
 *               paymentMethod:
 *                 type: string
 *                 description: Method of payment
 *               notes:
 *                 type: string
 *                 description: Additional notes
 *               discount:
 *                 type: number
 *                 description: Discount amount
 *               vat:
 *                 type: number
 *                 description: VAT amount
 *               creator:
 *                 type: string
 *                 description: Creator ID
 *     responses:
 *       200:
 *         description: Bill created successfully
 *       404:
 *         description: Error creating bill
 *       500:
 *         description: Server error
 */
router.post('/history', sell.history);

/**
 * @swagger
 * /api/sell/get_history:
 *   post:
 *     summary: Get transaction history for a user
 *     tags: [Sell]
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
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */
router.post('/get_history', sell.getHistory);

/**
 * @swagger
 * /api/sell/get_customer:
 *   post:
 *     summary: Get customers for a user
 *     tags: [Sell]
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
 *         description: List of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customers:
 *                   type: array
 *                   items:
 *                     type: object
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.post('/get_customer', sell.getCustomer);

/**
 * @swagger
 * /api/sell/get_history_customer:
 *   post:
 *     summary: Get customer history for a user
 *     tags: [Sell]
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
 *         description: List of customer history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   employee:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                   customer:
 *                     type: object
 *                   action:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                   details:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.post('/get_history_customer', sell.getHistoryCustomer);

module.exports = router;
