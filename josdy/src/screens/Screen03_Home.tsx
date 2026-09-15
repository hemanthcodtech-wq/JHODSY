import React from 'react';
import { StatusBar } from '../components/common/StatusBar';
import { AppHeader } from '../components/common/AppHeader';
import { BottomNavigation } from '../components/common/BottomNavigation';
import { ScreenId } from '../types';
import { Search, Sparkles, Sun, ShieldCheck, UserCheck, User, Droplet, Star } from 'lucide-react';
import { PRIMARY_PRODUCT } from '../data/product';
import { JHODSY_ASSETS } from '../data/assets';
import { useCart } from '../context/CartContext';

interface Screen03HomeProps {
  onNavigate: (screen: ScreenId) => void;
}

export const Screen03_Home: React.FC<Screen03HomeProps> = ({ onNavigate }) => {
  const { addToCart } = useCart();

  return (
    <div className="relative w-full h-full bg-[#05080D] flex flex-col justify-between overflow-hidden select-none">
      <StatusBar time="9:41" />

      {/* Top Header */}
      <AppHeader
        customLogo={true}
        onNavigate={onNavigate}
        rightAction="cart"
      />

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-6 space-y-4 no-scrollbar">
        {/* Search Bar */}
        <div
          onClick={() => onNavigate('search')}
          className="w-full bg-[#0D1B30]/80 border border-white/10 rounded-full px-4 py-2.5 flex items-center space-x-2.5 cursor-pointer hover:border-white/20 transition"
        >
          <Search className="w-4 h-4 text-[#8994A3] stroke-[2]" />
          <span className="text-[12px] text-[#8994A3] tracking-wide">
            Search skincare products...
          </span>
        </div>

        {/* Hero Banner Card */}
        <div className="relative w-full bg-gradient-to-br from-[#0B1E38] via-[#071426] to-[#05080D] border border-white/10 rounded-2xl p-4 overflow-hidden shadow-card-dark">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#183B6B]/40 blur-2xl rounded-full pointer-events-none"></div>

          <div className="flex items-center justify-between relative z-10">
            {/* Left Content */}
            <div className="w-[58%] pr-2">
              <span className="text-[9px] font-bold tracking-[0.18em] text-[#BFC3C8] uppercase block mb-1">
                JHODSY BRIGHTENING SERUM
              </span>
              <h2 className="text-[19px] font-bold text-white leading-tight font-serif mb-2.5">
                Reveal a<br />Brighter You
              </h2>

              {/* Benefit Mini Chips */}
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex flex-col items-center text-center">
                  <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-0.5">
                    <Sun className="w-3 h-3 text-[#D8D8D8]" />
                  </div>
                  <span className="text-[7.5px] text-[#AEB6C2] font-medium leading-tight">
                    Brighten<br />Skin Tone
                  </span>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-0.5">
                    <Droplet className="w-3 h-3 text-[#D8D8D8]" />
                  </div>
                  <span className="text-[7.5px] text-[#AEB6C2] font-medium leading-tight">
                    Evens<br />Complexion
                  </span>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-0.5">
                    <Sparkles className="w-3 h-3 text-[#D8D8D8]" />
                  </div>
                  <span className="text-[7.5px] text-[#AEB6C2] font-medium leading-tight">
                    Radiant<br />Glow
                  </span>
                </div>
              </div>

              {/* Shop Now CTA */}
              <button
                onClick={() => onNavigate('product')}
                className="py-1.5 px-3.5 rounded-full bg-white text-[#071426] text-[11px] font-semibold tracking-wide hover:bg-[#F5F5F5] active:scale-95 transition flex items-center space-x-1 shadow-md"
              >
                <span>Shop Now</span>
                <span>→</span>
              </button>
            </div>

            {/* Right Serum Bottle + Splash Visual */}
            <div className="w-[42%] flex items-center justify-center">
              <img
                src={JHODSY_ASSETS.heroSplash}
                alt="JHODSY Serum"
                className="w-full h-auto max-h-[145px] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]"
              />
            </div>
          </div>
        </div>

        {/* Hero Pagination Dots */}
        <div className="flex items-center justify-center space-x-1.5 -mt-1">
          <div className="w-3.5 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white/30 rounded-full"></div>
          <div className="w-1 h-1 bg-white/30 rounded-full"></div>
        </div>

        {/* Quick Categories (4 Tiles) */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          <button
            onClick={() => onNavigate('shop')}
            className="bg-[#0B192D] border border-white/10 hover:border-white/20 rounded-xl py-2.5 px-1 flex flex-col items-center justify-center space-y-1.5 transition active:scale-95"
          >
            <Droplet className="w-4 h-4 text-[#D8D8D8] stroke-[1.8]" />
            <span className="text-[9.5px] text-[#BFC3C8] font-medium tracking-tight">Skincare</span>
          </button>

          <button
            onClick={() => onNavigate('shop')}
            className="bg-[#0B192D] border border-white/10 hover:border-white/20 rounded-xl py-2.5 px-1 flex flex-col items-center justify-center space-y-1.5 transition active:scale-95"
          >
            <UserCheck className="w-4 h-4 text-[#D8D8D8] stroke-[1.8]" />
            <span className="text-[9.5px] text-[#BFC3C8] font-medium tracking-tight">For Men</span>
          </button>

          <button
            onClick={() => onNavigate('shop')}
            className="bg-[#0B192D] border border-white/10 hover:border-white/20 rounded-xl py-2.5 px-1 flex flex-col items-center justify-center space-y-1.5 transition active:scale-95"
          >
            <User className="w-4 h-4 text-[#D8D8D8] stroke-[1.8]" />
            <span className="text-[9.5px] text-[#BFC3C8] font-medium tracking-tight">For Women</span>
          </button>

          <button
            onClick={() => onNavigate('shop')}
            className="bg-[#0B192D] border border-white/10 hover:border-white/20 rounded-xl py-2.5 px-1 flex flex-col items-center justify-center space-y-1.5 transition active:scale-95"
          >
            <ShieldCheck className="w-4 h-4 text-[#D8D8D8] stroke-[1.8]" />
            <span className="text-[9.5px] text-[#BFC3C8] font-medium tracking-tight">All Skin Types</span>
          </button>
        </div>

        {/* Featured Campaign Banner ("Confidence Looks Good On Everyone") */}
        <div
          onClick={() => onNavigate('about')}
          className="relative w-full bg-[#0B192D] border border-white/10 rounded-2xl p-3.5 flex items-center justify-between overflow-hidden cursor-pointer hover:border-white/20 transition"
        >
          <div className="w-[52%] pr-1">
            <h3 className="text-[14px] font-bold text-white font-serif leading-tight mb-1">
              Confidence<br />Looks Good<br />On Everyone
            </h3>
            <span className="text-[10px] text-[#AEB6C2] tracking-wide block">
              Unisex Skincare Formula
            </span>
          </div>

          <div className="w-[48%] h-20 rounded-xl overflow-hidden relative">
            <img
              src={JHODSY_ASSETS.menWomen}
              alt="Skincare for Everyone"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B192D] via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Bestseller Section */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[13px] font-semibold text-white tracking-wide">Bestseller</h3>
            <button
              onClick={() => onNavigate('shop')}
              className="text-[11px] text-[#AEB6C2] hover:text-white transition"
            >
              See All
            </button>
          </div>

          {/* Product Card */}
          <div
            onClick={() => onNavigate('product')}
            className="bg-[#0B192D] border border-white/10 rounded-2xl p-3 flex items-center space-x-3 cursor-pointer hover:border-white/20 transition"
          >
            <div className="w-20 h-20 bg-[#071426] rounded-xl flex items-center justify-center p-1 relative flex-shrink-0">
              <span className="absolute top-1 left-1 bg-white/20 backdrop-blur-sm text-[8px] font-bold text-white px-1.5 py-0.5 rounded">
                30% OFF
              </span>
              <img
                src={JHODSY_ASSETS.serumFront}
                alt="JHODSY Serum"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-[13px] font-semibold text-white truncate">
                JHODSY Brightening Serum
              </h4>
              <p className="text-[10px] text-[#8994A3] truncate mb-1">
                30ml · Radiant Glow Formula
              </p>

              <div className="flex items-baseline space-x-2 mb-1.5">
                <span className="text-[14px] font-bold text-white">₹559</span>
                <span className="text-[11px] text-[#8994A3] line-through">₹799</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-white text-white" />
                  <span className="text-[10px] font-semibold text-white">4.8</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(PRIMARY_PRODUCT, 1);
                  }}
                  className="py-1 px-3 bg-white text-[#071426] text-[10px] font-semibold rounded-full hover:bg-[#E7E7E7] active:scale-95 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentScreen="home" onNavigate={onNavigate} />

      {/* iPhone Home Indicator */}
      <div className="w-32 h-1 bg-white/30 rounded-full mx-auto -mt-3 mb-1.5 z-50 pointer-events-none"></div>
    </div>
  );
};
