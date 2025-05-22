const express = require('express');
const {
    findCode,
    deleteCustomer,
    history,
    getHistory,
    getCustomer,
    getHistoryCustomer,
    create_customer,
    edit_customer
} = require('../controllers/sell');
const { validateUserPermission } = require('../middlewares/auth');
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
router.post('/find_code', findCode);

/**
 * @swagger
 * /api/sell/create_customer:
 *   post:
 *     summary: Create a new customer
 *     tags: [Sell]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - customer
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *               customer:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Customer name
 *                   phone:
 *                     type: string
 *                     description: Customer phone
 *     responses:
 *       200:
 *         description: Customer created successfully
 *       500:
 *         description: Server error
 */
router.post('/create_customer', validateUserPermission("create_customer"), create_customer);

/**
 * @swagger
 * /api/sell/edit_customer:
 *   post:
 *     summary: Edit a customer
 *     tags: [Sell]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - customer
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *               customer:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Customer ID
 *                   name:
 *                     type: string
 *                     description: Customer name
 *                   phone:
 *                     type: string
 *                     description: Customer phone
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
router.post('/edit_customer', validateUserPermission("edit_customer"), edit_customer);

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
router.post('/delete_customer', validateUserPermission("delete_customer"), deleteCustomer);

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
router.post('/history', validateUserPermission("create_bill"), history);

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
router.post('/get_history', getHistory);

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
router.post('/get_customer', getCustomer);

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
router.post('/get_history_customer', getHistoryCustomer);

module.exports = router;