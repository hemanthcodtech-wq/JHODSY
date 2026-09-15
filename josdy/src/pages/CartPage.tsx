import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShieldCheck, RotateCcw, Award, Headphones, ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { JHODSY_ASSETS } from '../data/assets';

export const CartPage: React.FC = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    shipping,
    discount,
    total,
    appliedCoupon,
    couponDiscountPercentage,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { toggleWishlist } = useWishlist();
  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const success = await applyCoupon(inputCoupon);
    if (success) {
      setCouponError(null);
      setInputCoupon('');
    } else {
      setCouponError('Invalid or expired coupon code.');
    }
  };

  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 select-none">
      {/* 1. HEADER MATCHING DESKTOP SCREEN 4 */}
      <div className="space-y-1 border-b border-white/10 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif">
          Your Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
        </h1>
        <p className="text-xs text-[#AEB6C2]">
          Review your items before checkout
        </p>
      </div>

      {isCartEmpty ? (
        <div className="text-center py-16 sm:py-24 space-y-6 max-w-md mx-auto bg-[#0B192D] border border-white/10 rounded-3xl p-8 shadow-card-dark">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Your cart is empty</h2>
            <p className="text-xs sm:text-sm text-[#AEB6C2]">
              Discover our signature JHODSY Brightening Serum for radiant, glowing skin.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-block px-8 py-3.5 rounded-full bg-white text-[#071426] text-xs sm:text-sm font-bold tracking-wide hover:bg-[#F5F5F5] transition shadow-lg"
          >
            Shop Skincare Essentials →
          </Link>
        </div>
      ) : (
        /* 2. TWO-COLUMN LAYOUT MATCHING DESKTOP SCREEN 4 */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: CART ITEM CARDS + COUPON + 4 TRUST BADGES */}
          <div className="lg:col-span-8 space-y-6">
            {/* Cart Product Rows */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-[#0B192D] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-card-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4 sm:space-x-6">
                    {/* Thumbnail Box */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#071426] rounded-2xl flex items-center justify-center p-2 flex-shrink-0 border border-white/5">
                      <img
                        src={
                          (item.product as any).images?.[0] ||
                          (item.product as any).variants?.[0]?.images?.[0] ||
                          JHODSY_ASSETS.heroSplash
                        }
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Info */}
                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-[#8994A3]">{item.size}</p>
                      <div className="flex items-baseline space-x-2 pt-1">
                        <span className="text-base sm:text-lg font-bold text-white">
                          ₹{item.product.price}
                        </span>
                        {item.product.mrp > item.product.price && (
                          <span className="text-xs text-[#8994A3] line-through">₹{item.product.mrp}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper & Actions */}
                  <div className="flex flex-col sm:items-end space-y-3 pt-2 sm:pt-0 border-t sm:border-none border-white/5">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center bg-[#071426] border border-white/10 rounded-xl px-3 py-1 space-x-3">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="text-[#AEB6C2] hover:text-white"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-white min-w-[14px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="text-[#AEB6C2] hover:text-white"
                          aria-label="Increase"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#8994A3] hover:text-rose-400 transition p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4 stroke-[1.8]" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-[#AEB6C2]">
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="hover:text-white flex items-center space-x-1"
                      >
                        <span>Remove</span>
                      </button>
                      <span>·</span>
                      <button
                        onClick={() => {
                          toggleWishlist(item.product);
                          removeFromCart(item.product.id);
                        }}
                        className="hover:text-white flex items-center space-x-1"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>Move to Wishlist</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Box Matching Reference */}
            <div className="bg-[#0B192D] border border-white/10 rounded-2xl p-5 space-y-3 shadow-card-dark">
              <span className="text-xs font-medium text-[#AEB6C2] block">
                Have a coupon code?
              </span>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-white/5 border border-white/20 rounded-xl px-3.5 py-2">
                  <span className="text-xs font-bold text-white tracking-wider">
                    {appliedCoupon} ({couponDiscountPercentage}% Savings Applied)
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-[#AEB6C2] hover:text-white underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 bg-[#071426] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#8994A3] focus:outline-none uppercase tracking-wider"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/15 text-white text-xs font-bold transition"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-xs text-rose-400 mt-2">{couponError}</p>}
            </div>

            {/* 4 Trust Badges in a Row at Bottom of Left Column */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-[#0B192D] border border-white/10 rounded-2xl p-4 text-center flex flex-col items-center space-y-1">
                <ShieldCheck className="w-5 h-5 text-white stroke-[1.8]" />
                <h4 className="text-xs font-bold text-white">Secure Shopping</h4>
                <p className="text-[10px] text-[#8994A3]">100% Safe & Secure</p>
              </div>

              <div className="bg-[#0B192D] border border-white/10 rounded-2xl p-4 text-center flex flex-col items-center space-y-1">
                <RotateCcw className="w-5 h-5 text-white stroke-[1.8]" />
                <h4 className="text-xs font-bold text-white">Easy Returns</h4>
                <p className="text-[10px] text-[#8994A3]">Hassle Free Returns</p>
              </div>

              <div className="bg-[#0B192D] border border-white/10 rounded-2xl p-4 text-center flex flex-col items-center space-y-1">
                <Award className="w-5 h-5 text-white stroke-[1.8]" />
                <h4 className="text-xs font-bold text-white">Original Products</h4>
                <p className="text-[10px] text-[#8994A3]">100% Authentic</p>
              </div>

              <div className="bg-[#0B192D] border border-white/10 rounded-2xl p-4 text-center flex flex-col items-center space-y-1">
                <Headphones className="w-5 h-5 text-white stroke-[1.8]" />
                <h4 className="text-xs font-bold text-white">24/7 Support</h4>
                <p className="text-[10px] text-[#8994A3]">We're Here To Help</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY + PAYMENT ICONS + BRAND TEXTURE CARD */}
          <div className="lg:col-span-4 space-y-5">
            {/* Order Summary Card */}
            <div className="bg-[#0B192D] border border-white/10 rounded-3xl p-6 space-y-4 shadow-card-dark text-xs sm:text-sm">
              <h3 className="font-bold text-white text-base tracking-wide border-b border-white/10 pb-3">
                Order Summary
              </h3>

              <div className="flex justify-between text-[#AEB6C2]">
                <span>Subtotal</span>
                <span className="text-white font-medium">₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-[#AEB6C2]">
                <span>Discount {appliedCoupon ? `(${couponDiscountPercentage}%)` : ''}</span>
                <span className="text-emerald-400 font-semibold">- ₹{discount}</span>
              </div>

              <div className="flex justify-between text-[#AEB6C2]">
                <span>Shipping</span>
                <span className="text-white font-medium">Free</span>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-baseline font-bold text-white">
                <span className="text-sm">Total</span>
                <span className="text-2xl font-extrabold">₹{total}</span>
              </div>

              <button
                onClick={() => navigate('/checkout/address')}
                className="w-full py-4 rounded-full bg-white text-[#071426] text-sm font-bold tracking-wide hover:bg-[#F5F5F5] active:scale-95 transition shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <span>→</span>
              </button>

              {/* Payment Methods Badges */}
              <div className="pt-2 space-y-2 border-t border-white/5">
                <span className="text-[10px] text-[#8994A3] block">We accept:</span>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded bg-white text-[#071426] text-[10px] font-black tracking-wider">VISA</span>
                  <span className="px-2.5 py-1 rounded bg-white text-[#EB001B] text-[10px] font-black">MC</span>
                  <span className="px-2.5 py-1 rounded bg-white text-[#0B192D] text-[10px] font-extrabold">UPI</span>
                  <span className="px-2.5 py-1 rounded bg-white text-[#002970] text-[10px] font-black">Paytm</span>
                </div>
              </div>
            </div>

            {/* Brand Card at Bottom of Right Column */}
            <div className="relative rounded-3xl overflow-hidden bg-[#071426] border border-white/10 p-6 flex items-center space-x-4 shadow-card-dark">
              <div className="absolute inset-0 opacity-25 pointer-events-none">
                <img src={JHODSY_ASSETS.liquidSplash} alt="Texture" className="w-full h-full object-cover" />
              </div>

              <div className="relative z-10 w-12 h-12 flex-shrink-0">
                <img src={JHODSY_ASSETS.logoSymbol} alt="JHODSY" className="w-full h-full object-contain" />
              </div>

              <div className="relative z-10 space-y-0.5">
                <h4 className="text-xs font-bold text-white tracking-[0.2em] uppercase font-sans">JHODSY</h4>
                <p className="text-[9.5px] text-[#AEB6C2] uppercase tracking-widest">
                  SKINCARE FOR A BRIGHTER TOMORROW
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
