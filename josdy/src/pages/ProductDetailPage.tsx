import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Heart, Share2, Sun, Droplet, Sparkles, ShieldCheck, Minus, Plus, CheckCircle2, ShoppingBag } from 'lucide-react';
import { FAQS } from '../data/product';
import { JHODSY_ASSETS } from '../data/assets';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { RatingStars } from '../components/common/RatingStars';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'howTo' | 'ingredients' | 'reviews' | 'faq'>('desc');
  
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BACKEND_URL}/products/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.product) setProduct(d.product);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <h2 className="text-2xl font-serif text-white">Product Not Found</h2>
      <Link to="/shop" className="text-brand-green hover:underline">Return to Shop</Link>
    </div>
  );

  const isWishlisted = isInWishlist(product.id);
  
  const normalizedProduct = {
    ...product,
    size: product.sizes?.[0]?.size || "Standard"
  };

  const images = (product.images && product.images.length > 0) 
    ? product.images 
    : (product.variants && product.variants.length > 0 && product.variants[0].images && product.variants[0].images.length > 0)
      ? product.variants[0].images
      : [JHODSY_ASSETS.serumWater];
  const price = Number(product.effective_price || product.price);
  const mrp = Number(product.mrp || product.price);

  const handleAddToCart = () => {
    addToCart(normalizedProduct, quantity);
    navigate('/cart');
  };

  const handleBuyNow = () => {
    addToCart(normalizedProduct, quantity);
    navigate('/checkout/address');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10 select-none">
      {/* 1. BREADCRUMBS MATCHING DESKTOP SCREEN 3 */}
      <div className="flex items-center space-x-2 text-[10px] sm:text-xs text-[#8994A3] overflow-x-auto no-scrollbar whitespace-nowrap pb-2">
        <Link to="/" className="hover:text-white transition">Home</Link>
        <span>&gt;</span>
        <Link to="/shop" className="hover:text-white transition">Shop</Link>
        <span>&gt;</span>
        <span className="text-white font-medium truncate">{product.name}</span>
      </div>

      {/* 2. MAIN 2-COLUMN PRODUCT SHOWCASE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT: IMAGE GALLERY */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 sm:gap-6 items-center sm:items-start w-full">
          {/* Thumbnails (Horizontal on Mobile, Vertical on Desktop) */}
          <div className="flex sm:flex-col space-x-3 sm:space-x-0 sm:space-y-4 overflow-x-auto w-full sm:w-24 flex-shrink-0 no-scrollbar pb-2 sm:pb-0 px-1">
            {images.map((src: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-2 bg-[#0B192D] border flex-shrink-0 transition-all duration-300 ${
                  selectedImage === idx
                    ? 'border-white ring-2 ring-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)] scale-105'
                    : 'border-white/10 opacity-60 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-contain drop-shadow-md" />
              </button>
            ))}
          </div>

          {/* Large Hero Frame */}
          <div className="relative w-full aspect-square sm:aspect-auto sm:h-[500px] bg-gradient-to-b from-[#0B1E38]/90 to-[#071426] border border-white/10 rounded-[2rem] flex items-center justify-center p-8 overflow-hidden shadow-card-dark flex-1">
            <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full scale-150 pointer-events-none"></div>
            <button 
              onClick={() => toggleWishlist(normalizedProduct)}
              className="absolute top-4 right-4 sm:hidden w-10 h-10 bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center z-20"
            >
              <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.9)] relative z-10 transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* RIGHT: BUY BOX & PRODUCT DETAILS */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8 pb-20 sm:pb-0">
          <div className="space-y-4">
            {mrp > price && (
              <div className="flex items-center justify-between">
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-md uppercase tracking-widest">
                  Special Offer
                </span>
                <button 
                  onClick={() => toggleWishlist(normalizedProduct)}
                  className="hidden sm:flex items-center space-x-2 text-[#AEB6C2] hover:text-white transition"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  <span className="text-xs font-semibold">{isWishlisted ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            )}

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-white font-serif leading-tight">
                {product.name}
              </h1>
              <p className="text-sm sm:text-base text-[#AEB6C2] leading-relaxed">
                {product.tagline || product.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              <RatingStars rating={4.8} count={100} size="sm" />
              <span className="text-[#8994A3]">·</span>
              <span className="text-emerald-400 font-semibold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>In Stock</span>
              </span>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-white/20 via-white/10 to-transparent"></div>

          <div className="flex items-end space-x-4">
            <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              ₹{price}
            </span>
            {mrp > price && (
              <div className="flex flex-col pb-1">
                <span className="text-sm sm:text-base text-[#8994A3] line-through decoration-[#8994A3]/50">
                  ₹{mrp}
                </span>
                <span className="text-emerald-400 text-[10px] sm:text-xs font-bold">
                  You Save ₹{mrp - price}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-[#8994A3] uppercase tracking-wider">
                Size
              </label>
              <div>
                <button className="w-full py-3 rounded-xl bg-[#0B192D] border-2 border-white/50 text-white text-sm font-bold shadow-inner">
                  {normalizedProduct.size}
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-bold text-[#8994A3] uppercase tracking-wider">
                Quantity
              </label>
              <div className="flex items-center justify-between bg-[#0B192D] border border-white/15 rounded-xl px-4 py-2.5 w-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-[#AEB6C2] hover:text-white p-1"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-base font-bold text-white min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-[#AEB6C2] hover:text-white p-1"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="hidden sm:grid grid-cols-2 gap-4 pt-2">
            <button
              onClick={handleAddToCart}
              className="py-4 px-6 rounded-full bg-[#0B192D] border border-white/20 hover:border-white/40 hover:bg-[#0D223F] text-white text-sm font-bold tracking-wider transition-all shadow flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="py-4 px-6 rounded-full bg-white text-[#071426] text-sm font-bold tracking-wider hover:bg-[#F5F5F5] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 transition-all text-center"
            >
              Buy Now
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-2 pt-6">
            <div className="flex flex-col items-center text-center space-y-2 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-white/10 group-hover:border-white/30 transition-all">
                <Sun className="w-5 h-5 text-[#D8D8D8]" />
              </div>
              <span className="text-[10px] sm:text-xs text-[#AEB6C2] leading-tight font-medium">Brightens</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-white/10 group-hover:border-white/30 transition-all">
                <Droplet className="w-5 h-5 text-[#D8D8D8]" />
              </div>
              <span className="text-[10px] sm:text-xs text-[#AEB6C2] leading-tight font-medium">Evens Skin</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-white/10 group-hover:border-white/30 transition-all">
                <Sparkles className="w-5 h-5 text-[#D8D8D8]" />
              </div>
              <span className="text-[10px] sm:text-xs text-[#AEB6C2] leading-tight font-medium">Radiance</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-white/10 group-hover:border-white/30 transition-all">
                <ShieldCheck className="w-5 h-5 text-[#D8D8D8]" />
              </div>
              <span className="text-[10px] sm:text-xs text-[#AEB6C2] leading-tight font-medium">All Types</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#05080D]/90 backdrop-blur-xl border-t border-white/10 p-4 z-50 flex items-center justify-between gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col">
          <span className="text-xs text-[#8994A3] font-medium">Total Price</span>
          <span className="text-lg font-bold text-white">₹{price * quantity}</span>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button onClick={handleAddToCart} className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex flex-col items-center justify-center flex-shrink-0 active:bg-white/20 transition">
            <ShoppingBag className="w-5 h-5" />
          </button>
          <button onClick={handleBuyNow} className="flex-1 py-3.5 px-4 rounded-full bg-white text-[#071426] text-sm font-bold tracking-wide active:scale-95 transition text-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            Buy Now
          </button>
        </div>
      </div>

      <div className="bg-[#0B192D] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-card-dark">
        <div className="flex items-center space-x-6 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar text-xs sm:text-sm font-semibold">
          <button onClick={() => setActiveTab('desc')} className={`transition pb-1 ${activeTab === 'desc' ? 'text-white border-b-2 border-white font-bold' : 'text-[#8994A3] hover:text-white'}`}>
            Description
          </button>
          <button onClick={() => setActiveTab('howTo')} className={`transition pb-1 ${activeTab === 'howTo' ? 'text-white border-b-2 border-white font-bold' : 'text-[#8994A3] hover:text-white'}`}>
            How to Use
          </button>
          <button onClick={() => setActiveTab('ingredients')} className={`transition pb-1 ${activeTab === 'ingredients' ? 'text-white border-b-2 border-white font-bold' : 'text-[#8994A3] hover:text-white'}`}>
            Ingredients
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`transition pb-1 ${activeTab === 'reviews' ? 'text-white border-b-2 border-white font-bold' : 'text-[#8994A3] hover:text-white'}`}>
            Reviews
          </button>
          <button onClick={() => setActiveTab('faq')} className={`transition pb-1 ${activeTab === 'faq' ? 'text-white border-b-2 border-white font-bold' : 'text-[#8994A3] hover:text-white'}`}>
            FAQ
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-3 text-xs sm:text-sm text-[#AEB6C2] leading-relaxed">
            {activeTab === 'desc' && (
              <div className="space-y-3">
                <h4 className="font-bold text-white text-base font-serif">Product Description</h4>
                <p>{product.description}</p>
                {(product.benefits || []).length > 0 && (
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {product.benefits.map((b: string, i: number) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            )}
            {activeTab === 'howTo' && (
              <div className="space-y-3">
                <h4 className="font-bold text-white text-base font-serif">Application Routine</h4>
                {(product.how_to_use || product.howToUse || []).length > 0 ? (
                  <ol className="list-decimal list-inside space-y-2">
                    {(product.how_to_use || product.howToUse).map((s: string, i: number) => <li key={i}>{s}</li>)}
                  </ol>
                ) : <p>No instructions provided.</p>}
              </div>
            )}
            {activeTab === 'ingredients' && (
              <div className="space-y-3">
                <h4 className="font-bold text-white text-base font-serif">Active Ingredients</h4>
                {(product.ingredients || []).length > 0 ? (
                  <ul className="list-disc list-inside space-y-1.5">
                    {product.ingredients.map((ing: string, i: number) => <li key={i}>{ing}</li>)}
                  </ul>
                ) : <p>No ingredients listed.</p>}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <h4 className="font-bold text-white text-base font-serif">Customer Reviews</h4>
                <p className="text-white/50 text-sm">No reviews yet.</p>
              </div>
            )}
            {activeTab === 'faq' && (
              <div className="space-y-3">
                <h4 className="font-bold text-white text-base font-serif">Frequently Asked Questions</h4>
                <div className="space-y-2">
                  {FAQS.slice(0, 3).map((f, i) => (
                    <div key={i} className="border-b border-white/5 pb-2">
                      <p className="font-semibold text-white">{f.q}</p>
                      <p className="text-[#AEB6C2] mt-0.5">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 bg-[#071426] border border-white/10 rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-white text-xs tracking-wider uppercase">Why Choose JHODSY?</h4>
            <div className="space-y-2 text-xs text-[#E7E7E7]">
              <div className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Dermatologically inspired</span></div>
              <div className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Premium quality ingredients</span></div>
              <div className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Safe for all skin types</span></div>
              <div className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Visible results in weeks</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
