import React from 'react';
import { StatusBar } from '../components/common/StatusBar';
import { AppHeader } from '../components/common/AppHeader';
import { ScreenId } from '../types';
import { Package, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { JHODSY_ASSETS } from '../data/assets';

interface ScreenOrdersProps {
  onNavigate: (screen: ScreenId) => void;
}

export const Screen_Orders: React.FC<ScreenOrdersProps> = ({ onNavigate }) => {
  const { orders } = useCart();

  return (
    <div className="relative w-full h-full bg-[#05080D] flex flex-col justify-between overflow-hidden select-none">
      <StatusBar time="9:41" />

      {/* Header */}
      <AppHeader
        title="My Orders"
        showBack={true}
        onBack={() => onNavigate('account')}
        onNavigate={onNavigate}
        rightAction="none"
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-3 no-scrollbar">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => onNavigate('order-details')}
            className="bg-[#0B192D] border border-white/10 rounded-2xl p-4 space-y-3 cursor-pointer hover:border-white/20 transition shadow-card-dark"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-[#AEB6C2]" />
                <span className="text-[12px] font-bold text-white tracking-wide">
                  Order #{order.id}
                </span>
              </div>
              <span className="text-[10px] font-semibold bg-white/10 text-white px-2 py-0.5 rounded-full">
                {order.status}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-[#071426] rounded-xl flex items-center justify-center p-1">
                <img
                  src={JHODSY_ASSETS.serumFront}
                  alt="Serum"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] font-bold text-white truncate">
                  JHODSY Brightening Serum
                </h4>
                <p className="text-[11px] text-[#8994A3]">
                  30ml · Qty: 1
                </p>
                <span className="text-[13px] font-bold text-white">
                  ₹{order.total}
                </span>
              </div>

              <ChevronRight className="w-4 h-4 text-[#8994A3]" />
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px]">
              <span className="text-[#8994A3]">Placed on {order.date}</span>
              <span className="text-white font-semibold">View Details →</span>
            </div>
          </div>
        ))}
      </div>

      {/* iPhone Home Indicator */}
      <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mb-2"></div>
    </div>
  );
};
