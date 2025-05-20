const express = require('express');
const roles = require('../controllers/role');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/create', auth.isAdmin, auth.authenticateToken, roles.create_role)
router.get('/show', roles.show_role)
router.delete('/delete', auth.isAdmin, auth.authenticateToken ,roles.delete_role)
router.post('/edit', auth.isAdmin, auth.authenticateToken, roles.edit_role)


