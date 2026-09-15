import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, ChevronDown, Check, ArrowRight, Sparkles } from 'lucide-react';
import { JHODSY_ASSETS } from '../data/assets';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { RatingStars } from '../components/common/RatingStars';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceMax, setPriceMax] = useState(1000);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['Serums', 'All Skin Types']);
  const [sortBy, setSortBy] = useState('Featured');
  
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BACKEND_URL}/products`)
      .then(r => r.json())
      .then(d => {
        if (d.products) {
          setProducts(d.products);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Serums', 'Moisturizers', 'Face Wash', 'Toners', 'Kits'];

  const categoryList = [
    { name: 'Serums', count: products.filter(p => p.category?.toLowerCase() === 'serums' || p.category_id).length || 1 },
    { name: 'Moisturizers', count: 0 },
    { name: 'Face Wash', count: 0 },
    { name: 'Toners', count: 0 },
    { name: 'Kits', count: 0 }
  ];

  const skinTypes = [
    { name: 'All Skin Types', count: products.length },
    { name: 'Normal', count: products.length },
    { name: 'Dry', count: 0 },
    { name: 'Oily', count: 0 }
  ];

  const toggleFilter = (name: string) => {
    setSelectedFilters(prev =>
      prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]
    );
  };

  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'All') {
      if (p.category !== selectedCategory) return false;
    }
    if (Number(p.price) > priceMax) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 select-none">
      {/* 1. TOP HEADER BANNER MATCHING DESKTOP SCREEN 2 */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#071426] via-[#0B1E38] to-[#071426] border border-white/10 p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between shadow-card-dark gap-4">
        {/* Ambient liquid texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img src={JHODSY_ASSETS.liquidSplash} alt="Splash" className="w-full h-full object-cover" />
        </div>

        <div className="relative z-10 space-y-1">
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#BFC3C8] uppercase font-sans">
            OUR PRODUCTS
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold text-white font-serif">
            Skincare That Works
          </h1>
          <p className="text-xs sm:text-sm text-[#AEB6C2]">
            Science-backed formulas for real results
          </p>
        </div>

        <div className="relative z-10 text-right hidden md:block">
          <span className="text-xs font-bold tracking-[0.28em] text-[#D8D8D8] uppercase font-sans">
            BEAUTY IN CONFIDENCE
          </span>
        </div>
      </div>

      {/* 2. CATEGORY TABS PILL ROW */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-white text-[#071426] font-bold shadow'
                : 'bg-[#0B192D] text-[#AEB6C2] border border-white/10 hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. TWO-COLUMN LAYOUT: SIDEBAR FILTERS + MAIN PRODUCTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SIDEBAR: FILTERS */}
        <div className="hidden lg:block lg:col-span-3 bg-[#0B192D] border border-white/10 rounded-3xl p-6 space-y-6 shadow-card-dark text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white tracking-wide">Filters</h3>
            <ChevronDown className="w-4 h-4 text-[#8994A3]" />
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white">Price Range</h4>
            <input
              type="range"
              min="0"
              max="2000"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
            <div className="flex justify-between text-[#8994A3] text-[11px]">
              <span>₹0</span>
              <span>₹{priceMax}</span>
            </div>
          </div>

          {/* Category Checkboxes */}
          <div className="space-y-2.5 pt-2 border-t border-white/5">
            <h4 className="font-semibold text-white">Category</h4>
            <div className="space-y-2">
              {categoryList.map((c) => (
                <label key={c.name} className="flex items-center space-x-2.5 text-[#AEB6C2] hover:text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(c.name)}
                    onChange={() => toggleFilter(c.name)}
                    className="w-3.5 h-3.5 rounded bg-[#071426] border-white/20 accent-white"
                  />
                  <span>{c.name} ({c.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Skin Type Checkboxes */}
          <div className="space-y-2.5 pt-2 border-t border-white/5">
            <h4 className="font-semibold text-white">Skin Type</h4>
            <div className="space-y-2">
              {skinTypes.map((s) => (
                <label key={s.name} className="flex items-center space-x-2.5 text-[#AEB6C2] hover:text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(s.name)}
                    onChange={() => toggleFilter(s.name)}
                    className="w-3.5 h-3.5 rounded bg-[#071426] border-white/20 accent-white"
                  />
                  <span>{s.name} ({s.count})</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT MAIN CONTENT */}
        <div className="lg:col-span-9 space-y-4">
          {/* Top Sort & Count Bar */}
          <div className="flex items-center justify-between text-xs text-[#AEB6C2] px-1">
            <span>{filteredProducts.length} Product{filteredProducts.length !== 1 && 's'}</span>
            <div className="flex items-center space-x-2 bg-[#0B192D] border border-white/10 rounded-xl px-3 py-1.5">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Featured" className="bg-[#0B192D]">Featured</option>
                <option value="PriceLow" className="bg-[#0B192D]">Price: Low to High</option>
                <option value="PriceHigh" className="bg-[#0B192D]">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {loading ? (
              <div className="col-span-1 sm:col-span-2 py-20 text-center text-white/50">Loading products...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-1 sm:col-span-2 py-20 text-center text-white/50">No products found matching your filters.</div>
            ) : (
              filteredProducts.map((product) => {
                const isWishlisted = isInWishlist(product.id);
                // The frontend context expects the product object to have a specific shape
                // We'll normalize it for the cart context
                const normalizedProduct = {
                  ...product,
                  size: product.sizes?.[0]?.size || "Standard"
                };
                
                let imageUrl = JHODSY_ASSETS.serumWater; // fallback
                if (product.images && product.images.length > 0) {
                  imageUrl = product.images[0];
                } else if (product.variants && product.variants.length > 0 && product.variants[0].images && product.variants[0].images.length > 0) {
                  imageUrl = product.variants[0].images[0];
                } else if (product.image_url) {
                  imageUrl = product.image_url;
                }
                
                const mrp = Number(product.mrp || product.price);
                const price = Number(product.effective_price || product.price); // use offer-discounted price for display
                const originalPrice = Number(product.price); // admin-set price (shown as strikethrough if offer active)
                const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

                return (
                  <div key={product.id} className="bg-[#0B192D] border border-white/10 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-card-dark hover:border-white/25 transition group">
                    <div className="flex items-center justify-between mb-3">
                      {discount > 0 ? (
                        <span className="bg-white/15 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/10">
                          {discount}% OFF
                        </span>
                      ) : <div/>}
                      <button
                        onClick={() => toggleWishlist(normalizedProduct)}
                        className="w-8 h-8 rounded-full bg-[#071426] border border-white/10 flex items-center justify-center text-white hover:bg-white/15 transition"
                        aria-label="Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white text-white' : 'stroke-[2]'}`} />
                      </button>
                    </div>

                    <Link to={`/product/${product.id}`} className="w-full h-56 flex items-center justify-center p-2">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] group-hover:scale-105 transition duration-300"
                      />
                    </Link>

                    <div className="space-y-2 pt-3">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-base font-bold text-white group-hover:text-[#E7E7E7] transition truncate">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#AEB6C2] truncate">
                        {product.tagline || product.description || "A premium skincare product"}
                      </p>
                      <p className="text-[11px] text-[#8994A3] font-medium">
                        {normalizedProduct.size}
                      </p>

                      <div className="flex items-center space-x-1 pt-0.5">
                        <RatingStars rating={4.8} count={100} size="sm" />
                      </div>

                      <div className="flex items-baseline space-x-2 pt-1">
                        <span className="text-lg font-bold text-white">₹{price}</span>
                        {mrp > price && (
                          <span className="text-xs text-[#8994A3] line-through">₹{mrp}</span>
                        )}
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            addToCart(normalizedProduct, 1);
                            navigate('/cart');
                          }}
                          className="w-full py-3 rounded-full bg-white text-[#071426] text-xs font-bold tracking-wide hover:bg-[#F5F5F5] active:scale-95 transition shadow flex items-center justify-center space-x-1.5"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Promotional Banner Card */}
            <div className="bg-[#0B192D] border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-card-dark relative overflow-hidden group col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition duration-500">
                <img src={JHODSY_ASSETS.science} alt="Science" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B192D] via-[#0B192D]/70 to-transparent"></div>
              </div>

              <div className="relative z-10 space-y-2 pt-2">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#BFC3C8] uppercase">
                  ACTIVE DERMATOLOGY
                </span>
                <h3 className="text-2xl font-bold text-white font-serif leading-tight">
                  Science<br />Meets<br />Skincare
                </h3>
              </div>

              <div className="relative z-10 space-y-4 pt-12">
                <p className="text-xs text-[#AEB6C2] max-w-[200px]">
                  Advanced formulas for visible results.
                </p>
                <Link
                  to="/science"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-white hover:underline"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

