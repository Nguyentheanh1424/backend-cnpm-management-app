require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({ 
            message: 'Login successful', 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            },
            token 
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

            // Generate JWT token for new user
            const token = jwt.sign(
                { userId: user._id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.status(201).json({ 
                message: 'Tạo người dùng mới thành công',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar
                },
                token 
            });
        }

        // Generate JWT token for existing user
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({ 
            message: 'Login successful', 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            },
            token 
        });
    } catch (error) {
        logger.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error });
    }
};

// Đăng ký tài khoản
const registerUser = async (req, res) => {
    const { name, email, password, confirm, code } = req.body;

    try {
        if (confirm) {
            const tempUser = await UserTemp.findOne({ email });
            if (!tempUser || tempUser.code !== code || tempUser.resetCodeExpire < Date.now()) {
                return res.status(400).json({ message: 'Mã xác nhận không hợp lệ hoặc đã hết hạn!' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ name, email, password: hashedPassword });
            await newUser.save();
            await UserTemp.deleteMany({ email });

            // Generate JWT token for new user
            const token = jwt.sign(
                { userId: newUser._id, email: newUser.email, role: newUser.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.status(200).json({ 
                message: 'Tạo người dùng mới thành công',
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    avatar: newUser.avatar
                },
                token 
            });
        }

        const existed = await User.findOne({ email });
        if (existed) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        await UserTemp.deleteMany({ email });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newTempUser = new UserTemp({ name, email, password: hashedPassword });

        const generatedCode = crypto.randomBytes(3).toString('hex');
        newTempUser.code = generatedCode;
        newTempUser.resetCodeExpire = Date.now() + 10 * 60 * 1000;
        await newTempUser.save();

        await sendCodeMail(newTempUser.email, generatedCode);

        res.status(201).json({ message: 'Mã xác nhận đã được gửi đến email!' });
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

// Xác thực mã đặt lại mật khẩu
const verifyResetCode = async (req, res) => {
    const { email, ma } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.resetCode !== ma || user.resetCodeExpire < Date.now()) {
            return res.status(400).json({ message: 'Mã xác nhận không hợp lệ hoặc đã hết hạn!' });
        }

        res.status(200).json({ message: 'Success' });
    } catch (error) {
        logger.error('Error in change_password:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại!' });
    }
};

// Đổi mật khẩu sau khi xác thực
const resetPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email không tồn tại!' });

        user.password = await bcrypt.hash(password, 10);
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
    verifyResetCode,
    resetPassword
};