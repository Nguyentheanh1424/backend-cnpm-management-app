const users = require('../modules/user');
const roles = require('../modules/role');

const get_profile = async (req, res) => {
    const {user} = req.body;


    try{
        //tim user theo email
        const user2 = await users.findOne({email: user.email}).populate('id_owner').lean();

        if (!user2) {
            return res.status(400).json({message: 'User not found with email'});
        }

        //neu thanh cong
        else {
            const role = await roles.findOne({id_owner: user2.id_owner._id, role: user2.role})
            console.log({...user2, right: role});
            res.status(200).json({...user2, right: role});
        }
    }

    catch (error) {
        console.error('Login error', error); //xuat loi vao console
        res.status(500).json({message: 'Error logging error'});
    }
}


const change_profile = async (req, res) => {
    try{
        const {user} = req.body;
        const update_user = await users.findByIdAndUpdate(
            {id_owner: user._id},
            {$set: {name: user.name, password: user.password}},
            {new: true}
        )

        if (!update_user) {
            return res.status(400).json({message: 'Change profile error'});
        }

        res.status(200).json({response: 'Success'});
    }
    catch (error) {
        console.error('Change profile error', error);
        res.status(500).json({response: 'Error change profile'});
    }
}


const update_profile = async (req, res) => {

    try{
        const {user, newPr} = req.body;
        console.log(user, newPr)

        const update_user = await users.findByIdAndUpdate(
            {id_owner: user._id},
            {$set: {avatar: newPr.image.secure_url}},
            {new: true}
        )

        if (!update_user) {
            return res.status(400).json({message: 'Change avatar error'});
        }

        console.log(update_user);
        res.status(200).json({response: 'Success change avatar'});
    }
    catch (error) {
        console.error('Change avatar error', error);
        res.status(500).json({response: 'Error change avatar'});
    }
}


module.exports = {
    get_profile,
    change_profile,
    update_profile,
}