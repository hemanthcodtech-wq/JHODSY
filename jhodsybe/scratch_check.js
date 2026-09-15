require('dotenv').config();
const sql = require('./db');
async function check() {
  const orders = await sql`SELECT * FROM orders ORDER BY id DESC LIMIT 5`;
  console.log('Last 5 orders:', orders);
  process.exit(0);
}
check();
