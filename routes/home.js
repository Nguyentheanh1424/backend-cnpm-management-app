const express = require('express');
const home = require('../controllers/home.js');

const router = express.Router();

// Dashboard metrics
router.post('/total_revenue', home.totalRevenue);
router.post('/today_income', home.todayIncome);
router.post('/new_customer', home.newCustomer);
router.post('/total_pending', home.totalPending);

// Reports and charts
router.post('/customer_report', home.generateCustomerReport);
router.post('/daily_sale', home.generateDailySale);
router.post('/daily_customer', home.generateDailyCustomer);
router.post('/top_product', home.generateTopProduct);

// Activity feed
router.post('/recent_activity', home.recentActivity);

module.exports = router;