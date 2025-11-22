const nodemailer = require('nodemailer');

const createTransporter = () => {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        throw new Error('SMTP configuration missing');
    }
    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });
};

const sendMail = async ({ to, subject, html }) => {
    const transporter = createTransporter();
    const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
    await transporter.sendMail({
        from,
        to,
        subject,
        html,
    });
};

const sendVerificationEmail = async ({ to, link }) => {
    const html = `
        <p>Welcome to PeerConnect!</p>
        <p>Please verify your email by clicking the link below:</p>
        <p><a href="${link}" target="_blank" rel="noopener noreferrer">Verify Email</a></p>
        <p>If you did not create this account, you can ignore this email.</p>
    `;
    await sendMail({
        to,
        subject: 'Verify your email - PeerConnect',
        html,
    });
};

module.exports = { sendVerificationEmail };
