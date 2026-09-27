import { Product } from '../types';
import { JHODSY_ASSETS } from './assets';

export const BRAND_INFO = {
  name: 'JHODSY',
  tagline: 'SKIN THAT DEFINES YOU',
  slogan: 'BEAUTY IN CONFIDENCE',
  subheading: 'Science-backed skincare for a brighter, healthier you.',
  quote: '“Confidence Begins With Healthy Skin.”',
  aboutText: 'JHODSY is a modern skincare brand dedicated to bringing science and nature together for healthier, brighter and more confident skin. Our products are crafted for everyone – because great skin has no gender.',
  customerCare: '18008907404',
  whatsapp: '8074193553',
  whatsappUrl: 'https://wa.me/918074193553?text=Hi%20JHODSY%2C%20I%20would%20like%20to%20know%20more%20about%20your%20Brightening%20Serum',
  instagramUrl: 'https://instagram.com/jhodsy',
  email: 'jhodsyskin@gmail.com',
  timings: 'Mon - Sat, 9AM - 6PM',
  address: {
    line1: '1-328, Kothapeta',
    line2: 'VSMD 011, Rambilli',
    city: 'Anakapalli',
    state: 'Andhra Pradesh',
    pincode: '531061',
    full: '1-328, Kothapeta, VSMD 011, Rambilli, Anakapalli, Andhra Pradesh - 531061'
  },
  gst: '37BZIPY7784D1ZJ',
  businessType: 'Retail',
  category: 'Skincare',
  targetCustomers: 'Men and Women'
};

export const PRIMARY_PRODUCT: Product = {
  id: 'jhodsy-brightening-serum',
  name: 'JHODSY Brightening Serum',
  tagline: 'For brighter, even-toned skin',
  category: 'Serums',
  size: '30ml',
  mrp: 799,
  price: 559,
  discount: '30% OFF',
  rating: 4.8,
  reviewCount: 100,
  inventory: 950,
  benefits: [
    'Brightens Skin Tone',
    'Evens Complexion',
    'Radiant Glow',
    'For All Skin Types'
  ],
  description: 'JHODSY Brightening Serum is a high-performance formula designed to penetrate deep into the skin layers to visibly diminish pigmentation, boost luminous glow, and restore youthful elasticity.',
  suitableFor: 'All Skin Types (Men & Women)',
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
  images: {
    hero: JHODSY_ASSETS.heroSplash,       // assets (1).png
    splash: JHODSY_ASSETS.heroSplash,
    box: JHODSY_ASSETS.serumBox,           // assets (11).png
    front: JHODSY_ASSETS.serumFront,       // assets (10).png
    clean: JHODSY_ASSETS.serumClean,       // assets (12).png
    detailHero: JHODSY_ASSETS.serumWater,  // assets (9).png
    packaging: JHODSY_ASSETS.serumPackaging, // product (2).png
    splashAlt: JHODSY_ASSETS.serumSplashAlt // product (1).png
  }
};

export const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'serums', name: 'Serums' },
  { id: 'moisturizers', name: 'Moisturizers' },
  { id: 'facewash', name: 'Face Wash' }
];

export const FAQS = [
  {
    q: 'What is JHODSY Brightening Serum?',
    a: 'JHODSY Brightening Serum is our flagship dermatologically crafted formula engineered to revitalize dull skin, fade hyperpigmentation, and impart a lasting, luminous radiance.'
  },
  {
    q: 'Who can use the serum?',
    a: 'It is specially formulated for both men and women of all skin types, including sensitive, oily, dry, and combination skin.'
  },
  {
    q: 'How should I use it?',
    a: 'Apply 3-4 drops to cleansed face and neck twice daily (morning & night). Gently pat into the skin before applying moisturizer.'
  },
  {
    q: 'How often should I use it?',
    a: 'For best results, use consistently twice a day: once in your morning routine and once before bedtime.'
  },
  {
    q: 'Is it suitable for men?',
    a: 'Yes, absolutely! Skincare has no gender, and our non-greasy, fast-absorbing texture is highly favored by men and women alike.'
  },
  {
    q: 'Is it suitable for women?',
    a: 'Yes, it provides intense deep hydration, antioxidant defense, and a radiant glass-skin glow.'
  },
  {
    q: 'What is the bottle size?',
    a: 'It comes in a premium 30ml black UV-protective glass dropper bottle.'
  },
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 2–4 business days across India. All orders are packed with extra care in tamper-proof luxury packaging.'
  },
  {
    q: 'What is the return policy?',
    a: 'We offer an easy 7-day hassle-free replacement or return policy if your product arrives damaged or defective.'
  }
];
