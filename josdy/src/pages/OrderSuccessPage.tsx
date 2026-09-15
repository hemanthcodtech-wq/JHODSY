import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { Check, MessageCircle, Package, Truck, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BRAND_INFO, PRIMARY_PRODUCT } from '../data/product';
import { JHODSY_ASSETS } from '../data/assets';

export const OrderSuccessPage: React.FC = () => {
  const { currentOrder, orders } = useCart();
  const location = useLocation();
  const order = location.state?.order || currentOrder || orders[0];

  if (!order) {
    return <Navigate to="/shop" />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center space-y-8">
      {/* Glowing Checkmark */}
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-125"></div>
        <div className="w-24 h-24 rounded-full border-2 border-white flex items-center justify-center bg-[#0B192D] shadow-[0_0_40px_rgba(255,255,255,0.3)] relative z-10 mx-auto">
          <Check className="w-12 h-12 text-white stroke-[2.5]" />
        </div>
      </div>

      {/* Headline & Confirmation Message */}
      <div className="space-y-2">
        <span className="text-xs font-bold tracking-[0.25em] text-[#D8D8D8] uppercase">
          ORDER CONFIRMED
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-white font-serif">
          Order Placed Successfully!
        </h1>
        <p className="text-sm sm:text-base text-[#AEB6C2] max-w-md mx-auto">
          Thank you for choosing JHODSY. Your order <strong className="text-white">#{order.id}</strong> has been received and is being prepared with care.
        </p>
      </div>

      {/* Order Snapshot Card */}
      <div className="bg-[#0B192D] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-card-dark text-left">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-xs text-[#8994A3]">Order Reference</span>
            <h3 className="text-base sm:text-lg font-bold text-white">#{order.id}</h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#8994A3]">Total Paid</span>
            <h3 className="text-base sm:text-lg font-bold text-white">₹{order.total}</h3>
          </div>
        </div>

        <div className="flex items-center space-x-4 pt-2">
          <div className="w-16 h-16 bg-[#071426] rounded-xl flex items-center justify-center p-1 flex-shrink-0">
            <img src={JHODSY_ASSETS.serumFront} alt="JHODSY Serum" className="w-full h-full object-contain" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white">{PRIMARY_PRODUCT.name}</h4>
            <p className="text-xs text-[#8994A3]">30ml · Standard Express Shipping</p>
            <p className="text-xs text-[#AEB6C2] mt-0.5">Estimated Delivery: 2–4 Business Days</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
        <Link
          to="/track-order"
          state={{ order }}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-[#071426] text-sm font-bold tracking-wide hover:bg-[#F5F5F5] transition shadow-lg text-center flex items-center justify-center space-x-2"
        >
          <Truck className="w-4 h-4" />
          <span>Track Your Order</span>
        </Link>
        <Link
          to="/shop"
          className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#0B192D] border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition text-center"
        >
          Continue Shopping
        </Link>
      </div>

      {/* WhatsApp Concierge Card */}
      <div className="max-w-md mx-auto bg-[#071426] border border-white/10 rounded-2xl p-5 text-left flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white flex-shrink-0 shadow-md">
            <MessageCircle className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white">Get WhatsApp Updates</h5>
            <p className="text-[11px] text-[#AEB6C2]">Track shipments & get skincare tips</p>
          </div>
        </div>
        <a
          href={BRAND_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition whitespace-nowrap"
        >
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
};
