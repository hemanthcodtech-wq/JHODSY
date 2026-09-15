require('dotenv').config();
const sql = require('./db');

const primaryProduct = {
  id: 'jhodsy-brightening-serum', // Note: Our DB uses SERIAL id. We will insert it normally and get an int ID.
  name: 'JHODSY Brightening Serum',
  tagline: 'For brighter, even-toned skin',
  category_id: null,
  mrp: 799,
  price: 559,
  stock: 950,
  benefits: [
    'Brightens Skin Tone',
    'Evens Complexion',
    'Radiant Glow',
    'For All Skin Types'
  ],
  description: 'JHODSY Brightening Serum is a high-performance formula designed to penetrate deep into the skin layers to visibly diminish pigmentation, boost luminous glow, and restore youthful elasticity.',
  howToUse: [
    'Cleanse your face thoroughly with water and pat dry.',
    'Apply 3–4 drops of JHODSY Brightening Serum across your face and neck.',
    'Gently massage in circular upward motions until fully absorbed.',
    'Follow up with your preferred moisturizer and sunscreen for daytime protection.'
  ],
  ingredients: [
    'Hyaluronic Acid (Multi-molecular Weight)',
    'Alpha Arbutin & Niacinamide (Vitamin B3)',
    'Stabilized Vitamin C Complex',
    'Pure Botanical Hydrosols',
    'Ceramides & Licorice Root Extract'
  ],
  images: [
    '/assets (1).png', // heroSplash
    '/assets (11).png', // box
    '/assets (10).png', // front
    '/assets (12).png', // clean
    '/assets (9).png',  // water
    '/product (2).png', // packaging
    '/product (1).png'  // splashAlt
  ],
  variants: [],
  sizes: [{ size: '30ml', price: 559, mrp: 799 }]
};

async function seedProduct() {
  try {
    console.log('Inserting JHODSY Brightening Serum...');
    const result = await sql`
      INSERT INTO products (
        name, tagline, price, mrp, description, benefits, how_to_use, ingredients, images, variants, sizes, category_id, stock
      ) VALUES (
        ${primaryProduct.name}, 
        ${primaryProduct.tagline}, 
        ${primaryProduct.price}, 
        ${primaryProduct.mrp}, 
        ${primaryProduct.description}, 
        ${JSON.stringify(primaryProduct.benefits)}, 
        ${JSON.stringify(primaryProduct.howToUse)}, 
        ${JSON.stringify(primaryProduct.ingredients)}, 
        ${JSON.stringify(primaryProduct.images)}, 
        ${JSON.stringify(primaryProduct.variants)}, 
        ${JSON.stringify(primaryProduct.sizes)}, 
        ${primaryProduct.category_id}, 
        ${primaryProduct.stock}
      )
      RETURNING *
    `;
    console.log('Product seeded successfully:', result[0]);
  } catch (err) {
    console.error('Error seeding product:', err);
  } finally {
    process.exit(0);
  }
}

seedProduct();
