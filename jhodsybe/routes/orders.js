const express = require('express');
const router = express.Router();
const sql = require('../db');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

// GET /api/orders - Fetch all orders for the logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await sql`
      SELECT id, status, total, tracking_number, estimated_delivery, created_at
      FROM orders
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    // Fetch items for each order
    for (let order of orders) {
      const items = await sql`
        SELECT product_id, product_name, quantity, price, size
        FROM order_items
        WHERE order_id = ${order.id}
      `;
      order.items = items;
    }

    res.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// POST /api/orders - Create a new order
router.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId, total, items } = req.body;

    if (!addressId || !total || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Missing required order data' });
    }

    // Set estimated delivery to 5 days from now
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    const estimatedDelivery = deliveryDate.toISOString().split('T')[0];

    // Create the order
    const newOrder = await sql`
      INSERT INTO orders (user_id, address_id, status, total, estimated_delivery)
      VALUES (${userId}, ${addressId}, 'Processing', ${total}, ${estimatedDelivery})
      RETURNING id, status, total, tracking_number, estimated_delivery, created_at
    `;

    const orderId = newOrder[0].id;

    // Insert order items
    for (let item of items) {
      await sql`
        INSERT INTO order_items (order_id, product_id, product_name, quantity, price, size)
        VALUES (${orderId}, ${item.product_id}, ${item.product_name}, ${item.quantity}, ${item.price}, ${item.size})
      `;
    }

    res.status(201).json({ message: 'Order placed successfully', order: newOrder[0] });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET /api/orders/razorpay/key - Get Razorpay key for frontend
router.get('/razorpay/key', (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// POST /api/orders/razorpay/create - Create Razorpay order
router.post('/razorpay/create', verifyToken, async (req, res) => {
  try {
    const { total } = req.body;
    if (!total) {
      return res.status(400).json({ error: 'Missing total amount' });
    }

    const options = {
      amount: total * 100, // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

// POST /api/orders/razorpay/verify - Verify payment and create DB order
router.post('/razorpay/verify', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      addressId,
      total,
      items
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment details' });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // If authentic, create the order in DB
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    const estimatedDelivery = deliveryDate.toISOString().split('T')[0];

    const newOrder = await sql`
      INSERT INTO orders (user_id, address_id, status, total, estimated_delivery)
      VALUES (${userId}, ${addressId}, 'Processing', ${total}, ${estimatedDelivery})
      RETURNING id, status, total, tracking_number, estimated_delivery, created_at
    `;

    const orderId = newOrder[0].id;

    for (let item of items) {
      await sql`
        INSERT INTO order_items (order_id, product_id, product_name, quantity, price, size)
        VALUES (${orderId}, ${item.product_id}, ${item.product_name}, ${item.quantity}, ${item.price}, ${item.size})
      `;
    }

    res.status(201).json({ message: 'Payment verified and order placed successfully', order: newOrder[0] });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment and place order' });
  }
});

// GET /api/orders/track/:trackId - Public endpoint to track order
router.get('/track/:trackId', async (req, res) => {
  try {
    const { trackId } = req.params;
    let ordersRes;
    
    if (!isNaN(trackId)) {
      ordersRes = await sql`
        SELECT o.id, o.status, o.total, o.tracking_number, o.estimated_delivery, o.created_at,
               a.city, a.state
        FROM orders o
        LEFT JOIN addresses a ON o.address_id = a.id
        WHERE o.id = ${trackId} OR o.tracking_number = ${trackId}
      `;
    } else {
      ordersRes = await sql`
        SELECT o.id, o.status, o.total, o.tracking_number, o.estimated_delivery, o.created_at,
               a.city, a.state
        FROM orders o
        LEFT JOIN addresses a ON o.address_id = a.id
        WHERE o.tracking_number = ${trackId}
      `;
    }

    if (ordersRes.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = ordersRes[0];
    order.address = {
      city: order.city || 'N/A',
      state: order.state || 'N/A'
    };

    res.json({ order });
  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({ error: 'Failed to track order' });
  }
});

module.exports = router;
