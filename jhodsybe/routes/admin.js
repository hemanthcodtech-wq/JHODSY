const express = require('express');
const router = express.Router();
const sql = require('../db');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.use(authMiddleware);

// Upload Image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'jhodsy'
    });
    
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Products
router.get('/products', async (req, res) => {
  try {
    const products = await sql`SELECT * FROM products ORDER BY created_at DESC`;
    res.json({ products });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/products', async (req, res) => {
  try {
    const { name, tagline, price, mrp, description, benefits, howToUse, ingredients, images, variants, sizes, category_id, stock } = req.body;
    const result = await sql`
      INSERT INTO products (name, tagline, price, mrp, description, benefits, how_to_use, ingredients, images, variants, sizes, category_id, stock)
      VALUES (${name}, ${tagline||''}, ${price}, ${mrp||price}, ${description}, ${JSON.stringify(benefits||[])}, ${JSON.stringify(howToUse||[])}, ${JSON.stringify(ingredients||[])}, ${JSON.stringify(images||[])}, ${JSON.stringify(variants||[])}, ${JSON.stringify(sizes||[])}, ${category_id || null}, ${stock || 0})
      RETURNING *
    `;
    res.json({ success: true, product: result[0] });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tagline, price, mrp, description, benefits, howToUse, ingredients, images, variants, sizes, category_id, stock } = req.body;
    const result = await sql`
      UPDATE products 
      SET 
        name = ${name}, 
        tagline = ${tagline||''}, 
        price = ${price}, 
        mrp = ${mrp||price}, 
        description = ${description}, 
        benefits = ${JSON.stringify(benefits||[])}, 
        how_to_use = ${JSON.stringify(howToUse||[])}, 
        ingredients = ${JSON.stringify(ingredients||[])}, 
        images = ${JSON.stringify(images||[])}, 
        variants = ${JSON.stringify(variants||[])}, 
        sizes = ${JSON.stringify(sizes||[])}, 
        category_id = ${category_id || null}, 
        stock = ${stock || 0}
      WHERE id = ${id}
      RETURNING *
    `;
    res.json({ success: true, product: result[0] });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await sql`DELETE FROM products WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Users/Customers
router.get('/users', async (req, res) => {
  try {
    const users = await sql`
      SELECT 
        u.id, 
        u.email, 
        u.role, 
        u.is_verified, 
        u.created_at,
        a.name,
        a.phone
      FROM users u
      LEFT JOIN (
        SELECT DISTINCT ON (user_id) user_id, name, phone 
        FROM addresses 
        ORDER BY user_id, created_at DESC
      ) a ON a.user_id = u.id
      WHERE u.role = 'customer' 
      ORDER BY u.created_at DESC
    `;
    res.json({ users });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await sql`SELECT * FROM categories ORDER BY created_at DESC`;
    res.json({ categories });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/categories', async (req, res) => {
  try {
    const { name, image_url } = req.body;
    const result = await sql`INSERT INTO categories (name, image_url) VALUES (${name}, ${image_url || ''}) RETURNING *`;
    res.json({ success: true, category: result[0] });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Offers
router.get('/offers', async (req, res) => {
  try {
    const offers = await sql`SELECT * FROM offers ORDER BY created_at DESC`;
    res.json({ offers });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/offers', async (req, res) => {
  try {
    const { title, discount_percentage } = req.body;
    const result = await sql`INSERT INTO offers (title, discount_percentage) VALUES (${title}, ${discount_percentage || 0}) RETURNING *`;
    res.json({ success: true, offer: result[0] });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/offers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, discount_percentage, is_active } = req.body;
    const result = await sql`UPDATE offers SET title = ${title}, discount_percentage = ${discount_percentage}, is_active = ${is_active} WHERE id = ${id} RETURNING *`;
    res.json({ success: true, offer: result[0] });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/offers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Remove offer link from products first
    await sql`UPDATE products SET offer_id = NULL WHERE offer_id = ${id}`;
    await sql`DELETE FROM offers WHERE id = ${id}`;
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Apply offer to products — sets offer_id FK, does NOT modify price
router.post('/offers/:id/apply', async (req, res) => {
  try {
    const { id } = req.params;
    const { category, productIds, applyToAll } = req.body;

    // Verify offer exists
    const offerRes = await sql`SELECT * FROM offers WHERE id = ${id}`;
    if (offerRes.length === 0) return res.status(404).json({ error: 'Offer not found' });

    if (applyToAll) {
      await sql`UPDATE products SET offer_id = ${id} WHERE is_active = true`;
    } else if (category) {
      await sql`UPDATE products SET offer_id = ${id} WHERE category = ${category}`;
    } else if (productIds && Array.isArray(productIds) && productIds.length > 0) {
      for (const pid of productIds) {
        await sql`UPDATE products SET offer_id = ${id} WHERE id = ${pid}`;
      }
    } else {
      return res.status(400).json({ error: 'Provide applyToAll, category, or productIds' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Apply offer error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Remove offer from all products
router.post('/offers/:id/remove', async (req, res) => {
  try {
    const { id } = req.params;
    await sql`UPDATE products SET offer_id = NULL WHERE offer_id = ${id}`;
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Banners
router.get('/banners', async (req, res) => {
  try {
    const banners = await sql`SELECT * FROM banners ORDER BY created_at DESC`;
    res.json({ banners });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/banners', async (req, res) => {
  try {
    const { title, image_url, link_url } = req.body;
    const result = await sql`INSERT INTO banners (title, image_url, link_url) VALUES (${title}, ${image_url}, ${link_url}) RETURNING *`;
    res.json({ success: true, banner: result[0] });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Coupons
router.get('/coupons', async (req, res) => {
  try {
    const coupons = await sql`SELECT * FROM coupons ORDER BY created_at DESC`;
    res.json({ coupons });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/coupons', async (req, res) => {
  try {
    const { code, discount_percentage, min_order_value, usage_type, max_uses, expiry_date, is_active } = req.body;
    const result = await sql`
      INSERT INTO coupons (code, discount_percentage, min_order_value, usage_type, max_uses, expiry_date, is_active)
      VALUES (${code}, ${discount_percentage || 0}, ${min_order_value || 0}, ${usage_type || 'multiple'}, ${max_uses || null}, ${expiry_date || null}, ${is_active !== false})
      RETURNING *
    `;
    res.json({ success: true, coupon: result[0] });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/coupons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount_percentage, min_order_value, usage_type, max_uses, expiry_date, is_active } = req.body;
    const result = await sql`
      UPDATE coupons SET code=${code}, discount_percentage=${discount_percentage}, min_order_value=${min_order_value || 0},
      usage_type=${usage_type || 'multiple'}, max_uses=${max_uses || null}, expiry_date=${expiry_date || null}, is_active=${is_active !== false}
      WHERE id=${id} RETURNING *
    `;
    res.json({ success: true, coupon: result[0] });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/coupons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await sql`DELETE FROM coupons WHERE id=${id}`;
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Dashboard Stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const ordersResult = await sql`SELECT SUM(total) as total_revenue, COUNT(*) as total_orders FROM orders`;
    const totalRevenue = parseFloat(ordersResult[0].total_revenue) || 0;
    const totalOrders = parseInt(ordersResult[0].total_orders) || 0;
    
    res.json({ totalRevenue, totalOrders });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Settings / Vacation Mode
router.get('/settings/vacation', async (req, res) => {
  try {
    const result = await sql`SELECT setting_value FROM store_settings WHERE setting_key = 'vacation_mode'`;
    if (result.length > 0) {
      res.json(result[0].setting_value);
    } else {
      res.json({ is_active: false, message: '' });
    }
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/settings/vacation', async (req, res) => {
  try {
    const { is_active, message } = req.body;
    const payload = JSON.stringify({ is_active: !!is_active, message: message || '' });
    
    await sql`
      INSERT INTO store_settings (setting_key, setting_value)
      VALUES ('vacation_mode', ${payload}::jsonb)
      ON CONFLICT (setting_key) 
      DO UPDATE SET setting_value = ${payload}::jsonb
    `;
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Settings / Announcement Bar
router.get('/settings/announcement', async (req, res) => {
  try {
    const result = await sql`SELECT setting_value FROM store_settings WHERE setting_key = 'announcement_bar'`;
    if (result.length > 0) {
      res.json({ announcement: result[0].setting_value });
    } else {
      res.json({ announcement: { is_active: false, items: [] } });
    }
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/settings/announcement', async (req, res) => {
  try {
    const payload = JSON.stringify(req.body);
    
    await sql`
      INSERT INTO store_settings (setting_key, setting_value)
      VALUES ('announcement_bar', ${payload}::jsonb)
      ON CONFLICT (setting_key) 
      DO UPDATE SET setting_value = ${payload}::jsonb
    `;
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Reviews
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await sql`SELECT * FROM reviews ORDER BY created_at DESC`;
    res.json({ reviews });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/reviews', async (req, res) => {
  try {
    const { name, rating, review, image_url, is_active } = req.body;
    const result = await sql`
      INSERT INTO reviews (name, rating, review, image_url, is_active)
      VALUES (${name}, ${rating || 5}, ${review}, ${image_url || null}, ${is_active !== false})
      RETURNING *
    `;
    res.json({ success: true, review: result[0] });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rating, review, image_url, is_active } = req.body;
    const result = await sql`
      UPDATE reviews
      SET name=${name}, rating=${rating}, review=${review}, image_url=${image_url || null}, is_active=${is_active !== false}
      WHERE id=${id} RETURNING *
    `;
    res.json({ success: true, review: result[0] });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await sql`DELETE FROM reviews WHERE id=${id}`;
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await sql`
      SELECT o.*, a.name as address_name, a.phone as address_phone, a.street, a.city, a.state, a.zip,
             u.email as user_email
      FROM orders o 
      LEFT JOIN addresses a ON o.address_id = a.id
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `;
    
    for (let o of orders) {
      o.user_name = o.address_name || null; // customer name from their address
      o.address = {
        name: o.address_name || '',
        mobile: o.address_phone || '',
        phone: o.address_phone || '',
        street: o.street,
        city: o.city,
        state: o.state,
        zip: o.zip
      };
      
      const items = await sql`
        SELECT oi.*, p.images 
        FROM order_items oi 
        LEFT JOIN products p ON p.id::text = oi.product_id
        WHERE oi.order_id = ${o.id}
      `;
      o.items = items.map(i => ({
        product: { id: i.product_id, name: i.product_name, price: i.price, images: i.images },
        variant: { size: i.size, price: i.price },
        qty: i.quantity
      }));
    }
    
    res.json({ orders });
  } catch (error) { 
    console.error("ORDERS ROUTE ERROR:", error);
    res.status(500).json({ error: error.message }); 
  }
});

// Delivery Partners
router.get('/delivery-partners', (req, res) => {
  res.json({ partners: [] });
});

module.exports = router;
