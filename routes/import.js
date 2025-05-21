const express = require('express');
const loggingOrder = require('../controllers/LoggingOrder');
const orderDetailHistory = require('../controllers/OrderDetailHistory');
const orderHistory = require('../controllers/OrderHistory');
const products = require('../controllers/product');
const suppliers = require('../controllers/supplier');
const router = express.Router();

router.get('/loggingOrder/listOrder',loggingOrder.getLogging)
router.get('/orderDetail/listOrder', orderDetailHistory.listOrderDetail);
router.get('/orderHistory/getOrder', orderHistory.getOrder);
router.get('/orderHistory/supplierName',orderHistory.getSupplierByOrderId);
router.get('/orderHistory/lastProductTop100',orderHistory.getProductTop100);
router.get('/product/exhibitPro',products.getProductsBySupplier)
router.get('/product/exhibitProN',products.getProductsByProductName)
router.get('/supplier/search', suppliers.getSupplierSuggestion);

module.exports = router;