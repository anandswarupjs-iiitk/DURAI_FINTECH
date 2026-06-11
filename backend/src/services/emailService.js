const { sendEmail } = require('../config/mailer');

const sendPasswordResetEmail = async (email, name, resetUrl) => {
  await sendEmail({
    to: email,
    subject: 'FraudGuard — Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0f172a; color: #e2e8f0; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #06b6d4; font-size: 24px; margin: 0;">🛡️ FraudGuard</h1>
          <p style="color: #94a3b8; margin: 5px 0;">AI Fraud Detection Platform</p>
        </div>
        <h2 style="color: #f1f5f9;">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. Click the button below to create a new one. This link expires in <strong>15 minutes</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #06b6d4; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #64748b; font-size: 13px;">If you didn't request this, ignore this email. Your password won't change.</p>
        <hr style="border-color: #1e293b; margin: 20px 0;"/>
        <p style="color: #475569; font-size: 12px; text-align: center;">FraudGuard Security Team</p>
      </div>
    `,
  });
};

const sendPasswordChangedEmail = async (email, name) => {
  await sendEmail({
    to: email,
    subject: 'FraudGuard — Password Changed Successfully',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0f172a; color: #e2e8f0; border-radius: 12px;">
        <h1 style="color: #06b6d4;">🛡️ FraudGuard</h1>
        <h2 style="color: #10b981;">✅ Password Changed</h2>
        <p>Hi ${name},</p>
        <p>Your password was successfully changed. If this wasn't you, please contact support immediately and reset your password.</p>
        <p style="color: #64748b; font-size: 13px;">Time: ${new Date().toUTCString()}</p>
      </div>
    `,
  });
};

module.exports = { sendPasswordResetEmail, sendPasswordChangedEmail };