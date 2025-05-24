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
    createSupplier,
    editSupplier,
    deleteSupplier,
    getProductsBySupplier,
    getProductsByProductName,
    updateDiscount
} = require('../controllers/product');
const { validateUserPermission } = require('../middlewares/auth');
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
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
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
 *               - product_edit
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
 *               product_edit:
 *                 type: object
 *                 required:
 *                   - _id
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Product ID
 *                   name:
 *                     type: string
 *                     description: Product name
 *                   price:
 *                     type: string
 *                     description: Product price
 *                   stock_in_shelf:
 *                     type: number
 *                     description: Stock in shelf
 *                   category:
 *                     type: string
 *                     description: Product category
 *                   sku:
 *                     type: string
 *                     description: Product SKU
 *                   supplier:
 *                     type: string
 *                     description: Supplier ID
 *                   image:
 *                     type: object
 *                     properties:
 *                       secure_url:
 *                         type: string
 *                       public_id:
 *                         type: string
 *               detail:
 *                 type: string
 *                 description: Details of the edit action
 *               check:
 *                 type: boolean
 *                 description: Flag to delete existing image
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
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
 *             required:
 *               - user
 *               - product_delete
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
 *               product_delete:
 *                 type: object
 *                 required:
 *                   - _id
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Product ID
 *               detail:
 *                 type: string
 *                 description: Details of the delete action
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
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
 *             required:
 *               - user
 *               - newPr
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
 *               newPr:
 *                 type: object
 *                 required:
 *                   - name
 *                   - price
 *                   - category
 *                   - sku
 *                   - supplier
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Product name
 *                   price:
 *                     type: string
 *                     description: Product price
 *                   stock_in_shelf:
 *                     type: number
 *                     description: Stock in shelf
 *                   category:
 *                     type: string
 *                     description: Product category
 *                   sku:
 *                     type: string
 *                     description: Product SKU
 *                   supplier:
 *                     type: string
 *                     description: Supplier ID
 *                   brand:
 *                     type: string
 *                     description: Product brand
 *                   description:
 *                     type: string
 *                     description: Product description
 *                   image:
 *                     type: object
 *                     properties:
 *                       secure_url:
 *                         type: string
 *                       public_id:
 *                         type: string
 *               detail:
 *                 type: string
 *                 description: Details of the create action
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *       500:
 *         description: Server error
 */
router.post('/create', validateUserPermission("add_product"), create);

/**
 * @swagger
 * /api/products/updateDiscount:
 *   post:
 *     summary: Update product discount
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - product_id
 *               - discount
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
 *                   id_owner:
 *                     type: string
 *                   role:
 *                     type: string
 *               product_id:
 *                 type: string
 *                 description: Product ID
 *               discount:
 *                 type: number
 *                 description: New discount value
 *               detail:
 *                 type: string
 *                 description: Change description
 *     responses:
 *       200:
 *         description: Discount updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.post('/updateDiscount', validateUserPermission("edit_product"), updateDiscount);

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
 *         description: Product history
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
 *                   product:
 *                     type: string
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
 *         description: List of suppliers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suppliers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Supplier'
 *                 message:
 *                   type: string
 *                   example: success
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
 *                 description: Supplier name
 *               email:
 *                 type: string
 *                 description: Supplier email
 *               phone:
 *                 type: string
 *                 description: Supplier phone
 *               address:
 *                 type: string
 *                 description: Supplier address
 *     responses:
 *       200:
 *         description: Supplier created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 new_supplier:
 *                   $ref: '#/components/schemas/Supplier'
 *                 message:
 *                   type: string
 *                   example: success
 *       500:
 *         description: Phone number already exists or server error
 */
router.post('/create_supplier', validateUserPermission("create_supplier"), createSupplier);

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
 *             required:
 *               - user
 *               - supplier_edit
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
 *               supplier_edit:
 *                 type: object
 *                 required:
 *                   - _id
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Supplier ID
 *                   name:
 *                     type: string
 *                     description: Supplier name
 *                   email:
 *                     type: string
 *                     description: Supplier email
 *                   phone:
 *                     type: string
 *                     description: Supplier phone
 *                   address:
 *                     type: string
 *                     description: Supplier address
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Phone number already registered or server error
 */
router.post('/edit_supplier', validateUserPermission("edit_supplier"), editSupplier);

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
 *             required:
 *               - user
 *               - supplier_delete
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
 *               supplier_delete:
 *                 type: object
 *                 required:
 *                   - _id
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Supplier ID
 *               detail:
 *                 type: string
 *                 description: Details of the delete action
 *     responses:
 *       200:
 *         description: Supplier deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Server error
 */
router.post('/delete_supplier', validateUserPermission("delete_supplier"), deleteSupplier);

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
 *         description: Supplier history
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
 *                   supplier:
 *                     type: string
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
router.post('/get_history_supplier', getHistorySupplier);

/**
 * @swagger
 * /api/products/getProductsBySupplier:
 *   get:
 *     summary: Get products by supplier
 *     tags: [Products]
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
 *         description: Server error
 */
router.get('/getProductsBySupplier', getProductsBySupplier);

/**
 * @swagger
 * /api/products/getProductsByProductName:
 *   get:
 *     summary: Search products by name
 *     tags: [Products]
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
 *         description: Server error
 */
router.get('/getProductsByProductName', getProductsByProductName);

module.exports = router;