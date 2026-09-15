const express = require('express');
const router = express.Router();
const sql = require('../db');

router.get('/', async (req, res) => {
  try {
    const reviews = await sql`SELECT * FROM reviews WHERE is_active = true ORDER BY created_at DESC`;
    // let me just select all reviews for now, assuming admin only adds good ones or there's a specific schema
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
