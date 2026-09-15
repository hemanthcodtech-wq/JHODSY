import React from 'react';
import { StatusBar } from '../components/common/StatusBar';
import { ScreenId } from '../types';
import { Check, MessageCircle } from 'lucide-react';
import { BRAND_INFO } from '../data/product';
import { useCart } from '../context/CartContext';

interface Screen09OrderSuccessProps {
  onNavigate: (screen: ScreenId) => void;
}

export const Screen09_OrderSuccess: React.FC<Screen09OrderSuccessProps> = ({ onNavigate }) => {
  const { currentOrder } = useCart();
  const orderId = currentOrder?.id || 'JHD124578';

  return (
    <div className="relative w-full h-full bg-[#05080D] flex flex-col justify-between overflow-hidden select-none">
      <StatusBar time="9:41" />

      {/* Floating particles & glow background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#071426] via-[#0B1E38] to-[#05080D] pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#1B4B82]/30 blur-3xl rounded-full pointer-events-none"></div>

      {/* Main Success Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center -mt-6">
        {/* Large Glowing Checkmark Circle */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-125"></div>
          <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center bg-[#0B192D] shadow-[0_0_30px_rgba(255,255,255,0.25)] relative z-10">
            <Check className="w-10 h-10 text-white stroke-[2.5]" />
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-[22px] font-bold text-white leading-tight font-serif mb-2">
          Order Placed<br />Successfully!
        </h2>

        {/* Supporting Text */}
        <p className="text-[12px] text-[#AEB6C2] leading-relaxed max-w-[260px] mb-6">
          Thank you for choosing JHODSY.<br />
          Your order <span className="text-white font-semibold">#{orderId}</span> has been placed and will be delivered soon.
        </p>

        {/* Primary CTA */}
        <button
          onClick={() => onNavigate('track-order')}
          className="w-full py-3 rounded-full bg-white text-[#071426] text-[14px] font-bold tracking-wide hover:bg-[#F5F5F5] active:scale-[0.98] transition shadow-lg mb-3"
        >
          Track Your Order
        </button>

        {/* Secondary CTA */}
        <button
          onClick={() => onNavigate('home')}
          className="text-[13px] font-semibold text-white hover:underline transition py-1"
        >
          Continue Shopping
        </button>

        {/* WhatsApp Support Card */}
        <div className="w-full bg-[#0B192D]/90 border border-white/10 rounded-2xl p-3.5 mt-5 text-left flex flex-col space-y-2.5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0 text-white shadow-md">
              <MessageCircle className="w-4 h-4 fill-white" />
            </div>
            <p className="text-[11px] text-[#AEB6C2] leading-tight">
              Get skincare tips, offers & updates on WhatsApp
            </p>
          </div>

          <a
            href={BRAND_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 rounded-xl bg-[#071426] border border-white/15 text-white text-[11px] font-semibold text-center hover:bg-white/10 transition block"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* iPhone Home Indicator */}
      <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mb-2"></div>
    </div>
  );
};
