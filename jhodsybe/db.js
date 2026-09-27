const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is missing');
}
console.log("DB URL: ", process.env.DATABASE_URL);
const sql = neon(process.env.DATABASE_URL);

module.exports = sql;
