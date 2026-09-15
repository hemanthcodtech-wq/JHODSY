require('dotenv').config();
const sql = require('./db');
async function check() {
  const users = await sql`SELECT * FROM users`;
  console.log('Users:', users);
  process.exit(0);
}
check();
