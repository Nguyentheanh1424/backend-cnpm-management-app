const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendCodeMail = async (to, code, password = null) => {
    try {
        let emailText = `Mã xác thực của bạn là: ${code}.\nMã xác thực sẽ hết hạn trong vòng 10 phút.`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: 'Thông báo xác thực từ Ứng dụng Quản lý Cửa Hàng',
            text: emailText,
        };
        await transporter.sendMail(mailOptions);
        logger.info(`Verification code sent to ${to}`);
    } catch (error) {
        logger.error('Error sending email:', error);
        throw new Error('Failed to send verification email');
    }
};
module.exports = { sendCodeMail };
