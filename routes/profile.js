const express = require('express');
const profile = require('../controllers/profile');

const router = express.Router();

router.post('/get_profile', profile.getProfile)
router.post('/change_profile', profile.changeProfile)
router.post('/update_profile', profile.updateProfile)

module.exports = router;