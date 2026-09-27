require('dotenv').config();
const sql = require('./db');

async function test() {
  const otps = await sql`SELECT * FROM otps ORDER BY created_at DESC LIMIT 5`;
  console.log(otps);
  process.exit(0);
}
test();
