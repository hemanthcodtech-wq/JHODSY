const express = require('express');
const router = express.Router();
const sql = require('../db');

// Get all active products — JOINs offers so frontend gets effective_price
router.get('/', async (req, res) => {
  try {
    const redisClient = require('../redis');
    
    // Check Redis cache first
    const cachedProducts = await redisClient.get('all_products');
    if (cachedProducts) {
      return res.json({ products: JSON.parse(cachedProducts) });
    }

    const products = await sql`
      SELECT 
        p.*,
        o.discount_percentage AS offer_discount,
        o.title AS offer_title,
        CASE 
          WHEN o.id IS NOT NULL AND o.is_active = true 
          THEN ROUND(p.price - (p.price * o.discount_percentage / 100))
          ELSE p.price
        END AS effective_price
      FROM products p
      LEFT JOIN offers o ON p.offer_id = o.id
      WHERE p.is_active = true 
      ORDER BY p.created_at DESC
    `;
    
    // Cache the result in Redis for 10 minutes (600 seconds)
    await redisClient.setEx('all_products', 600, JSON.stringify(products));

    res.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const redisClient = require('../redis');
    const cacheKey = `product_${id}`;

    // Check Redis cache first
    const cachedProduct = await redisClient.get(cacheKey);
    if (cachedProduct) {
      return res.json({ product: JSON.parse(cachedProduct) });
    }

    let products;

    const query = sql`
      SELECT 
        p.*,
        o.discount_percentage AS offer_discount,
        o.title AS offer_title,
        CASE 
          WHEN o.id IS NOT NULL AND o.is_active = true 
          THEN ROUND(p.price - (p.price * o.discount_percentage / 100))
          ELSE p.price
        END AS effective_price
      FROM products p
      LEFT JOIN offers o ON p.offer_id = o.id
      WHERE p.is_active = true
    `;

    if (id === 'jhodsy-brightening-serum') {
      products = await sql`
        SELECT 
          p.*,
          o.discount_percentage AS offer_discount,
          o.title AS offer_title,
          CASE 
            WHEN o.id IS NOT NULL AND o.is_active = true 
            THEN ROUND(p.price - (p.price * o.discount_percentage / 100))
            ELSE p.price
          END AS effective_price
        FROM products p
        LEFT JOIN offers o ON p.offer_id = o.id
        WHERE p.is_active = true ORDER BY p.created_at ASC LIMIT 1
      `;
    } else {
      products = await sql`
        SELECT 
          p.*,
          o.discount_percentage AS offer_discount,
          o.title AS offer_title,
          CASE 
            WHEN o.id IS NOT NULL AND o.is_active = true 
            THEN ROUND(p.price - (p.price * o.discount_percentage / 100))
            ELSE p.price
          END AS effective_price
        FROM products p
        LEFT JOIN offers o ON p.offer_id = o.id
        WHERE p.id = ${id} AND p.is_active = true
      `;
    }

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Cache the result in Redis for 10 minutes
    await redisClient.setEx(cacheKey, 600, JSON.stringify(products[0]));

    res.json({ product: products[0] });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
