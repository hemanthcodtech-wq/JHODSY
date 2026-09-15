import React, { useState } from 'react';
import { StatusBar } from '../components/common/StatusBar';
import { AppHeader } from '../components/common/AppHeader';
import { ScreenId } from '../types';
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { PRIMARY_PRODUCT } from '../data/product';
import { JHODSY_ASSETS } from '../data/assets';
import { useCart } from '../context/CartContext';

interface ScreenSearchProps {
  onNavigate: (screen: ScreenId) => void;
}

export const Screen_Search: React.FC<ScreenSearchProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const { addToCart } = useCart();

  const recentSearches = ['Brightening Serum', 'Face Serum', 'Radiant Glow'];
  const popularTags = ['Brightening Serum', 'Face Serum', 'Skincare', 'Glow', 'Even Skin Tone', '30ml'];

  const matches = query.trim()
    ? [PRIMARY_PRODUCT].filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.benefits.some(b => b.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="relative w-full h-full bg-[#05080D] flex flex-col justify-between overflow-hidden select-none">
      <StatusBar time="9:41" />

      {/* Header */}
      <AppHeader
        title="Search"
        showBack={true}
        onBack={() => onNavigate('home')}
        onNavigate={onNavigate}
        rightAction="none"
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-4 no-scrollbar">
        {/* Search Input Box */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-[#8994A3]" />
          </div>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skincare products..."
            className="w-full bg-[#0B192D] border border-white/10 rounded-2xl pl-10 pr-10 py-3 text-[13px] text-white placeholder-[#8994A3] focus:outline-none focus:border-white/30"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8994A3] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results or Suggestions */}
        {query.trim() ? (
          <div className="space-y-3 pt-1">
            <h3 className="text-[12px] font-semibold text-[#AEB6C2] px-1">
              Search Results ({matches.length})
            </h3>
            {matches.length > 0 ? (
              matches.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onNavigate('product')}
                  className="bg-[#0B192D] border border-white/10 rounded-2xl p-3 flex items-center space-x-3 cursor-pointer hover:border-white/20 transition"
                >
                  <div className="w-16 h-16 bg-[#071426] rounded-xl flex items-center justify-center p-1 flex-shrink-0">
                    <img src={JHODSY_ASSETS.serumFront} alt={product.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-bold text-white truncate">{product.name}</h4>
                    <p className="text-[11px] text-[#8994A3]">{product.size} · ₹{product.price}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8994A3]" />
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-[#8994A3] text-[12px]">
                No products found matching "{query}".
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5 pt-2">
            {/* Recent Searches */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[12px] font-semibold text-[#AEB6C2]">
                <Clock className="w-3.5 h-3.5" />
                <span>Recent Searches</span>
              </div>
              <div className="space-y-1">
                {recentSearches.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(item)}
                    className="w-full text-left py-2 px-3 rounded-xl bg-[#0B192D]/60 hover:bg-[#0B192D] text-[12px] text-white flex items-center justify-between transition"
                  >
                    <span>{item}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8994A3]" />
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Searches */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[12px] font-semibold text-[#AEB6C2]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Popular Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-full bg-[#0B192D] border border-white/10 text-[11px] text-[#D8D8D8] hover:text-white hover:border-white/25 transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* iPhone Home Indicator */}
      <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mb-2"></div>
    </div>
  );
};
