const express = require('express');
const products = require('../controllers/product'); // Import controller
const router = express.Router();

router.post('/show', products.show);
router.get('/show/:id', products.show_detail);
router.post('/edit', products.edit);
router.post('/history', products.get_history);
router.post('/get_supplier', products.get_supplier);
router.post('get_history_supplier', products.get_history_supplier);
module.exports = router;
