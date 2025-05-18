const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendCodeMail = async (to, code) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: 'Mã xác nhận',
            text: `Mã xác nhận của bạn là: ${code}`,
        };
        await transporter.sendMail(mailOptions);
        logger.info(`Verification code sent to ${to}`);
    } catch (error) {
        logger.error('Error sending email:', error);
        throw new Error('Failed to send verification email');
    }
};
module.exports = { sendCodeMail };
