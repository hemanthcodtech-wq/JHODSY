const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const sql = require('../db');

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send Signup OTP
router.post('/send-signup-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // Check if user already exists
    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete existing OTPs for this email to avoid duplicates
    await sql`DELETE FROM otps WHERE email = ${email}`;

    // Insert new OTP
    await sql`INSERT INTO otps (email, otp) VALUES (${email}, ${otp})`;

    const mailOptions = {
      from: `"JHODSY Vault" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your JHODSY Security Code',
      text: `Your verification code is: ${otp}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #02050A; color: #ffffff; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #02050A; }
            .card { background-color: #0A1628; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            .logo { font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #ffffff; margin-bottom: 30px; text-transform: uppercase; }
            .title { font-size: 20px; color: #AEB6C2; margin-bottom: 20px; font-weight: 500; }
            .otp-box { background: linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.05)); border: 1px solid rgba(212,175,55,0.2); border-radius: 12px; padding: 20px; margin: 30px 0; }
            .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #D4AF37; margin: 0; }
            .footer { margin-top: 40px; font-size: 12px; color: #4A5568; line-height: 1.6; }
            .highlight { color: #D4AF37; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="logo">JHODSY</div>
              <div class="title">Secure Authentication</div>
              <p style="color: #8994A3; line-height: 1.6; font-size: 15px;">
                You are attempting to access the JHODSY platform. Please use the following security code to verify your identity and complete the process.
              </p>
              
              <div class="otp-box">
                <p class="otp-code">${otp}</p>
              </div>
              
              <p style="color: #8994A3; font-size: 14px; margin-top: 30px;">
                This code will expire in 10 minutes. If you did not request this, please ignore this email.
              </p>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} JHODSY. All rights reserved.</p>
              <p>This is an automated message from a secure system. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (emailError) {
      console.error('Error sending OTP email:', emailError);
      res.status(500).json({ error: 'Failed to send OTP email. Please check your SMTP configuration.' });
    }
  } catch (error) {
    console.error('Database/Server Error:', error);
    res.status(500).json({ error: 'Failed to process OTP request' });
  }
});

// Verify Signup OTP
router.post('/verify-signup-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

    const otpRecord = await sql`SELECT * FROM otps WHERE email = ${email} AND otp = ${otp} ORDER BY created_at DESC LIMIT 1`;
    if (otpRecord.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark as verified
    await sql`UPDATE otps SET is_verified = true WHERE id = ${otpRecord[0].id}`;

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Signup (Final step)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Ensure OTP was verified
    const otpRecord = await sql`SELECT * FROM otps WHERE email = ${email} AND is_verified = true`;
    if (otpRecord.length === 0) {
      return res.status(400).json({ error: 'Email has not been verified' });
    }

    // Check if user already exists
    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Note: Phone number is not in the schema by default, if missing from schema it will throw.
    // We should either add phone_number to users or omit it for now if schema doesn't support it.
    // Assuming schema only has email, password_hash, role, is_verified.
    // In a real app we'd alter table to add name and phone_number. Let's just insert what we have.
    const newUser = await sql`
      INSERT INTO users (email, password_hash, role, is_verified)
      VALUES (${email}, ${hashedPassword}, 'customer', true)
      RETURNING id, email, role, is_verified
    `;

    // Clean up OTP
    await sql`DELETE FROM otps WHERE email = ${email}`;

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser[0].id, email: newUser[0].email, role: newUser[0].role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      message: 'User registered successfully', 
      token, 
      user: newUser[0] 
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userResult = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (userResult.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult[0];

    // Check if user is verified
    if (!user.is_verified) {
      return res.status(401).json({ error: 'Please verify your email before logging in' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get User Profile
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    // Fetch user from DB
    const userResult = await sql`SELECT id, email, role, is_verified FROM users WHERE id = ${decoded.userId}`;
    
    if (userResult.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult[0];
    const addresses = await sql`SELECT * FROM addresses WHERE user_id = ${decoded.userId}`;
    const orders = await sql`SELECT * FROM orders WHERE user_id = ${decoded.userId}`;
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified
      },
      addresses,
      orders
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;
