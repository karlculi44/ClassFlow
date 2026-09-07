import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  return transporter;
};

export const sendPasswordResetEmail = async ({ email, resetUrl }) => {
  await getTransporter().sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Reset your ClassFlow password",
    text: `Reset your ClassFlow password using this link: ${resetUrl}\n\nThis link expires in 30 minutes and can only be used once.`,
    html: `<p>Reset your ClassFlow password using the link below.</p><p><a href="${resetUrl}">Reset password</a></p><p>This link expires in 30 minutes and can only be used once.</p>`,
  });
};

export const sendGoogleOnlyPasswordRecoveryEmail = async ({ email }) => {
  await getTransporter().sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Your ClassFlow sign-in method",
    text: "This ClassFlow account uses Google Sign-In and does not have a password to reset. Please continue signing in with Google.",
    html: "<p>This ClassFlow account uses Google Sign-In and does not have a password to reset.</p><p>Please continue signing in with Google.</p>",
  });
};
