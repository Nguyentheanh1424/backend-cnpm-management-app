const express = require('express');
const profile = require('../controllers/profile');

const router = express.Router();

router.post('/get_profile', profile.get_profile)
router.post('/change_profile', profile.change_profile)
router.post('/update_profile', profile.update_profile)

module.exports = router;