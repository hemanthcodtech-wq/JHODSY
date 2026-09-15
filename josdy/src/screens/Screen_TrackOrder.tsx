import React from 'react';
import { StatusBar } from '../components/common/StatusBar';
import { AppHeader } from '../components/common/AppHeader';
import { ScreenId } from '../types';
import { CheckCircle2, Truck, Package, Clock, PhoneCall } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BRAND_INFO } from '../data/product';

interface ScreenTrackOrderProps {
  onNavigate: (screen: ScreenId) => void;
}

export const Screen_TrackOrder: React.FC<ScreenTrackOrderProps> = ({ onNavigate }) => {
  const { currentOrder, orders } = useCart();
  const order = currentOrder || orders[0];

  const steps = [
    { title: 'Order Placed', time: '12 Sep, 02:30 PM', completed: true, current: false },
    { title: 'Confirmed & Packed', time: '12 Sep, 04:45 PM', completed: true, current: false },
    { title: 'Shipped (Delhivery)', time: '13 Sep, 10:15 AM', completed: true, current: true },
    { title: 'Out for Delivery', time: 'Expected 15 Sep', completed: false, current: false },
    { title: 'Delivered', time: 'Expected 15 Sep', completed: false, current: false }
  ];

  return (
    <div className="relative w-full h-full bg-[#05080D] flex flex-col justify-between overflow-hidden select-none">
      <StatusBar time="9:41" />

      {/* Header */}
      <AppHeader
        title="Track Order"
        showBack={true}
        onBack={() => onNavigate('home')}
        onNavigate={onNavigate}
        rightAction="none"
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-4 no-scrollbar">
        {/* Tracking Summary Card */}
        <div className="bg-[#0B192D] border border-white/10 rounded-2xl p-4 space-y-2 shadow-card-dark">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#AEB6C2]">Tracking ID: <strong className="text-white">{order.trackingNumber}</strong></span>
            <span className="text-[10px] font-bold bg-white text-[#071426] px-2 py-0.5 rounded-full">
              In Transit
            </span>
          </div>
          <h3 className="text-[14px] font-bold text-white">
            Estimated Delivery: 3–4 Days
          </h3>
          <p className="text-[11px] text-[#8994A3]">
            Courier Partner: Delhivery Express
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="bg-[#0B192D] border border-white/10 rounded-2xl p-5 shadow-card-dark">
          <h4 className="text-[12px] font-semibold text-white tracking-wide mb-4">
            Shipment Progress
          </h4>

          <div className="space-y-6 relative pl-2">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              return (
                <div key={index} className="relative flex items-start space-x-4">
                  {/* Vertical Line */}
                  {!isLast && (
                    <div
                      className={`absolute left-3 top-6 w-[2px] h-10 ${
                        step.completed && !step.current ? 'bg-white' : 'bg-white/15'
                      }`}
                    ></div>
                  )}

                  {/* Icon Indicator */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center relative z-10 ${
                      step.current
                        ? 'bg-white text-[#071426] shadow-[0_0_12px_rgba(255,255,255,0.6)]'
                        : step.completed
                        ? 'bg-white/20 text-white'
                        : 'bg-[#071426] border border-white/20 text-[#8994A3]'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-4 h-4 fill-current text-white" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white/40"></div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <h5 className={`text-[12.5px] font-semibold ${step.completed ? 'text-white' : 'text-[#8994A3]'}`}>
                      {step.title}
                    </h5>
                    <p className="text-[10.5px] text-[#AEB6C2] mt-0.5">{step.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Support Card */}
        <div className="bg-[#0B192D] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <h5 className="text-[12px] font-bold text-white">Need Delivery Support?</h5>
            <p className="text-[10px] text-[#8994A3] mt-0.5">Call {BRAND_INFO.customerCare}</p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="py-1.5 px-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition"
          >
            Contact
          </button>
        </div>
      </div>

      {/* iPhone Home Indicator */}
      <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mb-2"></div>
    </div>
  );
};
