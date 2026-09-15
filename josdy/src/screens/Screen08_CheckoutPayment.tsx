import React, { useState } from 'react';
import { StatusBar } from '../components/common/StatusBar';
import { AppHeader } from '../components/common/AppHeader';
import { ScreenId } from '../types';
import { ShieldCheck, Smartphone, CreditCard, Landmark, Banknote } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface Screen08CheckoutPaymentProps {
  onNavigate: (screen: ScreenId) => void;
  onShowToast?: (msg: string) => void;
}

export const Screen08_CheckoutPayment: React.FC<Screen08CheckoutPaymentProps> = ({
  onNavigate,
  onShowToast
}) => {
  const { paymentMethod, setPaymentMethod, total, placeOrder } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentOptions = [
    {
      id: 'upi',
      label: 'UPI (GPay, PhonePe, Paytm, etc.)',
      icon: Smartphone,
    },
    {
      id: 'card',
      label: 'Credit / Debit Card',
      icon: CreditCard,
    },
    {
      id: 'netbanking',
      label: 'Net Banking',
      icon: Landmark,
    },
    {
      id: 'cod',
      label: 'Cash on Delivery (COD)',
      icon: Banknote,
    }
  ];

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      placeOrder();
      setIsProcessing(false);
      onShowToast?.('Payment successful! Order confirmed.');
      onNavigate('order-success');
    }, 800);
  };

  return (
    <div className="relative w-full h-full bg-[#05080D] flex flex-col justify-between overflow-hidden select-none">
      <StatusBar time="9:41" />

      {/* Header */}
      <AppHeader
        title="Checkout"
        showBack={true}
        onBack={() => onNavigate('checkout-address')}
        onNavigate={onNavigate}
        rightAction="none"
      />

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-4 no-scrollbar">
        {/* Progress Stepper Indicator */}
        <div className="flex items-center justify-between px-2 pt-1">
          {/* Step 1: Address (Done) */}
          <div className="flex items-center space-x-1.5 opacity-80">
            <div className="w-5 h-5 rounded-full bg-white/20 text-white text-[10px] font-bold flex items-center justify-center">
              ✓
            </div>
            <span className="text-[11px] font-medium text-[#AEB6C2]">Address</span>
          </div>

          <div className="w-10 h-[1px] bg-white"></div>

          {/* Step 2: Payment (Active) */}
          <div className="flex items-center space-x-1.5">
            <div className="w-5 h-5 rounded-full bg-white text-[#071426] text-[10px] font-bold flex items-center justify-center">
              2
            </div>
            <span className="text-[11px] font-semibold text-white">Payment</span>
          </div>

          <div className="w-10 h-[1px] bg-white/20"></div>

          {/* Step 3: Review */}
          <div className="flex items-center space-x-1.5">
            <div className="w-5 h-5 rounded-full bg-[#0B192D] border border-white/20 text-[#8994A3] text-[10px] font-medium flex items-center justify-center">
              3
            </div>
            <span className="text-[11px] font-medium text-[#8994A3]">Review</span>
          </div>
        </div>

        {/* Title */}
        <div className="pt-1">
          <h2 className="text-[16px] font-bold text-white tracking-wide">
            Select Payment Method
          </h2>
        </div>

        {/* Payment Methods Radio List */}
        <div className="space-y-2.5 pt-1">
          {paymentOptions.map((opt) => {
            const isSelected = paymentMethod === opt.id;
            const Icon = opt.icon;
            return (
              <div
                key={opt.id}
                onClick={() => setPaymentMethod(opt.id)}
                className={`w-full p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#0D223F] border-white/40 shadow-card-dark'
                    : 'bg-[#0B192D] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-[#071426] border border-white/10 flex items-center justify-center text-white">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[12.5px] font-medium text-white tracking-wide">
                    {opt.label}
                  </span>
                </div>

                {/* Custom Radio Circle */}
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-white bg-transparent'
                      : 'border-white/30 bg-transparent'
                  }`}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* 100% Secure Payments Panel */}
        <div className="bg-[#0B192D] border border-white/10 rounded-2xl p-3.5 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-white stroke-[1.8]" />
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-white">
              100% Secure Payments
            </h4>
            <p className="text-[10.5px] text-[#8994A3] mt-0.5">
              Your information is safe with us.
            </p>
          </div>
        </div>

        {/* Primary Pay Button */}
        <div className="pt-2">
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-3 rounded-full bg-white text-[#071426] text-[14px] font-bold tracking-wide hover:bg-[#F5F5F5] active:scale-[0.98] transition shadow-lg flex items-center justify-center space-x-2"
          >
            <span>{isProcessing ? 'Processing...' : `Pay ₹${total || 559}`}</span>
          </button>
        </div>
      </div>

      {/* iPhone Home Indicator */}
      <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mb-2"></div>
    </div>
  );
};
