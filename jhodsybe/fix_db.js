require('dotenv').config();
const sql = require('./db');

async function fix() {
  try {
    const products = await sql`SELECT id, images FROM products`;
    for (const p of products) {
      if (p.images) {
        let changed = false;
        const newImages = p.images.map(img => {
          if (img.startsWith('/jhodsy-skincare/')) {
            changed = true;
            return img.replace('/jhodsy-skincare/', '/');
          }
          return img;
        });
        if (changed) {
          await sql`UPDATE products SET images = ${newImages} WHERE id = ${p.id}`;
          console.log(`Fixed product ${p.id}`);
        }
      }
    }
    console.log("Done");
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
fix();
