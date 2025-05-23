const express = require('express');
const {
    getProfile,
    changeProfile,
    updateProfile,
} = require('../controllers/profile');

const router = express.Router();

router.post('/get_profile', getProfile)

router.post('/change_profile', changeProfile)

router.post('/update_profile', updateProfile)

module.exports = router;