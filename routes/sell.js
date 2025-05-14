const express = require('express');
const sell = require('../controllers/sell'); // Import controller
const router = express.Router();

router.post('/find_code', sell.find_code);
router.post('/delete_customer', sell.delete_customer);
router.post('/history', sell.history);
router.post('/get_history', sell.get_history);
router.post('/get_customer', sell.get_customer);
router.post('/get_history_customer', sell.get_history_customer);

module.exports =router;
