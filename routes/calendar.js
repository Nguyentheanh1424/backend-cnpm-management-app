const express = require('express');
const calender = require('../controllers/calendar');

const router = express.Router();

/**
 * @swagger
 * /api/calendar/create:
 *   post:
 *     summary: Create a new calendar event
 *     tags: [Calendar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - task
 *               - employee
 *               - start_time
 *               - end_time
 *               - id_owner
 *             properties:
 *               task:
 *                 type: string
 *                 description: The task or event title
 *               employee:
 *                 type: string
 *                 description: The employee assigned to the event
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 description: Start time of the event
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 description: End time of the event
 *               id_owner:
 *                 type: string
 *                 description: ID of the event owner
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 event:
 *                   type: object
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post('/create', calender.createEvent);

/**
 * @swagger
 * /api/calendar/update/{id}:
 *   put:
 *     summary: Update an existing calendar event
 *     tags: [Calendar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - task
 *               - employee
 *               - start_time
 *               - end_time
 *               - id_owner
 *             properties:
 *               task:
 *                 type: string
 *                 description: The task or event title
 *               employee:
 *                 type: string
 *                 description: The employee assigned to the event
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 description: Start time of the event
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 description: End time of the event
 *               id_owner:
 *                 type: string
 *                 description: ID of the event owner
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.put('/update/:id', calender.updateEvent);

/**
 * @swagger
 * /api/calendar/delete/{id}:
 *   delete:
 *     summary: Delete a calendar event
 *     tags: [Calendar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *       - in: query
 *         name: id_owner
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event owner
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedEvent:
 *                   type: object
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.delete('/delete/:id', calender.deleteEvent);

/**
 * @swagger
 * /api/calendar/show:
 *   get:
 *     summary: Get all calendar events for a user
 *     tags: [Calendar]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose events to retrieve
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   task:
 *                     type: string
 *                   employee:
 *                     type: string
 *                   start_time:
 *                     type: string
 *                     format: date-time
 *                   end_time:
 *                     type: string
 *                     format: date-time
 *                   id_owner:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */
router.get('/show', calender.getEvent)

module.exports = router;
