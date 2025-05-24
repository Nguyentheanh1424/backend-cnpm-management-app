const express = require('express');
const loggingOrder = require('../controllers/LoggingOrder');
const orderDetailHistory = require('../controllers/OrderDetailHistory');
const orderHistory = require('../controllers/OrderHistory');
const products = require('../controllers/product');
const suppliers = require('../controllers/supplier');
const { validateUserPermission } = require('../middlewares/auth');
const router = express.Router();

/**
 * @swagger
 * /api/import/loggingOrder/listOrder:
 *   get:
 *     summary: Get list of order logs
 *     tags: [Import]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by order ID, date, or username
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of logs per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: ownerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner ID
 *     responses:
 *       200:
 *         description: List of order logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderId:
 *                         type: string
 *                       orderDetailId:
 *                         type: string
 *                       status:
 *                         type: string
 *                       userName:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       details:
 *                         type: string
 *                       productName:
 *                         type: string
 *                 totalCount:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */
router.get('/loggingOrder/listOrder', loggingOrder.getLogging);

/**
 * @swagger
 * /api/import/orderDetail/listOrder:
 *   get:
 *     summary: Get order details by order ID
 *     tags: [Import]
 *     parameters:
 *       - in: query
 *         name: idOrder
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: List of order details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   orderId:
 *                     type: string
 *                   productId:
 *                     type: string
 *                   status:
 *                     type: string
 *                   quantity:
 *                     type: number
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   name:
 *                     type: string
 *                   image:
 *                     type: object
 *                     properties:
 *                       secure_url:
 *                         type: string
 *                       public_id:
 *                         type: string
 *                   price:
 *                     type: string
 *                   description:
 *                     type: string
 *       404:
 *         description: Order details not found
 *       500:
 *         description: Server error
 */
router.get('/orderDetail/listOrder', orderDetailHistory.listOrderDetail);

/**
 * @swagger
 * /api/import/orderDetail/updateDetail:
 *   post:
 *     summary: Update order details
 *     tags: [Import]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - formData
 *               - status
 *               - total
 *               - userName
 *               - userId
 *               - ownerId
 *             properties:
 *               formData:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - _id
 *                     - orderId
 *                     - productId
 *                     - status
 *                     - quantity
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Order detail ID
 *                     orderId:
 *                       type: string
 *                       description: Order ID
 *                     productId:
 *                       type: string
 *                       description: Product ID
 *                     status:
 *                       type: string
 *                       description: Status (e.g., pending, deliveried, canceled)
 *                     quantity:
 *                       type: number
 *                       description: Quantity
 *                     note:
 *                       type: string
 *                       description: Update notes
 *               status:
 *                 type: string
 *                 description: General status of the order
 *               total:
 *                 type: string
 *                 description: Total amount
 *               userName:
 *                 type: string
 *                 description: Username of the updater
 *               userId:
 *                 type: string
 *                 description: User ID of the updater
 *               ownerId:
 *                 type: string
 *                 description: Owner ID
 *     responses:
 *       200:
 *         description: Order details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order details updated successfully
 *       404:
 *         description: Order history not found
 *       500:
 *         description: Server error
 */
router.post('/orderDetail/updateDetail', validateUserPermission("edit_order"), orderDetailHistory.updateDetail);

/**
 * @swagger
 * /api/import/orderHistory/save:
 *   post:
 *     summary: Save order history
 *     tags: [Import]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - dataForm
 *               - tax
 *             properties:
 *               user:
 *                 type: object
 *                 required:
 *                   - id
 *                   - ownerId
 *                   - email
 *                   - name
 *                   - role
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: User ID
 *                   ownerId:
 *                     type: string
 *                     description: Owner ID
 *                   email:
 *                     type: string
 *                     description: User email
 *                   name:
 *                     type: string
 *                     description: Username
 *                   role:
 *                     type: string
 *                     description: User role
 *               dataForm:
 *                 type: object
 *                 additionalProperties:
 *                   type: array
 *                   items:
 *                     type: object
 *                     required:
 *                       - supplierId
 *                       - productId
 *                       - price
 *                       - quantity
 *                       - status
 *                     properties:
 *                       supplierId:
 *                         type: string
 *                         description: Supplier ID
 *                       productId:
 *                         type: string
 *                         description: Product ID
 *                       price:
 *                         type: string
 *                         description: Product price
 *                       quantity:
 *                         type: number
 *                         description: Quantity
 *                       status:
 *                         type: string
 *                         description: Status (e.g., pending, deliveried)
 *               tax:
 *                 type: number
 *                 description: Tax percentage
 *     responses:
 *       200:
 *         description: Order history saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order history saved successfully
 *                 emailErrors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       error:
 *                         type: string
 *       500:
 *         description: Error during transaction
 */
router.post('/orderHistory/save', validateUserPermission("create_order"), orderHistory.saveOrderHistory);

