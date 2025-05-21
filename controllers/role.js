const roles = require('../modules/role');
const users = require('../modules/user');
const {error} = require("winston");

const create_role = async (req, res) => {
    try{
        console.log(req.body);
        const {newRoleData, user} = req.body;
        const {role, description, permissions, id_owner} = newRoleData;

        const existingRole = await roles.findOne({role, id_owner});
        if (existingRole) {
            return res.status(400).json({message: 'Role already exists'});
        }

        const newRole = new roles({
            role,
            description,
            permissions,
            crated_at: new Date(),
            id_owner,
        });

        await newRole.save();
        console.log(newRole);
        res.status(200).json({message: 'Successfully created role', role: newRole});
    }
    catch(err){
        console.log('Error creating role', err);
        res.status(500).json({message: 'Error creating role'});
    }
};

const show_role = async (req, res) => {
    try {
        const excludedId = 'Admin';
        const userId = req.query.userId;
        const roles_data = await roles.find({
            id_owner: userId,
            role: { $ne: excludedId }
        });
        res.json(roles_data);
    } catch (error) {
        console.log('Error showing role', error);
        res.status(500).json({ message: 'Error showing role', error });
    }
}

const edit_role = async (req, res) => {
    try{
        const rolesWithPermissions = req.body.permissions;
        for (const role of rolesWithPermissions) {
            const updateRole = await roles.findByIdAndUpdate(
                role.id,
                {permissions: role.permissions},
                {new: true}
            );

            if (role.newRoleName && role.newRoleName !== updatedRole.role) {
                await Users.updateMany(
                    {role: updatedRole.role},
                    {role: role.newRoleName}
                );
            }
        }
        res.status(200).json({message: 'Successfully edited role'});
    }
    catch(err){
        console.log('Error editing role', err);
        res.status(500).json({ message: 'Error editing role', error });
    }
}

const delete_role = async (req, res) => {
    try{
        const {user, role_id} = req.body;

        const roleMustDelete = roles.findById(role_id);
        if (!roleMustDelete) {
            return res.status(404).json({message: 'Role not found'});
        }

        await roles.findByIdAndDelete(role_id);

        await users.updateMany(
            {role: roleMustDelete.role},
            {role: ''}
        );

        res.status(200).json({message: 'Successfully deleted role', role: roleMustDelete});
    }
    catch (err){
        console.log('Error deleting role', err);
        res.status(500).json({message: 'Error deleting role', error});
    }
}

module.exports = {
    create_role,
    show_role,
    edit_role,
    delete_role,
}