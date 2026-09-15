import React from 'react';
import { StatusBar } from '../components/common/StatusBar';
import { AppHeader } from '../components/common/AppHeader';
import { ScreenId } from '../types';
import { Heart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { RatingStars } from '../components/common/RatingStars';
import { JHODSY_ASSETS } from '../data/assets';

interface ScreenWishlistProps {
  onNavigate: (screen: ScreenId) => void;
  onShowToast?: (msg: string) => void;
}

export const Screen_Wishlist: React.FC<ScreenWishlistProps> = ({ onNavigate, onShowToast }) => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="relative w-full h-full bg-[#05080D] flex flex-col justify-between overflow-hidden select-none">
      <StatusBar time="9:41" />

      {/* Header */}
      <AppHeader
        title="Wishlist"
        showBack={true}
        onBack={() => onNavigate('account')}
        onNavigate={onNavigate}
        rightAction="cart"
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-4 no-scrollbar">
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#0B192D] border border-white/10 flex items-center justify-center text-white">
              <Heart className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Your wishlist is waiting</h3>
              <p className="text-[12px] text-[#8994A3] mt-1 max-w-[220px]">
                Start adding products you love.
              </p>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="py-2.5 px-6 rounded-full bg-white text-[#071426] text-[13px] font-semibold hover:bg-[#F5F5F5] transition"
            >
              Explore Skincare
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {wishlist.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate('product')}
                className="bg-[#0B192D] border border-white/10 rounded-2xl p-3.5 flex items-center space-x-3.5 cursor-pointer hover:border-white/20 transition shadow-card-dark"
              >
                <div className="w-18 h-18 bg-[#071426] rounded-xl flex items-center justify-center p-1 relative flex-shrink-0">
                  <img src={JHODSY_ASSETS.serumFront} alt={item.name} className="w-16 h-16 object-contain" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-[13px] font-bold text-white truncate">{item.name}</h4>
                  <div className="my-1">
                    <RatingStars rating={item.rating} count={item.reviewCount} size="sm" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-[14px] font-bold text-white">₹{item.price}</span>
                    <span className="text-[11px] text-[#8994A3] line-through">₹{item.mrp}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(item);
                    }}
                    className="text-[#8994A3] hover:text-white p-1"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4 stroke-[1.8]" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item, 1);
                      onShowToast?.('Added to cart');
                    }}
                    className="py-1 px-2.5 rounded-full bg-white text-[#071426] text-[10px] font-bold"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* iPhone Home Indicator */}
      <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mb-2"></div>
    </div>
  );
};
