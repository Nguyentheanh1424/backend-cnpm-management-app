const express = require('express');
const loggingOrder = require('../controllers/LoggingOrder');
const orderDetailHistory = require('../controllers/OrderDetailHistory');
const orderHistory = require('../controllers/OrderHistory');
const products = require('../controllers/product');
const suppliers = require('../controllers/supplier');
const { validateUserPermission } = require('../middlewares/auth');
const router = express.Router();

router.get('/loggingOrder/listOrder',loggingOrder.getLogging)
router.get('/orderDetail/listOrder', orderDetailHistory.listOrderDetail);
router.post('/orderDetail/updateDetail', validateUserPermission("edit_order"), orderDetailHistory.updateDetail);
router.post('/orderHistory/save', validateUserPermission("create_order"), orderHistory.saveOrderHistory);
router.get('/orderHistory/getOrder', orderHistory.getOrder);
router.put('/orderHistory/updateOrderHistory', validateUserPermission("edit_order"), orderHistory.updateOrderHistory);
router.get('/orderHistory/supplierName',orderHistory.getSupplierByOrderId);
router.get('/orderHistory/lastProductTop100',orderHistory.getProductTop100);
router.get('/product/exhibitPro',products.getProductsBySupplier)
router.get('/product/exhibitProN',products.getProductsByProductName)
router.get('/supplier/search', suppliers.getSupplierSuggestion);

module.exports = router;