import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Smartphone, CreditCard, Landmark, Banknote, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CheckoutPaymentPage: React.FC = () => {
  const { paymentMethod, setPaymentMethod, total, subtotal, discount, cartItems } = useCart();
  const navigate = useNavigate();

  const paymentOptions = [
    {
      id: 'online',
      name: 'Pay Online (Razorpay)',
      subtitle: 'UPI, Credit/Debit Cards, NetBanking, Wallets',
      icon: Smartphone
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Checkout Progress Stepper */}
      <div className="max-w-xl mx-auto flex items-center justify-between pb-4">
        {/* Step 1: Address (Done) */}
        <Link to="/checkout/address" className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-full bg-white/20 text-white text-xs font-bold flex items-center justify-center">
            ✓
          </div>
          <span className="text-xs sm:text-sm font-semibold text-[#AEB6C2]">Address</span>
        </Link>

        <div className="flex-1 h-[2px] bg-white mx-4"></div>

        {/* Step 2: Payment (Active) */}
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-full bg-white text-[#071426] text-xs font-bold flex items-center justify-center shadow">
            2
          </div>
          <span className="text-xs sm:text-sm font-bold text-white">Payment</span>
        </div>

        <div className="flex-1 h-[2px] bg-white/20 mx-4"></div>

        {/* Step 3: Review */}
        <div className="flex items-center space-x-2 opacity-60">
          <div className="w-7 h-7 rounded-full bg-[#0B192D] border border-white/20 text-[#AEB6C2] text-xs font-medium flex items-center justify-center">
            3
          </div>
          <span className="text-xs sm:text-sm font-medium text-[#AEB6C2]">Review</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
        {/* LEFT: PAYMENT OPTIONS */}
        <div className="lg:col-span-8 bg-[#0B192D] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-card-dark">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">Select Payment Method</h2>
            <p className="text-xs sm:text-sm text-[#AEB6C2] mt-1">
              All transactions are 256-bit encrypted and processed through secure PCI-DSS gateways.
            </p>
          </div>

          <div className="space-y-3">
            {paymentOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = paymentMethod === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#0D223F] border-white/40 shadow-card-dark'
                      : 'bg-[#071426]/70 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0B192D] border border-white/15 flex items-center justify-center text-white">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white">{opt.name}</h4>
                      <p className="text-xs text-[#8994A3]">{opt.subtitle}</p>
                    </div>
                  </div>

                  {/* Radio Indicator */}
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                      isSelected ? 'border-white bg-white text-[#071426]' : 'border-white/30'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Security guarantee */}
          <div className="p-4 rounded-2xl bg-[#071426] border border-white/10 flex items-center space-x-3.5">
            <ShieldCheck className="w-6 h-6 text-white flex-shrink-0" />
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-white">100% Secure Checkout Guarantee</h5>
              <p className="text-[11px] text-[#AEB6C2]">Your bank details are never stored on our servers.</p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <Link to="/checkout/address" className="text-xs text-[#AEB6C2] hover:text-white">
              ← Back to Address
            </Link>
            <button
              onClick={() => navigate('/checkout/review')}
              className="px-8 py-3.5 rounded-full bg-white text-[#071426] text-sm font-bold tracking-wide hover:bg-[#F5F5F5] active:scale-95 transition shadow-lg flex items-center space-x-2"
            >
              <span>Review Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="lg:col-span-4 bg-[#0B192D] border border-white/10 rounded-3xl p-6 space-y-4 shadow-card-dark text-xs sm:text-sm">
          <h3 className="font-bold text-white text-base tracking-wide border-b border-white/10 pb-3">
            Summary
          </h3>

          <div className="flex justify-between text-[#AEB6C2]">
            <span>Total Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
            <span className="text-white font-medium">₹{subtotal}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>Savings</span>
              <span>- ₹{discount}</span>
            </div>
          )}

          <div className="flex justify-between text-[#AEB6C2]">
            <span>Shipping</span>
            <span className="text-white font-medium">FREE</span>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-between items-baseline font-bold text-white">
            <span className="text-sm">Final Amount</span>
            <span className="text-xl font-extrabold">₹{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
