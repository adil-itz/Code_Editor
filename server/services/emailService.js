import nodemailer from 'nodemailer';

export async function sendOTPEmail(email, otp) {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (emailUser && emailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });

      await transporter.sendMail({
        from: `"DEVSPACE Security" <${emailUser}>`,
        to: email,
        subject: 'DEVSPACE — Password Reset OTP Code',
        html: `
          <div style="font-family: sans-serif; background-color: #0B0B0C; color: #F5F5F5; padding: 32px; border-radius: 12px; max-width: 480px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
            <h2 style="color: #FF5C5C; margin-top: 0;">DEVSPACE Security</h2>
            <p>You requested to reset your password. Use the 6-digit OTP code below to verify your request:</p>
            <div style="background-color: #171719; border: 1px solid #FF5C5C; border-radius: 8px; padding: 16px; text-align: center; font-family: monospace; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #FF5C5C; margin: 24px 0;">
              ${otp}
            </div>
            <p style="color: #A1A1AA; font-size: 13px;">This code is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
          </div>
        `
      });

      console.log(`[SMTP] Sent OTP email to ${email}`);
      return { sent: true };
    } catch (err) {
      console.error(`[SMTP ERROR] Failed to send email: ${err.message}`);
    }
  }

  console.log(`\n==============================================`);
  console.log(`[DEV MODE] OTP generated for ${email}: ${otp}`);
  console.log(`==============================================\n`);
  return { sent: false, devOtp: otp };
}
