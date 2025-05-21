const User = require('../modules/user');
const UserTemp = require('../modules/user_temp');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const logger = require('../config/logger');
const { sendCodeMail } = require('../utils/mailer');
const { sendSuccess, sendError, sendNotFound, sendBadRequest, sendUnauthorized } = require('../utils/responseHandler');
const { asyncHandler } = require('../utils/errorHandler');
const { formatUser } = require('../utils/dataFormatter');


// Create user
const createUser = asyncHandler(async (req, res) => {
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
        return sendUnauthorized(res, 'Không có quyền truy nhập');
    }

    // Check if user already exists
    const existingUser = await User.findOne({email});
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
        return sendSuccess(res, {
            message: 'User updated successfully!',
            user: formatUser(updatedUser)
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
            return sendBadRequest(res, 'Người dùng không tồn tại!');
        }

        if (tempUser.code !== code || tempUser.resetCodeExpire < Date.now()) {
            logger.warn(`OTP confirmation failed: Invalid or expired code for email ${email}`);
            return sendBadRequest(res, 'Mã xác nhận không hợp lệ hoặc đã hết hạn!');
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

        return sendSuccess(res, {
            message: 'Staff is created successfully',
            user: formatUser(newUser)
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

    return sendSuccess(res, { message: 'Confirmation code sent' }, null, 201);
}, { errorMessage: 'Có lỗi xảy ra trong quá trình tạo người dùng.' });

// Resend verification code
const sendAgain = asyncHandler(async (req, res) => {
    logger.info("Resending verification code with data:", req.body);
    const {
        name,
        email,
        password
    } = req.body.dataUser;

    // Check if the requester is the owner
    if (req.body.user._id.toString() !== req.body.user.id_owner.toString()) {
        logger.warn(`Unauthorized access attempt by user ${req.body.user._id}`);
        return sendUnauthorized(res, 'Không có quyền truy nhập');
    }

    // Create verification code and expiration time
    const codes = crypto.randomBytes(3).toString('hex'); // 6 characters
    const resetCodeExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Handle temporary user
    const existingTempUser = await UserTemp.findOne({ email });
    if (existingTempUser && existingTempUser.length > 0) {
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

    return sendSuccess(res, { message: 'Confirmation code sent' }, null, 201);
}, { errorMessage: 'Có lỗi xảy ra trong quá trình gửi lại mã xác nhận.' });

// Show user by id
const showUser = asyncHandler(async (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        logger.warn('Show user request missing userId parameter');
        return sendBadRequest(res, 'Thiếu userId trong yêu cầu!');
    }

    // Find all users with matching id_owner
    const users = await User.find({
        id_owner: userId
    });

    // If no users found
    if (users.length === 0) {
        logger.info(`No users found with id_owner: ${userId}`);
        return sendNotFound(res, 'Không tìm thấy người dùng nào với id_owner này!');
    }

    logger.info(`Found ${users.length} users with id_owner: ${userId}`);

    // Format users and return
    const formattedUsers = users.map(user => formatUser(user));
    return sendSuccess(res, formattedUsers);
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
        logger.warn(`Delete user failed: User not found with ID ${userId}`);
        return sendNotFound(res, 'User not found!');
    }

    logger.info(`User ${userId} deleted successfully`);
    return sendSuccess(res, null, 'User deleted successfully!');
}, { errorMessage: 'There was an error deleting the user. Please try again!' });

// Edit data user
const editUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const {
        name,
        email,
        password,
        role
    } = req.body;

    logger.info(`Updating user ${userId} with data:`, { name, email, role });

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
        return sendNotFound(res, 'User not found!');
    }

    logger.info(`User ${userId} updated successfully`);
    return sendSuccess(res, {
        message: 'User updated successfully!',
        user: formatUser(updatedUser)
    });
}, { errorMessage: 'There was an error updating the user. Please try again!' });

module.exports = {
    createUser,
    showUser,
    deleteUser,
    editUser,
    sendAgain
};
