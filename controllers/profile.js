const users = require('../modules/user');
const roles = require('../modules/role');
const logger = require('../config/logger');
const bcrypt = require("bcrypt");

const getProfile = async (req, res) => {
    const {user} = req.body;


    try{
        //tim user the email
        const user2 = await users.findOne({email: user.email}).populate('id_owner').lean();

        if (!user2) {
            return res.status(400).json({message: 'User not found with email'});
        }

        //neu thanh cong
        else {
            const role = await roles.findOne({id_owner: user2.id_owner._id, role: user2.role})
            logger.info(`User profile retrieved: ${user2.email}`);
            res.status(200).json({...user2, right: role});
        }
    }

    catch (error) {
        logger.error('Error retrieving user profile:', error);
        res.status(500).json({message: 'Error retrieving user profile'});
    }
}


const changeProfile = async (req, res) => {
    try{
        const {user} = req.body;

        const hashedPassword = await bcrypt.hash(user.password, 10);

        const update_user = await users.findOneAndUpdate(
            { id_owner: user._id },           // filter object
            { name: user.name, password: hashedPassword },
            { new: true }
        );

        if (!update_user) {
            return res.status(400).json({message: 'Change profile error'});
        }

        res.status(200).json({response: 'Success'});
    }
    catch (error) {
        logger.error('Error updating user profile:', error);
        res.status(500).json({response: 'Error updating profile'});
    }
}


const updateProfile = async (req, res) => {

    try{
        const {user, newPr} = req.body;
        logger.info(`Updating avatar for user: ${user.email}`);

        const update_user = await users.findByIdAndUpdate(
            {id_owner: user._id},
            {$set: {avatar: newPr.image.secure_url}},
            {new: true}
        )

        if (!update_user) {
            return res.status(400).json({message: 'Change avatar error'});
        }

        logger.info(`Avatar updated successfully for user: ${user.email}`);
        res.status(200).json({response: 'Success change avatar'});
    }
    catch (error) {
        logger.error('Error updating avatar:', error);
        res.status(500).json({response: 'Error updating avatar'});
    }
}


module.exports = {
    getProfile,
    changeProfile,
    updateProfile,
}
