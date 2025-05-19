const express = require('express');
const products = require('../controllers/product'); // Import controller
const router = express.Router();

/**
 * @swagger
 * /api/products/show:
 *   post:
 *     summary: Get all products
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
router.post('/show', products.show);

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
router.get('/show/:id', products.show_detail);

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
router.post('/edit', products.edit);

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
router.post('/history', products.get_history);

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
router.post('/get_supplier', products.get_supplier);

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
router.post('/get_history_supplier', products.get_history_supplier);

module.exports = router;
