const express = require('express');
const calender = require('../controllers/calendarController');

const router = express.Router();

router.post('/create', calender.createEvent);
router.put('/update/:id', calender.updateEvent);
router.delete('/delete/:id', calender.deleteEvent);
router.get('/show', calender.getEvent)

module.exports = router;