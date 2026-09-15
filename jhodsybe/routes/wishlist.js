const express = require('express');
const router = express.Router();
const sql = require('../db');
const jwt = require('jsonwebtoken');

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

// Get all wishlist items
router.get('/', verifyToken, async (req, res) => {
  try {
    const items = await sql`
      SELECT id, product_id
      FROM wishlist_items 
      WHERE user_id = ${req.user.userId}
      ORDER BY created_at DESC
    `;
    res.json({ success: true, items });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle item in wishlist
router.post('/', verifyToken, async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ error: 'Product ID required' });
  }

  try {
    // Check if it exists
    const existing = await sql`
      SELECT id FROM wishlist_items 
      WHERE user_id = ${req.user.userId} AND product_id = ${productId}
    `;

    if (existing.length > 0) {
      // Remove it
      await sql`DELETE FROM wishlist_items WHERE id = ${existing[0].id}`;
      return res.json({ success: true, added: false });
    } else {
      // Add it
      const result = await sql`
        INSERT INTO wishlist_items (user_id, product_id)
        VALUES (${req.user.userId}, ${productId})
        RETURNING *
      `;
      return res.json({ success: true, added: true, item: result[0] });
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
