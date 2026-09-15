const sql = require('./db');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    console.log('Creating users table...');
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'customer',
        is_verified BOOLEAN DEFAULT false,
        verification_token VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Users table created.');

    console.log('Creating otps table...');
    await sql`
      CREATE TABLE IF NOT EXISTS otps (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_verified BOOLEAN DEFAULT false
      );
    `;
    console.log('OTPs table created.');

    console.log('Creating addresses table...');
    await sql`
      CREATE TABLE IF NOT EXISTS addresses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        street TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        zip VARCHAR(20) NOT NULL,
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Addresses table created.');

    console.log('Creating orders table...');
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        address_id INTEGER REFERENCES addresses(id) ON DELETE SET NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Processing',
        total DECIMAL(10, 2) NOT NULL,
        tracking_number VARCHAR(100),
        estimated_delivery VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Orders table created.');

    console.log('Creating order_items table...');
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id VARCHAR(100) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        size VARCHAR(50)
      );
    `;
    console.log('Order items table created.');

    console.log('Creating cart_items table...');
    await sql`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id VARCHAR(100) NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        size VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id, size)
      );
    `;
    console.log('Cart items table created.');

    console.log('Creating wishlist_items table...');
    await sql`
      CREATE TABLE IF NOT EXISTS wishlist_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      );
    `;
    console.log('Wishlist items table created.');

    const adminEmail = 'admin@jhodsy.com';
    const adminPassword = 'adminpassword';
    
    const existingAdmin = await sql`SELECT * FROM users WHERE email = ${adminEmail}`;
    
    if (existingAdmin.length === 0) {
      console.log('Seeding admin user...');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
      
      await sql`
        INSERT INTO users (email, password_hash, role, is_verified)
        VALUES (${adminEmail}, ${hashedPassword}, 'admin', true)
      `;
      console.log('Admin user seeded successfully. Email: admin@jhodsy.com, Password: adminpassword');
    } else {
      console.log('Admin user already exists.');
    }

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seed();
