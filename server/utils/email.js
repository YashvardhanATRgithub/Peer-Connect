const nodemailer = require('nodemailer');

// Singleton transporter instance
let transporter = null;

const getTransporter = () => {
    if (transporter) return transporter;

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        throw new Error('SMTP configuration missing');
    }

    // Create reusable transporter object using the default SMTP transport
    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587, // Default to 587 if not set
        secure: false, // Must be false for port 587 (STARTTLS)
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
        // Connection pooling settings
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        // Timeouts to fail fast if connection hangs
        socketTimeout: 30000, // 30s
        connectionTimeout: 30000, // 30s
    });

    return transporter;
};

const sendMail = async ({ to, subject, html }) => {
    try {
        const transport = getTransporter();
        const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

        const info = await transport.sendMail({
            from,
            to,
            subject,
            html,
        });

        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        // If the transporter is broken, reset it so next try creates a new one
        transporter = null;
        throw error;
    }
};

const sendVerificationEmail = async ({ to, link }) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
            <h2 style="color: #0f172a; text-align: center;">Welcome to PeerConnect!</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                Thanks for signing up. Please verify your email address to get started and connect with peers on campus.
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${link}" target="_blank" rel="noopener noreferrer" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email Address</a>
            </div>
            <p style="color: #94a3b8; font-size: 14px; text-align: center;">
                If you did not create this account, you can safely ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="color: #cbd5e1; font-size: 12px; text-align: center;">
                PeerConnect Team
            </p>
        </div>
    `;

    await sendMail({
        to,
        subject: 'Verify your email - PeerConnect',
        html,
    });
};

module.exports = { sendVerificationEmail, sendMail };
