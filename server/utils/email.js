const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async ({ to, subject, html }) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.warn('RESEND_API_KEY is missing. Email not sent.');
            return;
        }

        const data = await resend.emails.send({
            from: 'PeerConnect <notifications@peer-connect.space>',
            to,
            subject,
            html,
        });

        console.log('Email sent successfully:', data);
        return data;
    } catch (error) {
        console.error('Error sending email:', error);
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

const sendPasswordResetEmail = async ({ to, link }) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
            <h2 style="color: #0f172a; text-align: center;">Reset Your Password</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                You requested a password reset for your PeerConnect account. Click the button below to set a new password.
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${link}" target="_blank" rel="noopener noreferrer" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            <p style="color: #94a3b8; font-size: 14px; text-align: center;">
                If you didn't ask to reset your password, you can ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="color: #cbd5e1; font-size: 12px; text-align: center;">
                PeerConnect Team
            </p>
        </div>
    `;

    await sendMail({
        to,
        subject: 'Reset your password - PeerConnect',
        html,
    });
};

module.exports = { sendVerificationEmail, sendMail, sendPasswordResetEmail };
