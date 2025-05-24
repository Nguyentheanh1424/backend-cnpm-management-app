const express = require('express');
const {
    findCode,
    getCustomer,
    createCustomer,
    history,
    getHistory,
    getHistoryCustomer,
    editCustomer,
    deleteCustomer
} = require('../controllers/sell');
const { validateUserPermission } = require('../middlewares/auth');
const router = express.Router();

/**
 * @swagger
 * /api/sell/findCode:
 *   post:
 *     summary: Get list of products for a specific user
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
 *                 required:
 *                   - id_owner
 *                 properties:
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *                   role:
 *                     type: string
 *                     description: User role
 *     responses:
 *       200:
 *         description: List of formatted products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error retrieving products
 */
router.post('/findCode', findCode);

/**
 * @swagger
 * /api/sell/getCustomer:
 *   post:
 *     summary: Get list of customers for a specific user
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
 *                 required:
 *                   - id_owner
 *                 properties:
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *                   role:
 *                     type: string
 *                     description: User role
 *     responses:
 *       200:
 *         description: List of formatted customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Error retrieving customers
 */
router.post('/getCustomer', getCustomer);

/**
 * @swagger
 * /api/sell/createCustomer:
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
 *               - name
 *               - phone
 *             properties:
 *               user:
 *                 type: object
 *                 required:
 *                   - _id
 *                   - id_owner
 *                   - role
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: User ID
 *                   id_owner:
 *                     type: string
 *                     description: Owner ID
 *                   role:
 *                     type: string
 *                     description: User role
 *               name:
 *                 type: string
 *                 description: Customer name
 *               email:
 *                 type: string
 *                 description: Customer email
 *               phone:
 *                 type: string
 *                 description: Customer phone
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customer:
 *                   $ref: '#/components/schemas/Customer'
 *                 message:
 *                   type: string
 *                   example: Tạo khách hàng thành công
 *       400:
 *         description: Phone number already registered
 *       500:
 *         description: Error creating customer
 */
router.post('/createCustomer', validateUserPermission("create_customer"), createCustomer);

/**
 * @swagger
 * /api/sell/history:
 *   post:
 *     summary: Create a new bill and update customer information
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
 *               - creator
 *             properties:
 *               owner:
 *                 type: string
 *                 description: Owner ID
 *               creator:
 *                 type: object
 *                 required:
 *                   - _id
 *                   - role
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Creator user ID
 *                   role:
 *                     type: string
 *                     description: Creator user role
 *               customerId:
 *                 type: string
 *                 description: Customer phone number (optional)
 *               totalAmount:
 *                 type: string
 *                 description: Total amount of the bill
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productID
 *                     - name
 *                     - quantity
 *                     - price
 *                   properties:
 *                     productID:
 *                       type: string
 *                       description: Product ID
 *                     name:
 *                       type: string
 *                       description: Product name
 *                     quantity:
 *                       type: number
 *                       description: Quantity purchased
 *                     price:
 *                       type: string
 *                       description: Product price
 *                     discount:
 *                       type: string
 *                       description: Item discount (optional)
 *                     totalAmount:
 *                       type: string
 *                       description: Item total amount (optional)
 *               paymentMethod:
 *                 type: string
 *                 description: Payment method (optional)
 *               notes:
 *                 type: string
 *                 description: Additional notes (optional)
 *               discount:
 *                 type: string
 *                 description: Bill discount (optional)
 *               vat:
 *                 type: string
 *                 description: VAT amount (optional)
 *     responses:
 *       201:
 *         description: Bill created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bill:
 *                   $ref: '#/components/schemas/Bill'
 *                 message:
 *                   type: string
 *                   example: Tạo hóa đơn thành công
 *       500:
 *         description: Error creating bill
 */
router.post('/history', validateUserPermission("create_bill"), history);

/**
 * @swagger
 * /api/sell/getHistory:
 *   post:
 *     summary: Get bill history for a specific user
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
 *                 required:
 *                   - id_owner
 *                 properties:
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *                   role:
 *                     type: string
 *                     description: User role
 *     responses:
 *       200:
 *         description: List of formatted bills
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bill'
 *       500:
 *         description: Error retrieving bill history
 */
router.post('/getHistory', getHistory);

/**
 * @swagger
 * /api/sell/getHistoryCustomer:
 *   post:
 *     summary: Get customer change history
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
 *                 required:
 *                   - id_owner
 *                 properties:
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *                   role:
 *                     type: string
 *                     description: User role
 *     responses:
 *       200:
 *         description: Customer change history
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
 *                     type: string
 *                   action:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                   details:
 *                     type: string
 *       500:
 *         description: Error retrieving customer history
 */
router.post('/getHistoryCustomer', getHistoryCustomer);

/**
 * @swagger
 * /api/sell/editCustomer:
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
 *               - customer_edit
 *             properties:
 *               user:
 *                 type: object
 *                 required:
 *                   - _id
 *                   - id_owner
 *                   - role
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: User ID
 *                   id_owner:
 *                     type: string
 *                     description: Owner ID
 *                   role:
 *                     type: string
 *                     description: User role
 *               customer_edit:
 *                 type: object
 *                 required:
 *                   - _id
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Customer ID
 *                   name:
 *                     type: string
 *                     description: Customer name
 *                   email:
 *                     type: string
 *                     description: Customer email
 *                   phone:
 *                     type: string
 *                     description: Customer phone
 *                   rate:
 *                     type: number
 *                     description: Customer purchase rate
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *       400:
 *         description: Phone number already registered
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
router.post('/editCustomer', validateUserPermission("edit_customer"), editCustomer);

/**
 * @swagger
 * /api/sell/deleteCustomer:
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
 *             properties:
 *               user:
 *                 type: object
 *                 required:
 *                   - _id
 *                   - id_owner
 *                   - role
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: User ID
 *                   id_owner:
 *                     type: string
 *                     description: Owner ID
 *                   role:
 *                     type: string
 *                     description: User role
 *               customer_delete:
 *                 type: object
 *                 required:
 *                   - _id
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Customer ID
 *               detail:
 *                 type: string
 *                 description: Details of the delete action
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
router.post('/deleteCustomer', validateUserPermission("delete_customer"), deleteCustomer);

module.exports = router;