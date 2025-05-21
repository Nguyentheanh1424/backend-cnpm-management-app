require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const logger = require('../config/logger');
const { sendCodeMail } = require('../utils/mailer');
const User = require('../modules/user');
const UserTemp = require('../modules/user_temp');
const { sendSuccess, sendError, sendNotFound, sendBadRequest } = require('../utils/responseHandler');
const { asyncHandler } = require('../utils/errorHandler');
const { formatUser } = require('../utils/dataFormatter');

// Regular email login
const loginWithEmail = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return sendBadRequest(res, 'Invalid email or password');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return sendBadRequest(res, 'Invalid email or password');
    }

    return sendSuccess(res, { 
        message: 'Login successful', 
        user: formatUser(user, true)
    });
}, { errorMessage: 'Error logging in' });

// Google login
const loginWithGoogle = asyncHandler(async (req, res) => {
    const { GoogleID, family_name, given_name, email } = req.body;
    const name = `${family_name} ${given_name}`;

    let user = await User.findOne({ GoogleID }) || await User.findOne({ email });

    if (user) {
        if (!user.GoogleID) {
            user.GoogleID = GoogleID;
            await user.save();
        }
        return sendSuccess(res, { 
            message: 'Login successful', 
            user: formatUser(user, true)
        });
    } else {
        user = new User({ GoogleID, name, email });
        await user.save();

        return sendSuccess(res, { 
            message: 'New user created successfully',
            user: formatUser(user, true)
        }, 'New user created successfully', 201);
    }
}, { errorMessage: 'Error logging in' });

// User registration
const registerUser = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    const existed = await User.findOne({ email });
    if (existed) {
        return sendBadRequest(res, 'Email already exists');
    }

    // Generate a random password
    const generatedPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // Create temporary user with auto-generated password
    const newTempUser = new UserTemp({ 
        name, 
        email, 
        password: hashedPassword,
        originalPassword: generatedPassword // Store original password to send in email
    });

    const generatedCode = crypto.randomBytes(3).toString('hex');
    newTempUser.code = generatedCode;
    newTempUser.resetCodeExpire = Date.now() + 10 * 60 * 1000;

    try {
        // First try to send the email with the generated password
        await sendCodeMail(email, generatedCode, generatedPassword);

        // Only save the temp user if email was sent successfully
        await UserTemp.deleteMany({ email });
        await newTempUser.save();

        return sendSuccess(res, { 
            info: 'To complete registration, please verify your email with the verification code that has been sent.'
        }, 'Verification code has been sent to your email!', 201);
    } catch (emailError) {
        logger.error('Error sending verification email:', emailError);
        return sendError(res, 'Unable to send verification email. Please try again!', 500, emailError);
    }
}, { errorMessage: 'An error occurred. Please try again!', useLogger: true });

// Forgot password
const sendResetCode = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email does not exist!' });

        const resetCode = crypto.randomBytes(3).toString('hex');
        user.resetCode = resetCode;
        user.resetCodeExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendCodeMail(user.email, resetCode);

        res.status(200).json({ message: 'Verification code has been sent to your email!' });
    } catch (error) {
        logger.error('Error in forgot_password:', error);
        res.status(500).json({ message: 'An error occurred. Please try again!' });
    }
};

// Reset password after verification or complete registration
const resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;
    try {
        // First check if this is a registration verification
        const tempUser = await UserTemp.findOne({ email });
        if (tempUser) {
            // This is a registration verification
            if (tempUser.code !== code || tempUser.resetCodeExpire < Date.now()) {
                return res.status(400).json({ message: 'Invalid verification code or expired!' });
            }

            // Create a new user with the provided password or the stored password
            const hashedPassword = newPassword 
                ? await bcrypt.hash(newPassword, 10) 
                : tempUser.password;

            const newUser = new User({ 
                name: tempUser.name, 
                email: tempUser.email, 
                password: hashedPassword 
            });
            await newUser.save();
            await UserTemp.deleteMany({ email });

            return res.status(200).json({ 
                message: 'New user created successfully',
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    avatar: newUser.avatar
                }
            });
        }

        // If not a registration, then it's a password reset
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email does not exist!' });

        // Verify the reset code
        if (!user.resetCode || user.resetCode !== code || user.resetCodeExpire < Date.now()) {
            return res.status(400).json({ message: 'Invalid verification code or expired!' });
        }

        // Reset the code after successful verification
        user.resetCode = undefined;
        user.resetCodeExpire = undefined;

        // Update password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: 'Success' });
    } catch (error) {
        logger.error('Error in change_password2:', error);
        res.status(500).json({ message: 'An error occurred. Please try again!' });
    }
};

module.exports = {
    loginWithEmail,
    loginWithGoogle,
    registerUser,
    sendResetCode,
    resetPassword
};
