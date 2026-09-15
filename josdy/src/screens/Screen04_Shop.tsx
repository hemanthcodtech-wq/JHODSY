import React, { useState } from 'react';
import { StatusBar } from '../components/common/StatusBar';
import { AppHeader } from '../components/common/AppHeader';
import { BottomNavigation } from '../components/common/BottomNavigation';
import { ScreenId } from '../types';
import { Heart, ChevronDown } from 'lucide-react';
import { PRIMARY_PRODUCT, CATEGORIES } from '../data/product';
import { JHODSY_ASSETS } from '../data/assets';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { RatingStars } from '../components/common/RatingStars';

interface Screen04ShopProps {
  onNavigate: (screen: ScreenId) => void;
}

export const Screen04_Shop: React.FC<Screen04ShopProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(PRIMARY_PRODUCT.id);

  return (
    <div className="relative w-full h-full bg-[#05080D] flex flex-col justify-between overflow-hidden select-none">
      <StatusBar time="9:41" />

      {/* Header */}
      <AppHeader
        title="Skincare"
        showBack={true}
        onBack={() => onNavigate('home')}
        onNavigate={onNavigate}
        rightAction="search-cart"
      />

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-3.5 no-scrollbar">
        {/* Category Pill Selector */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-white text-[#071426] font-semibold shadow-md'
                  : 'bg-[#0B192D] text-[#8994A3] border border-white/10 hover:border-white/20'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Count & Sort Bar */}
        <div className="flex items-center justify-between text-[11px] text-[#8994A3] px-1 pt-1">
          <span>1 Product</span>
          <button className="flex items-center space-x-1 text-[#D8D8D8] hover:text-white">
            <span>Sort</span>
            <ChevronDown className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        </div>

        {/* Featured Luxury Product Card */}
        <div
          onClick={() => onNavigate('product')}
          className="relative w-full bg-[#0B192D] border border-white/10 rounded-2xl p-4 overflow-hidden shadow-card-dark cursor-pointer hover:border-white/20 transition"
        >
          {/* Card Top Bar (Discount Badge & Heart Wishlist) */}
          <div className="flex items-center justify-between mb-2">
            <span className="bg-white/15 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/10">
              25% OFF
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(PRIMARY_PRODUCT);
              }}
              className="w-8 h-8 rounded-full bg-[#071426]/80 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition"
              aria-label="Wishlist"
            >
              <Heart
                className={`w-4 h-4 ${isWishlisted ? 'fill-white text-white' : 'stroke-[2]'}`}
              />
            </button>
          </div>

          {/* Large Clean Product Image */}
          <div className="w-full h-44 flex items-center justify-center my-1 relative">
            <div className="absolute inset-0 bg-[#163660]/20 blur-xl rounded-full scale-90 pointer-events-none"></div>
            <img
              src={JHODSY_ASSETS.serumFront}
              alt="JHODSY Brightening Serum"
              className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] relative z-10"
            />
          </div>

          {/* Product Details */}
          <div className="pt-2">
            <h3 className="text-[15px] font-bold text-white tracking-wide">
              JHODSY Brightening Serum
            </h3>
            <p className="text-[11px] text-[#8994A3] mt-0.5">
              For brighter, even-toned skin
            </p>
            <p className="text-[10px] text-[#BFC3C8] mt-0.5 font-medium">
              30ml
            </p>

            {/* Price & Rating */}
            <div className="flex items-center justify-between mt-2 mb-3">
              <div className="flex items-baseline space-x-2">
                <span className="text-[18px] font-bold text-white tracking-tight">₹559</span>
                <span className="text-[12px] text-[#8994A3] line-through">₹799</span>
              </div>

              <div className="flex items-center space-x-1">
                <RatingStars rating={4.8} count={120} size="sm" />
              </div>
            </div>

            {/* Full Width Primary Add To Cart CTA */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(PRIMARY_PRODUCT, 1);
              }}
              className="w-full py-2.5 rounded-full bg-white text-[#071426] text-[13px] font-semibold tracking-wide hover:bg-[#F5F5F5] active:scale-[0.98] transition shadow-md"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentScreen="shop" onNavigate={onNavigate} />

      {/* iPhone Home Indicator */}
      <div className="w-32 h-1 bg-white/30 rounded-full mx-auto -mt-3 mb-1.5 z-50 pointer-events-none"></div>
    </div>
  );
};
