require('dotenv').config();
const sql = require('./db');

async function fix() {
  try {
    const images = [
      '/jhodsy-skincare/assets/jhodsy-hero-splash.png', 
      '/jhodsy-skincare/assets/jhodsy-serum-box.png', 
      '/jhodsy-skincare/assets/jhodsy-serum-front.png', 
      '/jhodsy-skincare/assets/jhodsy-serum-clean.png', 
      '/jhodsy-skincare/assets/jhodsy-serum-water.png', 
      '/jhodsy-skincare/assets/jhodsy-serum-packaging.png', 
      '/jhodsy-skincare/assets/jhodsy-serum-splash.png'  
    ];
    const variants = [
      {
        color: "",
        images,
        sizes: [{ size: '30ml', price: 559, mrp: 799 }]
      }
    ];
    
    await sql`UPDATE products SET images = ${JSON.stringify(images)}, variants = ${JSON.stringify(variants)} WHERE name = 'JHODSY Brightening Serum'`;
    console.log("Successfully updated product image paths in the database!");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
fix();
