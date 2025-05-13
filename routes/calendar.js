const express = require('express');
const calender = require('../controllers/calendarController');

const router = express.Router();

router.post('/create', calender.createEvent)
