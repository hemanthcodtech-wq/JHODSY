require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function run() {
  try {
    const info = await transporter.sendMail({
      from: `"JHODSY Vault" <${process.env.SMTP_USER}>`,
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test'
    });
    console.log("Success:", info.messageId);
  } catch (e) {
    console.error("Error:", e);
  }
}
run();
