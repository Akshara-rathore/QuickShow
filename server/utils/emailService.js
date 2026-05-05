import nodemailer from 'nodemailer';

// Create a generic test account using Ethereal if real credentials aren't provided
const createTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback to Ethereal Email for testing
  const testAccount = await nodemailer.createTestAccount();
  console.log('Created Ethereal Test Account:', testAccount.user);
  
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

export const sendEmail = async ({ to, subject, html, text, attachments = [] }) => {
  try {
    const transporter = await createTransporter();
    
    const info = await transporter.sendMail({
      from: '"QuickShow Tickets" <tickets@quickshow.local>',
      to,
      subject,
      text,
      html,
      attachments,
    });

    console.log(`Message sent: ${info.messageId}`);
    
    // This provides a URL to view the email in the browser if using Ethereal
    if (info.messageId && !process.env.SMTP_HOST) {
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
