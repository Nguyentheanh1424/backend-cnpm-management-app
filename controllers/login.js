require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const logger = require('../config/logger');
const { sendCodeMail } = require('../utils/mailer');
const User = require('../modules/user');
const UserTemp = require('../modules/user_temp');

// Đăng nhập tài khoản bình thường
const loginWithEmail = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ 
            message: 'Login successful', 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (error) {
        logger.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error });
    }
};

// Đăng nhập Google
const loginWithGoogle = async (req, res) => {
    const { GoogleID, family_name, given_name, email } = req.body;
    const name = `${family_name} ${given_name}`;
    try {
        let user = await User.findOne({ GoogleID }) || await User.findOne({ email });

        if (user) {
            if (!user.GoogleID) {
                user.GoogleID = GoogleID;
                await user.save();
            }
        } else {
            user = new User({ GoogleID, name, email });
            await user.save();

            return res.status(201).json({ 
                message: 'Tạo người dùng mới thành công',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar
                }
            });
        }

        res.status(200).json({ 
            message: 'Login successful', 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (error) {
        logger.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error });
    }
};

// Đăng ký tài khoản
const registerUser = async (req, res) => {
    const { name, email } = req.body;

    try {
        const existed = await User.findOne({ email });
        if (existed) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
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

            res.status(201).json({ 
                message: 'Mã xác nhận đã được gửi đến email!',
                info: 'Để hoàn tất đăng ký, vui lòng xác thực email của bạn bằng mã xác thực đã được gửi.'
            });
        } catch (emailError) {
            logger.error('Error sending verification email:', emailError);
            res.status(500).json({ message: 'Không thể gửi email xác nhận. Vui lòng thử lại!' });
        }
    } catch (error) {
        logger.error('Error in sign_up:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại!' });
    }
};

// Quên mật khẩu
const sendResetCode = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email không tồn tại!' });

        const resetCode = crypto.randomBytes(3).toString('hex');
        user.resetCode = resetCode;
        user.resetCodeExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendCodeMail(user.email, resetCode);

        res.status(200).json({ message: 'Mã xác nhận đã được gửi đến email của bạn!' });
    } catch (error) {
        logger.error('Error in forgot_password:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại!' });
    }
};

// Đổi mật khẩu sau khi xác thực hoặc xác thực đăng ký
const resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;
    try {
        // First check if this is a registration verification
        const tempUser = await UserTemp.findOne({ email });
        if (tempUser) {
            // This is a registration verification
            if (tempUser.code !== code || tempUser.resetCodeExpire < Date.now()) {
                return res.status(400).json({ message: 'Mã xác thực không hợp lệ hoặc đã hết hạn!' });
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
                message: 'Tạo người dùng mới thành công',
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
        if (!user) return res.status(404).json({ message: 'Email không tồn tại!' });

        // Verify the reset code
        if (!user.resetCode || user.resetCode !== code || user.resetCodeExpire < Date.now()) {
            return res.status(400).json({ message: 'Mã xác thực không hợp lệ hoặc đã hết hạn!' });
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
        res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại!' });
    }
};

module.exports = {
    loginWithEmail,
    loginWithGoogle,
    registerUser,
    sendResetCode,
    resetPassword
};
