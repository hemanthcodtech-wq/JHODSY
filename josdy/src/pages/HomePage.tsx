import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Droplet, Sparkles, ShieldCheck, FlaskConical, Award, HeartHandshake, ChevronRight, Star } from 'lucide-react';
import { JHODSY_ASSETS } from '../data/assets';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { RatingStars } from '../components/common/RatingStars';
import { useProductsStore } from '../store/useProductsStore';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const HomePage: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const { products, loading: productsLoading, fetchProducts } = useProductsStore();
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const featuredProduct = products.length > 0 ? products[0] : null;

  useEffect(() => {
    fetchProducts().finally(() => setLoading(false));

    fetch(`${BACKEND_URL}/reviews`)
      .then(r => r.json())
      .then(d => {
        if (d.reviews) {
          setReviews(d.reviews.filter((r: any) => r.is_active));
        }
      })
      .catch(console.error);
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!featuredProduct) return;
    const normalizedProduct = {
      ...featuredProduct,
      size: featuredProduct.sizes?.[0]?.size || '30ml'
    };
    addToCart(normalizedProduct, 1);
    navigate('/cart');
  };

  // Resolve image
  const getImage = (product: any) => {
    if (product?.images?.length > 0) return product.images[0];
    if (product?.variants?.[0]?.images?.length > 0) return product.variants[0].images[0];
    if (product?.image_url) return product.image_url;
    return JHODSY_ASSETS.serumFront;
  };

  const mrp = featuredProduct ? Number(featuredProduct.mrp || featuredProduct.price) : 0;
  const price = featuredProduct ? Number(featuredProduct.effective_price || featuredProduct.price) : 0; // offer-discounted for customers
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return (
    <div className="w-full space-y-8 sm:space-y-12 pb-12 select-none">
      {/* 1. HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#071426] via-[#0B1E38] to-[#05080D] pt-6 sm:pt-10 pb-8 sm:pb-14 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.22em] text-[#BFC3C8] uppercase font-sans block">
                {loading ? 'JHODSY SKINCARE' : (featuredProduct?.name || 'JHODSY BRIGHTENING SERUM')}
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-serif leading-[1.1]">
                Reveal a<br />
                Brighter You
              </h1>

              <p className="text-xs sm:text-sm text-[#AEB6C2] max-w-md mx-auto lg:mx-0 font-normal leading-relaxed">
                {featuredProduct?.tagline || 'Science-backed skincare for a brighter, healthier you.'}
              </p>

              {/* 4 Circular Benefit Icons Row */}
              <div className="flex items-center justify-center lg:justify-start space-x-3 sm:space-x-5 pt-1">
                {[
                  { icon: <Sun className="w-4 h-4 text-[#D8D8D8]" />, label: 'Brightens\nSkin Tone' },
                  { icon: <Droplet className="w-4 h-4 text-[#D8D8D8]" />, label: 'Evens\nComplexion' },
                  { icon: <Sparkles className="w-4 h-4 text-[#D8D8D8]" />, label: 'Radiant\nGlow' },
                  { icon: <ShieldCheck className="w-4 h-4 text-[#D8D8D8]" />, label: 'All Skin\nTypes' },
                ].map((b, i) => (
                  <div key={i} className="flex flex-col items-center text-center space-y-1">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center">
                      {b.icon}
                    </div>
                    <span className="text-[9.5px] text-[#AEB6C2] leading-tight font-medium whitespace-pre-line">{b.label}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  to={featuredProduct ? `/product/${featuredProduct.id}` : '/shop'}
                  className="inline-flex items-center space-x-2 px-8 py-3 rounded-full bg-white text-[#071426] text-xs sm:text-sm font-bold tracking-wide hover:bg-[#F5F5F5] active:scale-95 transition shadow-lg"
                >
                  <span>Shop Now</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Right Bottle Image */}
            <div className="lg:col-span-5 flex justify-center items-center relative">
              <div className="relative w-full max-w-[320px] sm:max-w-[400px] aspect-square flex items-center justify-center">
                <img
                  src={loading ? JHODSY_ASSETS.heroSplash : (getImage(featuredProduct) || JHODSY_ASSETS.heroSplash)}
                  alt="JHODSY Serum"
                  className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] relative z-10 transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DUAL CARDS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Card */}
          <div className="lg:col-span-5 bg-[#0B192D] border border-white/10 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between shadow-card-dark gap-4">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-white font-serif leading-tight">
                Confidence<br />Looks Good<br />On Everyone
              </h3>
              <p className="text-[11px] text-[#AEB6C2]">Unisex Skincare Formula</p>
              <div className="pt-2">
                <Link to="/story" className="inline-flex items-center space-x-1.5 text-xs font-bold text-white hover:underline">
                  <span>Explore Our Story</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
            <div className="w-36 h-36 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
              <img src={JHODSY_ASSETS.menWomen} alt="Men and Women Skincare" className="w-full h-full object-cover object-center" />
            </div>
          </div>

          {/* Right Card: Value Props */}
          <div className="lg:col-span-7 bg-[#0B192D] border border-white/10 rounded-3xl p-6 flex items-center justify-around shadow-card-dark">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full text-center">
              {[
                { icon: <FlaskConical className="w-5 h-5 stroke-[1.8]" />, label: 'Clean Science' },
                { icon: <ShieldCheck className="w-5 h-5 stroke-[1.8]" />, label: 'Dermatologically\nInspired' },
                { icon: <Award className="w-5 h-5 stroke-[1.8]" />, label: 'Premium\nQuality' },
                { icon: <HeartHandshake className="w-5 h-5 stroke-[1.8]" />, label: 'Cruelty Free' },
              ].map((v, i) => (
                <div key={i} className="flex flex-col items-center space-y-2 p-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#071426] border border-white/10 flex items-center justify-center text-white">
                    {v.icon}
                  </div>
                  <span className="text-xs font-semibold text-white whitespace-pre-line">{v.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. BESTSELLER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#8994A3] uppercase">BESTSELLER</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
              {loading ? 'Our Featured Product' : (featuredProduct?.name || 'JHODSY Brightening Serum')}
            </h2>
          </div>
          <Link to="/shop" className="text-xs text-[#AEB6C2] hover:text-white flex items-center space-x-1">
            <span>See All Products</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="bg-[#0B192D] border border-white/10 rounded-3xl p-10 text-center text-white/50">
            Loading product...
          </div>
        ) : featuredProduct ? (
          <div className="bg-[#0B192D] border border-white/10 rounded-3xl p-6 shadow-card-dark grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 flex justify-center bg-[#071426] rounded-2xl p-4 relative">
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/10">
                  {discount}% OFF
                </span>
              )}
              <img
                src={getImage(featuredProduct)}
                alt={featuredProduct.name}
                className="w-full max-w-[200px] h-48 sm:h-56 object-contain"
              />
            </div>

            <div className="md:col-span-8 space-y-3">
              <h3 className="text-xl font-bold text-white font-serif">{featuredProduct.name}</h3>
              <p className="text-xs text-[#AEB6C2]">
                {featuredProduct.tagline} · {featuredProduct.variants?.[0]?.sizes?.[0]?.size || '30ml'}
              </p>
              <div className="flex items-center space-x-2">
                <RatingStars rating={4.8} count={100} size="sm" />
              </div>
              <div className="flex items-baseline space-x-3">
                <span className="text-2xl font-bold text-white">₹{price}</span>
                {mrp > price && (
                  <span className="text-sm text-[#8994A3] line-through">₹{mrp}</span>
                )}
                {discount > 0 && (
                  <span className="text-sm text-emerald-400 font-semibold">Save ₹{mrp - price}</span>
                )}
              </div>
              <p className="text-xs text-[#AEB6C2] leading-relaxed max-w-xl">{featuredProduct.description}</p>
              <div className="pt-2 flex items-center space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="px-8 py-3 rounded-full bg-white text-[#071426] text-xs sm:text-sm font-bold hover:bg-[#F5F5F5] transition shadow"
                >
                  Add to Cart →
                </button>
                <Link
                  to={`/product/${featuredProduct.id}`}
                  className="px-6 py-3 rounded-full bg-[#071426] border border-white/15 text-white text-xs sm:text-sm font-semibold hover:bg-white/10 transition"
                >
                  Full Product View
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#0B192D] border border-white/10 rounded-3xl p-10 text-center text-white/50">
            No products available.
          </div>
        )}
      </section>

      {/* 4. REVIEWS SECTION */}
      {reviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="flex items-center justify-center mb-8">
            <div className="text-center">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#8994A3] uppercase">TESTIMONIALS</span>
              <h2 className="text-xl sm:text-3xl font-bold text-white font-serif mt-1">
                What Our Customers Say
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((r) => (
              <div key={r.id} className="bg-[#0B192D] border border-white/10 rounded-3xl p-6 shadow-card-dark flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} className={`w-4 h-4 ${n <= r.rating ? 'fill-[#D4AF37] text-brand-orange' : 'text-[#8994A3]/30'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-[#AEB6C2] italic leading-relaxed mb-6">"{r.review}"</p>
                </div>
                <div className="flex items-center gap-3">
                  {r.image_url ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
                      <img src={r.image_url} alt={r.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {r.name?.charAt(0).toUpperCase() || 'C'}
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-white text-sm block">{r.name}</span>
                    <span className="text-[10px] text-[#4ade80] font-medium">Verified Buyer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