/**
 * @swagger
 * /api/import/orderHistory/getOrder:
 *   get:
 *     summary: Get pending orders
 *     tags: [Import]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by order ID, supplier name, or date
 *       - in: query
 *         name: ownerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner ID
 *     responses:
 *       200:
 *         description: List of pending orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   supplierId:
 *                     type: string
 *                   generalStatus:
 *                     type: string
 *                   amount:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   nameSupplier:
 *                     type: string
 *                   emailSupplier:
 *                     type: string
 *                   supplier_Id:
 *                     type: string
 *                   tax:
 *                     type: number
 *       400:
 *         description: Invalid date format
 *       500:
 *         description: Server error
 */
router.get('/orderHistory/getOrder', orderHistory.getOrder);

/**
 * @swagger
 * /api/import/orderHistory/updateOrderHistory:
 *   put:
 *     summary: Update order history
 *     tags: [Import]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - status
 *               - total
 *               - userid
 *               - userName
 *               - ownerId
 *             properties:
 *               id:
 *                 type: string
 *                 description: Order ID
 *               status:
 *                 type: string
 *                 description: New status (e.g., deliveried, Canceled)
 *               total:
 *                 type: string
 *                 description: Total amount
 *               userid:
 *                 type: string
 *                 description: User ID
 *               userName:
 *                 type: string
 *                 description: Username
 *               ownerId:
 *                 type: string
 *                 description: Owner ID
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Update date
 *               notes:
 *                 type: string
 *                 description: Update notes
 *               tax:
 *                 type: number
 *                 description: Tax percentage
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order updated successfully
 *       404:
 *         description: Order history not found
 *       500:
 *         description: Error updating order
 */
router.put('/orderHistory/updateOrderHistory', validateUserPermission("edit_order"), orderHistory.updateOrderHistory);

/**
 * @swagger
 * /api/import/orderHistory/supplierName:
 *   get:
 *     summary: Get supplier details by order ID
 *     tags: [Import]
 *     parameters:
 *       - in: query
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *       - in: query
 *         name: ownerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner ID
 *     responses:
 *       200:
 *         description: Supplier details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 supplierName:
 *                   type: string
 *                 supplierEmail:
 *                   type: string
 *                 tax:
 *                   type: number
 *       400:
 *         description: Order ID is required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.get('/orderHistory/supplierName', orderHistory.getSupplierByOrderId);

/**
 * @swagger
 * /api/import/orderHistory/lastProductTop100:
 *   get:
 *     summary: Get top 100 products from last month
 *     tags: [Import]
 *     parameters:
 *       - in: query
 *         name: ownerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner ID
 *     responses:
 *       200:
 *         description: List of top 100 products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   image:
 *                     type: object
 *                     properties:
 *                       secure_url:
 *                         type: string
 *                       public_id:
 *                         type: string
 *                   purchasePrice:
 *                     type: string
 *                   supplierDetails:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *       400:
 *         description: Owner ID is required
 *       500:
 *         description: An error occurred
 */
router.get('/orderHistory/lastProductTop100', orderHistory.getProductTop100);

/**
 * @swagger
 * /api/import/product/exhibitPro:
 *   get:
 *     summary: Get products by supplier
 *     tags: [Import]
 *     parameters:
 *       - in: query
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *       - in: query
 *         name: ownerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner ID
 *     responses:
 *       200:
 *         description: List of products for the supplier
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   image:
 *                     type: object
 *                     properties:
 *                       secure_url:
 *                         type: string
 *                       public_id:
 *                         type: string
 *                   purchasePrice:
 *                     type: string
 *                   supplierDetails:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *       400:
 *         description: Product ID is required
 *       404:
 *         description: No products found for this supplier
 *       500:
 *         description: Internal server error
 */
router.get('/product/exhibitPro', products.getProductsBySupplier);

/**
 * @swagger
 * /api/import/product/exhibitProN:
 *   get:
 *     summary: Search products by name
 *     tags: [Import]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Product name search query
 *       - in: query
 *         name: ownerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner ID
 *     responses:
 *       200:
 *         description: List of products matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   image:
 *                     type: object
 *                     properties:
 *                       secure_url:
 *                         type: string
 *                       public_id:
 *                         type: string
 *                   purchasePrice:
 *                     type: string
 *                   supplierDetails:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *       400:
 *         description: Product ID is required
 *       404:
 *         description: No products found for this supplier
 *       500:
 *         description: Internal server error
 */
router.get('/product/exhibitProN', products.getProductsByProductName);

/**
 * @swagger
 * /api/import/supplier/search:
 *   get:
 *     summary: Get supplier suggestions
 *     tags: [Import]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query for supplier name
 *       - in: query
 *         name: ownerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner ID
 *     responses:
 *       200:
 *         description: List of supplier suggestions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
 *                   owner:
 *                     type: string
 *       400:
 *         description: Query parameter is required
 *       500:
 *         description: Error searching suppliers
 */
router.get('/supplier/search', suppliers.getSupplierSuggestion);

module.exports = router;