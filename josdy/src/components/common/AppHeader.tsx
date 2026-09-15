import React from 'react';
import { ArrowLeft, Search, ShoppingCart, Heart, Share2, Menu } from 'lucide-react';
import { ScreenId } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { PRIMARY_PRODUCT } from '../../data/product';
import { JHODSY_ASSETS } from '../../data/assets';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onNavigate?: (screen: ScreenId) => void;
  rightAction?: 'cart' | 'search-cart' | 'heart-share' | 'none';
  customLogo?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  onNavigate,
  rightAction = 'cart',
  customLogo = false
}) => {
  const { totalCount } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(PRIMARY_PRODUCT.id);

  return (
    <header className="w-full px-5 py-3 flex items-center justify-between z-30 select-none border-b border-white/5 bg-[#071426]/90 backdrop-blur-md sticky top-0">
      {/* Left side */}
      <div className="flex items-center space-x-3">
        {showBack ? (
          <button
            onClick={onBack}
            className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 active:scale-95 transition"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>
        ) : customLogo ? (
          <button
            onClick={() => onNavigate?.('more')}
            className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 active:scale-95 transition"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 stroke-[2]" />
          </button>
        ) : null}

        {customLogo && (
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => onNavigate?.('home')}>
            <img src={JHODSY_ASSETS.logoSymbol} alt="JHODSY Logo" className="w-5 h-5 object-contain" />
            <span className="font-bold tracking-[0.2em] text-sm text-white font-sans">JHODSY</span>
          </div>
        )}

        {!customLogo && title && (
          <h1 className="text-base font-semibold text-white tracking-wide">{title}</h1>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3">
        {rightAction === 'search-cart' && (
          <>
            <button
              onClick={() => onNavigate?.('search')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition"
              aria-label="Search"
            >
              <Search className="w-4 h-4 stroke-[2]" />
            </button>
            <button
              onClick={() => onNavigate?.('cart')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition relative"
              aria-label="Cart"
            >
              <ShoppingCart className="w-4 h-4 stroke-[2]" />
              {totalCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 bg-white text-[#071426] text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>
          </>
        )}

        {rightAction === 'cart' && !customLogo && (
          <button
            onClick={() => onNavigate?.('cart')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition relative"
            aria-label="Cart"
          >
            <ShoppingCart className="w-4 h-4 stroke-[2]" />
            {totalCount > 0 && (
              <span className="absolute 0 top-0.5 right-0.5 bg-white text-[#071426] text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </button>
        )}

        {rightAction === 'cart' && customLogo && (
          <button
            onClick={() => onNavigate?.('cart')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition relative"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5 stroke-[2]" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-[#071426] text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {totalCount}
              </span>
            )}
          </button>
        )}

        {rightAction === 'heart-share' && (
          <>
            <button
              onClick={() => toggleWishlist(PRIMARY_PRODUCT)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 transition"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white text-white' : 'stroke-[2]'}`} />
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'JHODSY Brightening Serum',
                    text: 'Check out JHODSY Brightening Serum - Skin That Defines You',
                    url: window.location.href
                  }).catch(() => {});
                }
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 transition"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4 stroke-[2]" />
            </button>
          </>
        )}
      </div>
    </header>
  );
};
