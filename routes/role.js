const express = require('express');
const router = express.Router();
const {
    createRole,
    showRole,
    deleteRole,
    editRole
} = require('../controllers/role');

/**
 * @swagger
 * /api/role/create:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newRoleData
 *               - user
 *             properties:
 *               newRoleData:
 *                 type: object
 *                 required:
 *                   - role
 *                   - description
 *                   - permissions
 *                   - id_owner
 *                 properties:
 *                   role:
 *                     type: string
 *                     description: Role name
 *                   description:
 *                     type: string
 *                     description: Role description
 *                   permissions:
 *                     type: object
 *                     description: Object containing permission settings
 *                   id_owner:
 *                     type: string
 *                     description: Owner ID
 *               user:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: User ID
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role created successfully
 *                 role:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     role:
 *                       type: string
 *                     description:
 *                       type: string
 *                     permissions:
 *                       type: object
 *                     createAt:
 *                       type: string
 *                       format: date-time
 *                     id_owner:
 *                       type: string
 *       400:
 *         description: Role already exists
 *       500:
 *         description: Server error
 */
router.post('/create', createRole);

/**
 * @swagger
 * /api/role/show:
 *   get:
 *     summary: Get all roles for a user (excluding Admin)
 *     tags: [Roles]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner ID to fetch roles for
 *     responses:
 *       200:
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   role:
 *                     type: string
 *                   description:
 *                     type: string
 *                   permissions:
 *                     type: object
 *                   createAt:
 *                     type: string
 *                     format: date-time
 *                   id_owner:
 *                     type: string
 *       500:
 *         description: Error fetching roles
 */
router.get('/show', showRole);

/**
 * @swagger
 * /api/role/delete:
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role_id
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: User ID
 *               role_id:
 *                 type: string
 *                 description: ID of the role to delete
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role deleted successfully
 *       404:
 *         description: Role not found
 *       500:
 *         description: Error deleting role
 */
router.delete('/delete', deleteRole);

/**
 * @swagger
 * /api/role/edit:
 *   put:
 *     summary: Edit role permissions and optionally rename roles
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rolesWithPermissions
 *             properties:
 *               rolesWithPermissions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - _id
 *                     - permissions
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Role ID
 *                     permissions:
 *                       type: object
 *                       description: Updated permissions
 *                     newRoleName:
 *                       type: string
 *                       description: New name for the role (optional)
 *     responses:
 *       200:
 *         description: Roles updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Update successful!
 *       500:
 *         description: Error updating permissions
 */
router.put('/edit', editRole);

module.exports = router;
