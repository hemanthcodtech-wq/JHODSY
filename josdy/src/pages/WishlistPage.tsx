import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { RatingStars } from '../components/common/RatingStars';
import { JHODSY_ASSETS } from '../data/assets';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif">
          My Wishlist ({wishlist.length})
        </h1>
        <p className="text-xs sm:text-sm text-[#AEB6C2]">Saved formulations you love</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-16 sm:py-24 space-y-6 max-w-md mx-auto bg-[#0B192D] border border-white/10 rounded-3xl p-8 shadow-card-dark">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white">
            <Heart className="w-10 h-10 stroke-[1.5]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Your wishlist is currently empty</h2>
            <p className="text-xs sm:text-sm text-[#AEB6C2]">
              Explore our range of luxury skincare and save your favorite essentials.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-block px-8 py-3.5 rounded-full bg-white text-[#071426] text-sm font-bold tracking-wide hover:bg-[#F5F5F5] transition shadow-lg"
          >
            Explore Formulations →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-[#0B192D] border border-white/10 rounded-3xl p-6 space-y-4 shadow-card-dark flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#BFC3C8] uppercase tracking-wider">
                  {item.category} · {item.size}
                </span>
                <button
                  onClick={() => toggleWishlist(item)}
                  className="p-1.5 text-[#8994A3] hover:text-rose-400 transition"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <Link
                to={`/product/${item.id}`}
                className="w-full h-52 flex items-center justify-center bg-[#071426] rounded-2xl p-4"
              >
                <img src={JHODSY_ASSETS.serumFront} alt={item.name} className="w-full h-full object-contain" />
              </Link>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="text-base font-bold text-white hover:underline truncate">{item.name}</h3>
                  </Link>
                </div>

                <div className="flex items-center space-x-2">
                  <RatingStars rating={item.rating} count={item.reviewCount} size="sm" />
                </div>

                <div className="flex items-baseline space-x-2 pt-1">
                  <span className="text-xl font-bold text-white">₹{item.price}</span>
                  <span className="text-xs text-[#8994A3] line-through">₹{item.mrp}</span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      addToCart(item, 1);
                      navigate('/cart');
                    }}
                    className="w-full py-3 rounded-full bg-white text-[#071426] text-xs sm:text-sm font-bold tracking-wide hover:bg-[#F5F5F5] active:scale-95 transition shadow text-center"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
