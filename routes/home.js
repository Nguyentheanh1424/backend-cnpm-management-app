const express = require('express');
const home = require('../controllers/home.js');

const router = express.Router();

/**
 * @swagger
 * /api/home/total_revenue:
 *   post:
 *     summary: Get total revenue with comparison to previous day
 *     tags: [Home]
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
 *                 properties:
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *     responses:
 *       200:
 *         description: Total revenue data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenueToday:
 *                   type: string
 *                   description: Formatted total revenue for today
 *                 totalRevenueYesterday:
 *                   type: string
 *                   description: Formatted total revenue for yesterday
 *                 percentChange:
 *                   type: string
 *                   description: Percentage change in revenue
 *                 state:
 *                   type: string
 *                   description: State of change (up, down, or not change)
 *       500:
 *         description: Server error
 */
router.post('/total_revenue', home.totalRevenue);

/**
 * @swagger
 * /api/home/today_income:
 *   post:
 *     summary: Get today's income (profit) with comparison to previous day
 *     tags: [Home]
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
 *                 properties:
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *     responses:
 *       200:
 *         description: Today's income data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todayIncome:
 *                   type: string
 *                   description: Formatted income for today
 *                 yesterdayIncome:
 *                   type: string
 *                   description: Formatted income for yesterday
 *                 percentChange:
 *                   type: string
 *                   description: Percentage change in income
 *                 state:
 *                   type: string
 *                   description: State of change (up, down, or not change)
 *       500:
 *         description: Server error
 */
router.post('/today_income', home.todayIncome);

/**
 * @swagger
 * /api/home/new_customer:
 *   post:
 *     summary: Get new customer count with comparison to previous day
 *     tags: [Home]
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
 *                 properties:
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *     responses:
 *       200:
 *         description: New customer data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newCustomersToday:
 *                   type: number
 *                   description: Number of new customers today
 *                 newCustomersYesterday:
 *                   type: number
 *                   description: Number of new customers yesterday
 *                 percentChange:
 *                   type: string
 *                   description: Percentage change in new customers
 *                 state:
 *                   type: string
 *                   description: State of change (up, down, or not change)
 *       500:
 *         description: Server error
 */
router.post('/new_customer', home.newCustomer);

/**
 * @swagger
 * /api/home/total_pending:
 *   post:
 *     summary: Get total pending orders or tasks
 *     tags: [Home]
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
 *                 properties:
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *     responses:
 *       200:
 *         description: Total pending data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPending:
 *                   type: number
 *                   description: Number of pending items
 *       500:
 *         description: Server error
 */
router.post('/total_pending', home.totalPending);

/**
 * @swagger
 * /api/home/customer_report:
 *   post:
 *     summary: Generate customer report
 *     tags: [Home]
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
 *                 properties:
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *     responses:
 *       200:
 *         description: Customer report data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Server error
 */
router.post('/customer_report', home.generateCustomerReport);

/**
 * @swagger
 * /api/home/daily_sale:
 *   post:
 *     summary: Generate daily sales report
 *     tags: [Home]
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
 *                 properties:
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *     responses:
 *       200:
 *         description: Daily sales report data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */
router.post('/daily_sale', home.generateDailySale);

/**
 * @swagger
 * /api/home/daily_customer:
 *   post:
 *     summary: Generate daily customer report
 *     tags: [Home]
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
 *                 properties:
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *     responses:
 *       200:
 *         description: Daily customer report data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */
router.post('/daily_customer', home.generateDailyCustomer);

/**
 * @swagger
 * /api/home/top_product:
 *   post:
 *     summary: Generate top products report
 *     tags: [Home]
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
 *                 properties:
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *     responses:
 *       200:
 *         description: Top products report data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */
router.post('/top_product', home.generateTopProduct);

/**
 * @swagger
 * /api/home/recent_activity:
 *   post:
 *     summary: Get recent activity feed
 *     tags: [Home]
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
 *                 properties:
 *                   id_owner:
 *                     type: string
 *                     description: The user's owner ID
 *     responses:
 *       200:
 *         description: Recent activity data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */
router.post('/recent_activity', home.recentActivity);

module.exports = router;
