import { getUserByEmail } from '../features/user/services/user.service';
import { transporter } from '../configs/email.config';
import { BACKEND_BASE_URL, EMAIL_FROM } from '../configs/env.cofig';
import crypto from 'crypto';

interface EmailData {
  subject?: string;
  html?: string;
}

export const sendEmailVerification = async (to: string): Promise<{ verificationToken: string, verificationTokenExpires: number }> => {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  const verificationTokenExpires = Date.now() + 3600000; // 1 hour
  const verificationUrl = `${BACKEND_BASE_URL}/auth/verify-email/${verificationToken}`;

  const mailOptions = {
    from: EMAIL_FROM,
    to: to,
    subject: 'Email Verification',
    html: `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Verify Your Email</title>
              </head>
              <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="padding: 40px 0;">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); overflow: hidden;">
                        <tr>
                          <td align="center" style="background-color: #007bff; padding: 20px 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Confirm Your Email Address</h1>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                            <p>Hi there,</p>
                            <p>Thank you for signing up! To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
                            <p style="text-align: center; margin: 30px 0;">
                              <a href="${verificationUrl}" style="display: inline-block; padding: 14px 24px; font-size: 16px; color: #ffffff; background-color: #28a745; text-decoration: none; border-radius: 5px;">Verify Email</a>
                            </p>
                            <p>This link will expire in <strong>1 hour</strong>.</p>
                            <p>If you did not request this verification, please disregard this email. Your account will remain inactive until verified.</p>
                            <p>Need help? Contact our support team at <a href="mailto:support@example.com" style="color: #007bff;">support@example.com</a>.</p>
                            <p>Best regards,<br />The Example Team</p>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="background-color: #f0f0f0; padding: 20px; font-size: 12px; color: #777;">
                            <p style="margin: 0;">© 2025 Example Inc. All rights reserved.</p>
                            <p style="margin: 0;">1234 Example St, City, Country</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
          `,
  };

  await transporter.sendMail(mailOptions);
  return { verificationToken, verificationTokenExpires };
};

export const sendEmail = async (to: string, data: EmailData, cc?: string): Promise<void> => {

  const mailOptions = {
    from: EMAIL_FROM,
    to: to,
    cc: cc,
    subject: data.subject || 'No Subject',
    html: data.html || '<p>No content provided</p>',
  };

  await transporter.sendMail(mailOptions);
};

export const changeEmail = async (oldEmail: string, newEmail: string): Promise<void> => {
  // Check if email is already in use
  const existingUser = await getUserByEmail(newEmail);
  if (existingUser?.email === newEmail) return;

  const user = await getUserByEmail(oldEmail);
  if (!user) return;

  // Generate a new verification token and send verification email to the new email address
  const { verificationToken, verificationTokenExpires } = await sendEmailVerification(newEmail);
  user.verificationToken = verificationToken;
  user.verificationTokenExpires = verificationTokenExpires as any;
  await user.save();
};