const express = require('express');
const router = express.Router();
const sql = require('../db');

router.get('/vacation', async (req, res) => {
  try {
    const result = await sql`SELECT setting_value FROM store_settings WHERE setting_key = 'vacation_mode'`;
    if (result.length > 0) {
      res.json(result[0].setting_value);
    } else {
      res.json({ is_active: false, message: '' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/announcement', async (req, res) => {
  try {
    const result = await sql`SELECT setting_value FROM store_settings WHERE setting_key = 'announcement_bar'`;
    if (result.length > 0) {
      res.json({ announcement: result[0].setting_value });
    } else {
      res.json({ announcement: { is_active: false, items: [] } });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
