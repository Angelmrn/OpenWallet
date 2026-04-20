import { transporter } from "../config/nodemailer";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${CLIENT_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"OpenWallet" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Confirm your account at OpenWallet",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to OpenWallet </h2>
        <p>Confirm your account by clicking the button:</p>
        <a href="${verificationUrl}" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
         Confirm Account
        </a>
        <p style="color: #666; margin-top: 16px;">This link expires in 24 hours.</p>
        <p style="color: #666;">If you didn't create this account, ignore this email.</p>
      </div>
    `,
  });
};

export const sendInviteEmail = async (
  email: string,
  token: string,
  orgName: string,
) => {
  const inviteUrl = `${CLIENT_URL}/invite/${token}`;

  await transporter.sendMail({
    from: `"OpenWallet" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `You were invited to join ${orgName} in OpenWallet`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You have an invitation </h2>
        <p>You were invited to join <strong>${orgName}</strong> in OpenWallet.</p>
        <a href="${inviteUrl}" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Aceptar invitación
        </a>
        <p style="color: #666; margin-top: 16px;">This link expires in 48 hours.</p>
      </div>
    `,
  });
};
