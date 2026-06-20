import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('Email credentials not configured. Emails will be logged to console.');
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
};

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  };

  if (!transporter) {
    console.log('📧 Email (dev mode):', mailOptions);
    return { success: true, dev: true };
  }

  await transporter.sendMail(mailOptions);
  return { success: true };
};

export const sendPasswordResetEmail = async (email, resetUrl) => {
  return sendEmail({
    to: email,
    subject: 'Password Reset - Campus Placement Portal',
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password (valid for 1 hour):</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
};

export const sendApplicationNotification = async (email, jobTitle, status) => {
  return sendEmail({
    to: email,
    subject: `Application Update - ${jobTitle}`,
    html: `
      <h2>Application Status Update</h2>
      <p>Your application for <strong>${jobTitle}</strong> has been updated to: <strong>${status}</strong></p>
    `,
  });
};

export const sendInterviewNotification = async (email, jobTitle, date) => {
  return sendEmail({
    to: email,
    subject: `Interview Scheduled - ${jobTitle}`,
    html: `
      <h2>Interview Scheduled</h2>
      <p>You have an interview for <strong>${jobTitle}</strong> on <strong>${new Date(date).toLocaleString()}</strong></p>
    `,
  });
};
