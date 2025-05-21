const express = require('express');
const router = express.Router();
const {
    createRole,
    showRole,
    deleteRole,
    editRole
} = require('../controllers/role');

// Create a new role
router.post('/create', createRole);

// Get all roles for a user
router.get('/show', showRole);

// Delete a role
router.delete('/delete', deleteRole);

// Edit role permissions
router.put('/edit', editRole);

module.exports = router;
