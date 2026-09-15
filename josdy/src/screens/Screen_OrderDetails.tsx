import React from 'react';
import { StatusBar } from '../components/common/StatusBar';
import { AppHeader } from '../components/common/AppHeader';
import { ScreenId } from '../types';
import { Package, Truck, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ScreenOrderDetailsProps {
  onNavigate: (screen: ScreenId) => void;
}

export const Screen_OrderDetails: React.FC<ScreenOrderDetailsProps> = ({ onNavigate }) => {
  const { orders } = useCart();
  const order = orders[0];

  return (
    <div className="relative w-full h-full bg-[#05080D] flex flex-col justify-between overflow-hidden select-none">
      <StatusBar time="9:41" />

      {/* Header */}
      <AppHeader
        title="Order Details"
        showBack={true}
        onBack={() => onNavigate('orders')}
        onNavigate={onNavigate}
        rightAction="none"
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-4 no-scrollbar">
        {/* Order Status Card */}
        <div className="bg-[#0B192D] border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-card-dark">
          <div>
            <span className="text-[10px] text-[#AEB6C2]">Order #{order.id}</span>
            <h3 className="text-[14px] font-bold text-white mt-0.5">
              Status: {order.status}
            </h3>
            <p className="text-[11px] text-[#8994A3] mt-0.5">
              Est. Delivery: {order.estimatedDelivery}
            </p>
          </div>
          <button
            onClick={() => onNavigate('track-order')}
            className="py-1.5 px-3 rounded-full bg-white text-[#071426] text-[11px] font-bold shadow hover:bg-[#F5F5F5] transition"
          >
            Track Order
          </button>
        </div>

        {/* Product Items */}
        <div className="bg-[#0B192D] border border-white/10 rounded-2xl p-4 space-y-3">
          <h4 className="text-[12px] font-semibold text-[#AEB6C2]">Item Ordered</h4>
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-[#071426] rounded-xl flex items-center justify-center p-1">
              <img src="/assets/serum_box.png" alt="Serum" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1">
              <h5 className="text-[13px] font-bold text-white">JHODSY Brightening Serum</h5>
              <p className="text-[11px] text-[#8994A3]">30ml · Qty: 1</p>
              <span className="text-[13px] font-bold text-white">₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-[#0B192D] border border-white/10 rounded-2xl p-4 space-y-1.5 text-[12px]">
          <div className="flex items-center space-x-2 text-[#AEB6C2] font-semibold">
            <MapPin className="w-4 h-4 text-white" />
            <span>Delivery Address</span>
          </div>
          <p className="text-white font-medium">{order.address.fullName}</p>
          <p className="text-[#AEB6C2]">{order.address.address}</p>
          <p className="text-[#AEB6C2]">{order.address.city}, {order.address.state} - {order.address.pincode}</p>
          <p className="text-[#8994A3] text-[11px]">Phone: {order.address.phoneNumber}</p>
        </div>

        {/* Payment & Summary */}
        <div className="bg-[#0B192D] border border-white/10 rounded-2xl p-4 space-y-2 text-[12px]">
          <div className="flex items-center space-x-2 text-[#AEB6C2] font-semibold mb-1">
            <CreditCard className="w-4 h-4 text-white" />
            <span>Payment Breakdown</span>
          </div>
          <div className="flex justify-between text-[#AEB6C2]">
            <span>Method</span>
            <span className="text-white">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-[#AEB6C2]">
            <span>Item Total</span>
            <span className="text-white">₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between text-[#AEB6C2]">
            <span>Shipping</span>
            <span className="text-white">Free</span>
          </div>
          <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-[13px] text-white">
            <span>Grand Total</span>
            <span>₹{order.total}</span>
          </div>
        </div>
      </div>

      {/* iPhone Home Indicator */}
      <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mb-2"></div>
    </div>
  );
};
