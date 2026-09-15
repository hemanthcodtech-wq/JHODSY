const express = require('express');
const router = express.Router();
const sql = require('../db');
const jwt = require('jsonwebtoken');
const redisClient = require('../redis');

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

// Get all cart items
router.get('/', verifyToken, async (req, res) => {
  try {
    const cacheKey = `cart:${req.user.userId}`;
    const cachedCart = await redisClient.get(cacheKey);
    
    if (cachedCart) {
      return res.json({ success: true, items: JSON.parse(cachedCart) });
    }

    const items = await sql`
      SELECT id, product_id, quantity, size 
      FROM cart_items 
      WHERE user_id = ${req.user.userId}
      ORDER BY created_at DESC
    `;
    
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(items)); // Cache for 1 hour
    res.json({ success: true, items });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add or update item in cart
router.post('/', verifyToken, async (req, res) => {
  const { productId, quantity, size } = req.body;
  if (!productId || !size || quantity == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await sql`
      INSERT INTO cart_items (user_id, product_id, quantity, size)
      VALUES (${req.user.userId}, ${productId}, ${quantity}, ${size})
      ON CONFLICT (user_id, product_id, size)
      DO UPDATE SET quantity = cart_items.quantity + ${quantity}
      RETURNING *
    `;
    
    await redisClient.del(`cart:${req.user.userId}`); // Invalidate cache
    res.json({ success: true, item: result[0] });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update quantity directly
router.put('/:id', verifyToken, async (req, res) => {
  const { quantity } = req.body;
  const { id } = req.params;

  try {
    const result = await sql`
      UPDATE cart_items 
      SET quantity = ${quantity} 
      WHERE id = ${id} AND user_id = ${req.user.userId}
      RETURNING *
    `;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }
    
    await redisClient.del(`cart:${req.user.userId}`); // Invalidate cache
    res.json({ success: true, item: result[0] });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove item from cart
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await sql`DELETE FROM cart_items WHERE id = ${id} AND user_id = ${req.user.userId}`;
    await redisClient.del(`cart:${req.user.userId}`); // Invalidate cache
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Clear entire cart
router.delete('/', verifyToken, async (req, res) => {
  try {
    await sql`DELETE FROM cart_items WHERE user_id = ${req.user.userId}`;
    await redisClient.del(`cart:${req.user.userId}`); // Invalidate cache
    res.json({ success: true });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Validate coupon
router.post('/coupon/validate', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Coupon code required' });
    const couponRes = await sql`SELECT * FROM coupons WHERE code = ${code.toUpperCase()}`;
    if (couponRes.length === 0) return res.status(404).json({ error: 'Invalid coupon code' });
    res.json({ success: true, discount_percentage: couponRes[0].discount_percentage });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({ error: 'Failed to validate coupon' });
  }
});

module.exports = router;
