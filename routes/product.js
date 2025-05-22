const express = require('express');
const {
    show,
    showDetail,
    edit,
    getHistory,
    getSupplier,
    getHistorySupplier,
    deletes,
    create,
    create_supplier,
    edit_supplier,
    delete_supplier
} = require('../controllers/product');
const { validateUserPermission } = require('../middlewares/auth');
const router = express.Router();

/**
 * @swagger
 * /api/products/show:
 *   post:
 *     summary: Get all product's
 *     tags: [Products]
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
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *     responses:
 *       200:
 *         description: List of products
 *       500:
 *         description: Server error
 */
router.post('/show', show);

/**
 * @swagger
 * /api/products/show/{id}:
 *   get:
 *     summary: Get product details by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get('/show/:id', showDetail);

/**
 * @swagger
 * /api/products/edit:
 *   post:
 *     summary: Edit a product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - product
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: User ID
 *               product:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Product ID
 *                   name:
 *                     type: string
 *                     description: Product name
 *                   price:
 *                     type: number
 *                     description: Product price
 *                   stock_in_shelf:
 *                     type: number
 *                     description: Stock in shelf
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.post('/edit', validateUserPermission("edit_product"), edit);

/**
 * @swagger
 * /api/products/deletes:
 *   post:
 *     summary: Delete a product
 *     tags: [Products]
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
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *               product:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.post('/deletes', validateUserPermission("delete_product"), deletes);

/**
 * @swagger
 * /api/products/create:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
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
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *               product:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Product name
 *                   price:
 *                     type: number
 *                     description: Product price
 *                   stock_in_shelf:
 *                     type: number
 *                     description: Stock in shelf
 *     responses:
 *       200:
 *         description: Product created successfully
 *       500:
 *         description: Server error
 */
router.post('/create', validateUserPermission("add_product"), create);

/**
 * @swagger
 * /api/products/history:
 *   post:
 *     summary: Get product history
 *     tags: [Products]
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
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *     responses:
 *       200:
 *         description: Product history
 *       500:
 *         description: Server error
 */
router.post('/history', getHistory);

/**
 * @swagger
 * /api/products/get_supplier:
 *   post:
 *     summary: Get suppliers for products
 *     tags: [Products]
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
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *     responses:
 *       200:
 *         description: List of suppliers
 *       500:
 *         description: Server error
 */
router.post('/get_supplier', getSupplier);

/**
 * @swagger
 * /api/products/create_supplier:
 *   post:
 *     summary: Create a new supplier
 *     tags: [Products]
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
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *               supplier:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Supplier name
 *                   contact:
 *                     type: string
 *                     description: Supplier contact
 *     responses:
 *       200:
 *         description: Supplier created successfully
 *       500:
 *         description: Server error
 */
router.post('/create_supplier', validateUserPermission("create_supplier"), create_supplier);

/**
 * @swagger
 * /api/products/edit_supplier:
 *   post:
 *     summary: Edit a supplier
 *     tags: [Products]
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
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *               supplier:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Supplier ID
 *                   name:
 *                     type: string
 *                     description: Supplier name
 *                   contact:
 *                     type: string
 *                     description: Supplier contact
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Server error
 */
router.post('/edit_supplier', validateUserPermission("edit_supplier"), edit_supplier);
/**
 * @swagger
 * /api/products/delete_supplier:
 *   post:
 *     summary: Delete a supplier
 *     tags: [Products]
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
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *               supplier:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Supplier ID
 *     responses:
 *       200:
 *         description: Supplier deleted successfully
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Server error
 */
router.post('/delete_supplier', validateUserPermission("delete_supplier"), delete_supplier);

/**
 * @swagger
 * /api/products/get_history_supplier:
 *   post:
 *     summary: Get supplier history
 *     tags: [Products]
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
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *     responses:
 *       200:
 *         description: Supplier history
 *       500:
 *         description: Server error
 */
router.post('/get_history_supplier', getHistorySupplier);

module.exports = router;