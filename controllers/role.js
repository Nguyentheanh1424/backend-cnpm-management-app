const roles = require('../modules/role');
const users = require('../modules/user');

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

}

const edit_role = async (req, res) => {

}

const delete_role = async (req, res) => {

}

module.exports = {
    create_role,
    show_role,
    edit_role,
    delete_role,
}