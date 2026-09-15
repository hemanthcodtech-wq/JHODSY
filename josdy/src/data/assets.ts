/**
 * Canonical JHODSY Asset Library
 * Dynamic BASE_URL prefix ensures 100% asset path reliability on GitHub Pages & Localhost.
 */

const BASE = (import.meta as any).env?.BASE_URL || '/';
const cleanBase = BASE.endsWith('/') ? BASE : BASE + '/';

export const JHODSY_ASSETS = {
  // Brand Logos
  logoSymbol: `${cleanBase}assets/jhodsy-logo-symbol.png`,       // logos (1).png - Clean metallic symbol for Nav, Badges, Footer
  logoLockup: `${cleanBase}assets/jhodsy-logo-lockup.png`,       // logos (2).png - Full metallic logo lockup on textured dark navy
  logoWater: `${cleanBase}assets/jhodsy-logo-water.png`,         // assets (3).png - Metallic logo with liquid water background

  // Product Photography
  heroSplash: `${cleanBase}assets/jhodsy-hero-splash.png`,       // assets (1).png - Serum + dramatic blue water splash
  serumWater: `${cleanBase}assets/jhodsy-serum-water.png`,       // assets (9).png - Serum in water with reflection (Detail Hero)
  serumFront: `${cleanBase}assets/jhodsy-serum-front.png`,       // assets (10).png - Clean front-facing serum (E-commerce Cards & Cart)
  serumBox: `${cleanBase}assets/jhodsy-serum-box.png`,           // assets (11).png - Serum + box packaging shot
  serumClean: `${cleanBase}assets/jhodsy-serum-clean.png`,       // assets (12).png - Clean serum bottle variant
  serumSplashAlt: `${cleanBase}assets/jhodsy-serum-splash.png`,  // product (1).png - Dramatic liquid splash
  serumPackaging: `${cleanBase}assets/jhodsy-serum-packaging.png`, // product (2).png - Serum with packaging box

  // Lifestyle & Campaigns
  menWomen: `${cleanBase}assets/jhodsy-men-women.png`,           // assets (8).png - Male + Female "Confidence Looks Good On Everyone"
  womanLifestyle: `${cleanBase}assets/jhodsy-woman-lifestyle.png`, // assets (6).png - Female skincare lifestyle
  womanProduct: `${cleanBase}assets/jhodsy-woman-product.png`,   // assets (7).png - Female + JHODSY product campaign

  // Science & Backgrounds
  science: `${cleanBase}assets/jhodsy-science.png`,               // assets (5).png - Skincare science & active molecules
  waterTexture: `${cleanBase}assets/jhodsy-water-texture.png`,   // assets (4).png - Dark navy glossy water surface/texture
  liquidSplash: `${cleanBase}assets/jhodsy-liquid-splash.png`,   // assets (2).png - Abstract dark navy-blue liquid wave
};
