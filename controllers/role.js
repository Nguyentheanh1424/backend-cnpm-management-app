const Roles = require('../modules/role'); 
const Users = require('../modules/user');
const logger = require('../config/logger');

const createRole = async (req, res) => {
    logger.info(`Creating new role: ${JSON.stringify(req.body)}`);
    const {newRoleData, user} = req.body;
    const { role, description, permissions, id_owner } = newRoleData; 
    try {
        const existingRole = await Roles.findOne({ role, id_owner });
        if (existingRole) {
            logger.warn(`Role creation failed: Role '${role}' already exists for owner ${id_owner}`);
            return res.status(400).json({ message: 'Role already exists' });
        }
        const newRole = new Roles({
            role,
            description,
            permissions,
            createAt: new Date(),
            id_owner,
        });
        await newRole.save();
        logger.info(`New role created: ${JSON.stringify(newRole)}`);
        res.status(201).json({ message: 'Role created successfully', role: newRole });
    } catch (error) {
        logger.error('Error creating role:', error); 
        res.status(500).json({ message: 'Server error', error: error.message }); 
    }
};

const showRole = async (req, res) => {
    try {
        const excludedId = 'Admin';
        const userId = req.query.userId;
        logger.info(`Fetching roles for user ID: ${userId}`);
        const roles_data = await Roles.find({ 
            id_owner: userId,
            role: { $ne: excludedId } 
        });
        res.json(roles_data);
    } catch (error) {
        logger.error('Failed to fetch role data', error); 
        res.status(500).json({ message: 'Error fetching roles', error: error.message });
    }
};

const deleteRole = async (req, res) => {
    const { user, role_id } = req.body; 
    try {
        logger.info(`Attempting to delete role with ID: ${role_id}`);
        const roleToDelete = await Roles.findById(role_id);
        if (!roleToDelete) {
            logger.warn(`Role deletion failed: Role with ID ${role_id} not found`);
            return res.status(404).json({ message: 'Role not found' });
        }
        await Roles.findByIdAndDelete(role_id); 
        await Users.updateMany(
            { role: roleToDelete.role }, 
            { role: '' } 
        );
        logger.info(`Role '${roleToDelete.role}' deleted successfully`);
        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        logger.error('Failed to delete role', error); 
        res.status(500).json({ message: 'Error deleting role', error: error.message });
    }
};

const editRole = async (req, res) => {
    try {
        const rolesWithPermissions = req.body.rolesWithPermissions;
        logger.info(`Updating permissions for ${rolesWithPermissions.length} roles`);
        for (const role of rolesWithPermissions) {
            const updatedRole = await Roles.findByIdAndUpdate(
                role._id,
                { permissions: role.permissions },
                { new: true } 
            );
            if (role.newRoleName && role.newRoleName !== updatedRole.role) {
                logger.info(`Renaming role from '${updatedRole.role}' to '${role.newRoleName}'`);
                await Users.updateMany(
                    { role: updatedRole.role }, 
                    { role: role.newRoleName } 
                );
            }
        }
        res.status(200).json({ message: 'Update successful!' });
    } catch (error) {
        logger.error("Error updating permissions:", error);
        res.status(500).json({ message: 'Error updating permissions.' });
    }
};

module.exports = {
    createRole,
    showRole,
    deleteRole,
    editRole
};
