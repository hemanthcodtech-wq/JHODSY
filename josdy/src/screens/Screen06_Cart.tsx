import React, { useState } from 'react';
import { StatusBar } from '../components/common/StatusBar';
import { AppHeader } from '../components/common/AppHeader';
import { ScreenId } from '../types';
import { Trash2, Minus, Plus, ShieldCheck, RotateCcw, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { JHODSY_ASSETS } from '../data/assets';

interface Screen06CartProps {
  onNavigate: (screen: ScreenId) => void;
  onShowToast?: (msg: string) => void;
}

export const Screen06_Cart: React.FC<Screen06CartProps> = ({ onNavigate, onShowToast }) => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    shipping,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const success = applyCoupon(inputCoupon);
    if (success) {
      onShowToast?.(`Coupon "${inputCoupon.toUpperCase()}" applied! (10% extra discount)`);
    } else {
      onShowToast?.('Invalid coupon. Try JHODSY30 or GLOW');
    }
  };

  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="relative w-full h-full bg-[#05080D] flex flex-col justify-between overflow-hidden select-none">
      <StatusBar time="9:41" />

      {/* Header */}
      <AppHeader
        title={`Your Cart (${cartItems.reduce((acc, item) => acc + item.quantity, 0)})`}
        showBack={true}
        onBack={() => onNavigate('shop')}
        onNavigate={onNavigate}
        rightAction="none"
      />

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-4 no-scrollbar">
        {isCartEmpty ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#0B192D] border border-white/10 flex items-center justify-center">
              <span className="text-2xl">🛍️</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Your cart is empty</h3>
              <p className="text-[12px] text-[#8994A3] mt-1 max-w-[200px]">
                Discover your JHODSY skincare essentials.
              </p>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="py-2.5 px-6 rounded-full bg-white text-[#071426] text-[13px] font-semibold hover:bg-[#F5F5F5] transition"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <>
            {/* Product List */}
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-[#0B192D] border border-white/10 rounded-2xl p-3.5 flex items-center space-x-3.5 shadow-card-dark"
                >
                  {/* Thumbnail Box */}
                  <div className="w-16 h-16 bg-[#071426] rounded-xl flex items-center justify-center p-1 relative flex-shrink-0 border border-white/5">
                    <img
                      src={JHODSY_ASSETS.serumFront}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-bold text-white truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-[#8994A3] mb-1">
                      {item.size}
                    </p>

                    <div className="flex items-baseline space-x-2">
                      <span className="text-[14px] font-bold text-white">
                        ₹{item.product.price}
                      </span>
                      <span className="text-[11px] text-[#8994A3] line-through">
                        ₹{item.product.mrp}
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Trash */}
                  <div className="flex flex-col items-end space-y-2.5">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[#8994A3] hover:text-white transition p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[1.8]" />
                    </button>

                    <div className="flex items-center bg-[#071426] border border-white/10 rounded-lg px-2 py-0.5 space-x-2.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="text-[#AEB6C2] hover:text-white"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-[11px] font-bold text-white min-w-[10px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="text-[#AEB6C2] hover:text-white"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code Input */}
            <div className="bg-[#0B192D] border border-white/10 rounded-2xl p-3.5 space-y-2">
              <span className="text-[11px] font-medium text-[#AEB6C2] block">
                Have a coupon code?
              </span>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-white/5 border border-white/20 rounded-xl px-3 py-2">
                  <span className="text-[12px] font-bold text-white tracking-wider">
                    {appliedCoupon} (Applied)
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-[11px] text-[#AEB6C2] hover:text-white underline"
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
                    className="flex-1 bg-[#071426] border border-white/10 rounded-xl px-3.5 py-2 text-[12px] text-white placeholder-[#8994A3] focus:outline-none focus:border-white/30 uppercase tracking-wider"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/15 text-white text-[12px] font-semibold rounded-xl transition"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Order Cost Breakdown */}
            <div className="bg-[#0B192D] border border-white/10 rounded-2xl p-3.5 space-y-2.5 text-[12px]">
              <div className="flex justify-between text-[#AEB6C2]">
                <span>Subtotal</span>
                <span className="text-white font-medium">₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-white">
                  <span>Coupon Discount</span>
                  <span className="font-semibold">- ₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between text-[#AEB6C2]">
                <span>Shipping</span>
                <span className="text-white font-medium">Free</span>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between items-baseline text-[14px]">
                <span className="font-bold text-white">Total</span>
                <span className="font-bold text-white text-[16px]">₹{total}</span>
              </div>
            </div>

            {/* Primary Checkout CTA */}
            <button
              onClick={() => onNavigate('checkout-address')}
              className="w-full py-3 rounded-full bg-white text-[#071426] text-[14px] font-bold tracking-wide hover:bg-[#F5F5F5] active:scale-[0.98] transition shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <span>→</span>
            </button>

            {/* 3 Reassurance Value Props at Bottom */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[9px] text-[#AEB6C2]">
              <div className="flex flex-col items-center space-y-1">
                <ShieldCheck className="w-4 h-4 text-white stroke-[1.8]" />
                <span>Secure Payment</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <RotateCcw className="w-4 h-4 text-white stroke-[1.8]" />
                <span>Easy Returns</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <Award className="w-4 h-4 text-white stroke-[1.8]" />
                <span>100% Original Products</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* iPhone Home Indicator */}
      <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mb-2"></div>
    </div>
  );
};
