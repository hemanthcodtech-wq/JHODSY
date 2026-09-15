const express = require('express');
const router = express.Router();
const sql = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// GET /api/addresses - Fetch all addresses for the logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const addresses = await sql`
      SELECT id, name, phone, street, city, state, zip, is_default
      FROM addresses
      WHERE user_id = ${userId}
      ORDER BY is_default DESC, created_at DESC
    `;
    res.json({ addresses });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

// POST /api/addresses - Add a new address
router.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, phone, street, city, state, zip, isDefault } = req.body;

    if (!name || !phone || !street || !city || !state || !zip) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // If this is the first address, or isDefault is true, handle default logic
    const existingAddresses = await sql`SELECT id FROM addresses WHERE user_id = ${userId}`;
    const makeDefault = isDefault || existingAddresses.length === 0;

    if (makeDefault) {
      await sql`UPDATE addresses SET is_default = false WHERE user_id = ${userId}`;
    }

    const newAddress = await sql`
      INSERT INTO addresses (user_id, name, phone, street, city, state, zip, is_default)
      VALUES (${userId}, ${name}, ${phone}, ${street}, ${city}, ${state}, ${zip}, ${makeDefault})
      RETURNING id, name, phone, street, city, state, zip, is_default
    `;

    res.status(201).json({ message: 'Address added successfully', address: newAddress[0] });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ error: 'Failed to add address' });
  }
});

module.exports = router;
