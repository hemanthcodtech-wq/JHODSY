require('dotenv').config();
const sql = require('./db');

async function alterTable() {
  try {
    console.log('Altering products table...');
    await sql`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS tagline VARCHAR(255),
      ADD COLUMN IF NOT EXISTS mrp DECIMAL(10, 2),
      ADD COLUMN IF NOT EXISTS benefits JSONB,
      ADD COLUMN IF NOT EXISTS how_to_use JSONB,
      ADD COLUMN IF NOT EXISTS ingredients JSONB
    `;
    console.log('Table altered successfully.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

alterTable();
