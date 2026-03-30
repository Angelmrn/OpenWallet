import { transporter } from "../config/nodemailer";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${CLIENT_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"RewardFlow" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Confirma tu cuenta en RewardFlow",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Bienvenido a RewardFlow 🎉</h2>
        <p>Confirma tu cuenta haciendo click en el botón:</p>
        <a href="${verificationUrl}" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Confirmar cuenta
        </a>
        <p style="color: #666; margin-top: 16px;">Este link expira en 24 horas.</p>
        <p style="color: #666;">Si no creaste esta cuenta, ignora este correo.</p>
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
    from: `"RewardFlow" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Te invitaron a unirte a ${orgName} en RewardFlow`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Tienes una invitación 🎁</h2>
        <p>Te invitaron a unirte a <strong>${orgName}</strong> en RewardFlow.</p>
        <a href="${inviteUrl}" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Aceptar invitación
        </a>
        <p style="color: #666; margin-top: 16px;">Este link expira en 48 horas.</p>
      </div>
    `,
  });
};
