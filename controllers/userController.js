const User = require('../modules/user');
const UserTemp = require('../modules/user_temp');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const logger = require('../config/logger');
const { sendCodeMail } = require('../utils/mailer');

const createUser = async (req, res) => {
    logger.info("Creating user with data:", req.body);
    const {
        name,
        email,
        password,
        role,
        id_owner,
        confirmOtp,
        code
    } = req.body.dataUser;

    // Check if the requester is the owner
    if (req.body.user._id !== req.body.user.id_owner) {
        logger.warn(`Unauthorized access attempt by user ${req.body.user._id}`);
        return res.status(403).json({ message: 'Không có quyền truy nhập' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // If user exists, update user information
            const hashedPassword = password ? await bcrypt.hash(password, 10) : existingUser.password;

            const updatedUser = await User.findByIdAndUpdate(
                existingUser._id, 
                { 
                    name, 
                    email, 
                    password: hashedPassword, 
                    role, 
                    id_owner 
                },
                { new: true }
            );

            logger.info(`User ${updatedUser._id} updated successfully`);
            return res.status(200).json({
                message: 'User updated successfully!',
                user: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    id_owner: updatedUser.id_owner,
                },
            });
        }

        // Create verification code and expiration time
        const codes = crypto.randomBytes(3).toString('hex'); // 6 characters
        const resetCodeExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        // If confirming with OTP
        if (confirmOtp) {
            let tempUser = await UserTemp.findOne({ email });
            if (!tempUser) {
                logger.warn(`OTP confirmation failed: No temporary user found for email ${email}`);
                return res.status(400).json({ message: 'Người dùng không tồn tại!' });
            }

            if (tempUser.code !== code || tempUser.resetCodeExpire < Date.now()) {
                logger.warn(`OTP confirmation failed: Invalid or expired code for email ${email}`);
                return res.status(400).json({ message: 'Mã xác nhận không hợp lệ hoặc đã hết hạn!' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                GoogleID: "",
                role,
                id_owner,
                resetCode: codes,
                resetCodeExpire,
            });

            await newUser.save();
            logger.info(`New user ${newUser._id} created successfully`);

            // Delete temporary user
            await UserTemp.deleteOne({ email });

            return res.status(200).json({ 
                message: 'Staff is created successfully', 
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    id_owner: newUser.id_owner,
                }
            });
        }

        // Handle temporary user creation
        const existingTempUser = await UserTemp.find({ email });
        if (existingTempUser.length > 0) {
            // Delete all temporary users with this email
            await UserTemp.deleteMany({ email });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create temporary user
        const newUserTemp = new UserTemp({
            name,
            email,
            password: hashedPassword,
            code: codes,
            resetCodeExpire,
        });

        await newUserTemp.save();
        logger.info(`Temporary user created for email ${email}`);

        // Send verification email
        await sendCodeMail(email, codes);

        return res.status(201).json({ message: 'Confirmation code sent' });
    } catch (error) {
        logger.error('Error creating user:', error);
        return res.status(500).json({
            message: 'Có lỗi xảy ra trong quá trình tạo người dùng.',
            error: error.message || error,
        });
    }
};

const sendAgain = async (req, res) => {
    logger.info("Resending verification code with data:", req.body);
    const {
        name,
        email,
        password,
        role,
        id_owner,
    } = req.body.dataUser;

    // Check if the requester is the owner
    if (req.body.user._id !== req.body.user.id_owner) {
        logger.warn(`Unauthorized access attempt by user ${req.body.user._id}`);
        return res.status(403).json({ message: 'Không có quyền truy nhập' });
    }

    try {
        // Create verification code and expiration time
        const codes = crypto.randomBytes(3).toString('hex'); // 6 characters
        const resetCodeExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Handle temporary user
        const existingTempUser = await UserTemp.find({ email });
        if (existingTempUser.length > 0) {
            // Delete all temporary users with this email
            await UserTemp.deleteMany({ email });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create temporary user
        const newUserTemp = new UserTemp({
            name,
            email,
            password: hashedPassword,
            code: codes,
            resetCodeExpire,
        });

        await newUserTemp.save();
        logger.info(`Temporary user created for email ${email}`);

        // Send verification email
        await sendCodeMail(email, codes);

        return res.status(201).json({ message: 'Confirmation code sent' });
    } catch (error) {
        logger.error('Error resending verification code:', error);
        return res.status(500).json({
            message: 'Có lỗi xảy ra trong quá trình gửi lại mã xác nhận.',
            error: error.message || error,
        });
    }
};

const showUser = async (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        logger.warn('Show user request missing userId parameter');
        return res.status(400).json({
            message: 'Thiếu userId trong yêu cầu!'
        });
    }

    try {
        // Find all users with matching id_owner
        const users = await User.find({
            id_owner: userId
        });

        // If no users found
        if (users.length === 0) {
            logger.info(`No users found with id_owner: ${userId}`);
            return res.status(404).json({
                message: 'Không tìm thấy người dùng nào với id_owner này!'
            });
        }

        logger.info(`Found ${users.length} users with id_owner: ${userId}`);
        // Return user list
        res.status(200).json(users);
    } catch (error) {
        logger.error('Error fetching users:', error);
        res.status(500).json({
            message: 'Có lỗi xảy ra. Vui lòng thử lại!'
        });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            logger.warn(`Delete user failed: User not found with ID ${userId}`);
            return res.status(404).json({
                message: 'User not found!'
            });
        }

        logger.info(`User ${userId} deleted successfully`);
        res.status(200).json({
            message: 'User deleted successfully!'
        });
    } catch (error) {
        logger.error('Error deleting user:', error);
        res.status(500).json({
            message: 'There was an error deleting the user. Please try again!'
        });
    }
};

const editUser = async (req, res) => {
    const userId = req.params.id;
    const {
        name,
        email,
        password,
        role
    } = req.body;

    logger.info(`Updating user ${userId} with data:`, { name, email, role });

    try {
        // Prepare update data
        const updateData = {
            name,
            email,
            role,
        };

        // Only update password if provided
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Update user data
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
            new: true
        });

        if (!updatedUser) {
            logger.warn(`Update user failed: User not found with ID ${userId}`);
            return res.status(404).json({
                message: 'User not found!'
            });
        }

        logger.info(`User ${userId} updated successfully`);
        res.status(200).json({
            message: 'User updated successfully!',
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                id_owner: updatedUser.id_owner,
            }
        });
    } catch (error) {
        logger.error('Error updating user:', error);
        res.status(500).json({
            message: 'There was an error updating the user. Please try again!'
        });
    }
};

module.exports = {
    createUser,
    showUser,
    deleteUser,
    editUser,
    sendAgain
};
