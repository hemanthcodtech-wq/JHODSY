import React from 'react';
import { StatusBar } from '../components/common/StatusBar';
import { AppHeader } from '../components/common/AppHeader';
import { ScreenId } from '../types';
import { User, Phone, MapPin, Home, Building2, ChevronDown, Compass } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface Screen07CheckoutAddressProps {
  onNavigate: (screen: ScreenId) => void;
  onShowToast?: (msg: string) => void;
}

export const Screen07_CheckoutAddress: React.FC<Screen07CheckoutAddressProps> = ({
  onNavigate,
  onShowToast
}) => {
  const { orderAddress, setOrderAddress } = useCart();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderAddress.fullName || !orderAddress.phoneNumber || !orderAddress.address || !orderAddress.pincode) {
      onShowToast?.('Please fill in all required delivery details');
      return;
    }
    onNavigate('checkout-payment');
  };

  return (
    <div className="relative w-full h-full bg-[#05080D] flex flex-col justify-between overflow-hidden select-none">
      <StatusBar time="9:41" />

      {/* Header */}
      <AppHeader
        title="Checkout"
        showBack={true}
        onBack={() => onNavigate('cart')}
        onNavigate={onNavigate}
        rightAction="none"
      />

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-4 no-scrollbar">
        {/* Progress Stepper Indicator */}
        <div className="flex items-center justify-between px-2 pt-1">
          {/* Step 1: Address (Active) */}
          <div className="flex items-center space-x-1.5">
            <div className="w-5 h-5 rounded-full bg-white text-[#071426] text-[10px] font-bold flex items-center justify-center">
              1
            </div>
            <span className="text-[11px] font-semibold text-white">Address</span>
          </div>

          <div className="w-10 h-[1px] bg-white/20"></div>

          {/* Step 2: Payment */}
          <div className="flex items-center space-x-1.5">
            <div className="w-5 h-5 rounded-full bg-[#0B192D] border border-white/20 text-[#8994A3] text-[10px] font-medium flex items-center justify-center">
              2
            </div>
            <span className="text-[11px] font-medium text-[#8994A3]">Payment</span>
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

        {/* Title & Subtitle */}
        <div className="pt-1">
          <h2 className="text-[16px] font-bold text-white tracking-wide">
            Shipping Address
          </h2>
          <p className="text-[11px] text-[#8994A3]">
            Fill in your delivery details
          </p>
        </div>

        {/* Address Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          {/* Full Name */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <User className="w-4 h-4 text-[#8994A3]" />
            </div>
            <input
              type="text"
              required
              placeholder="Full Name"
              value={orderAddress.fullName}
              onChange={(e) => setOrderAddress({ ...orderAddress, fullName: e.target.value })}
              className="w-full bg-[#0B192D] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-[12px] text-white placeholder-[#8994A3] focus:outline-none focus:border-white/30"
            />
          </div>

          {/* Phone Number */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Phone className="w-4 h-4 text-[#8994A3]" />
            </div>
            <input
              type="tel"
              required
              placeholder="Phone Number"
              value={orderAddress.phoneNumber}
              onChange={(e) => setOrderAddress({ ...orderAddress, phoneNumber: e.target.value })}
              className="w-full bg-[#0B192D] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-[12px] text-white placeholder-[#8994A3] focus:outline-none focus:border-white/30"
            />
          </div>

          {/* Pincode */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <MapPin className="w-4 h-4 text-[#8994A3]" />
            </div>
            <input
              type="text"
              required
              placeholder="Pincode"
              value={orderAddress.pincode}
              onChange={(e) => setOrderAddress({ ...orderAddress, pincode: e.target.value })}
              className="w-full bg-[#0B192D] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-[12px] text-white placeholder-[#8994A3] focus:outline-none focus:border-white/30"
            />
          </div>

          {/* Address */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Home className="w-4 h-4 text-[#8994A3]" />
            </div>
            <input
              type="text"
              required
              placeholder="Address (House No., Street, etc.)"
              value={orderAddress.address}
              onChange={(e) => setOrderAddress({ ...orderAddress, address: e.target.value })}
              className="w-full bg-[#0B192D] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-[12px] text-white placeholder-[#8994A3] focus:outline-none focus:border-white/30"
            />
          </div>

          {/* City */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Building2 className="w-4 h-4 text-[#8994A3]" />
            </div>
            <input
              type="text"
              required
              placeholder="City"
              value={orderAddress.city}
              onChange={(e) => setOrderAddress({ ...orderAddress, city: e.target.value })}
              className="w-full bg-[#0B192D] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-[12px] text-white placeholder-[#8994A3] focus:outline-none focus:border-white/30"
            />
          </div>

          {/* State Dropdown */}
          <div className="relative">
            <select
              value={orderAddress.state}
              onChange={(e) => setOrderAddress({ ...orderAddress, state: e.target.value })}
              className="w-full bg-[#0B192D] border border-white/10 rounded-xl px-4 py-2.5 text-[12px] text-white focus:outline-none focus:border-white/30 appearance-none cursor-pointer"
            >
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Telangana">Telangana</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Other">Other</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#8994A3]">
              <ChevronDown className="w-4 h-4 stroke-[2]" />
            </div>
          </div>

          {/* Landmark (Optional) */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Compass className="w-4 h-4 text-[#8994A3]" />
            </div>
            <input
              type="text"
              placeholder="Landmark (Optional)"
              value={orderAddress.landmark || ''}
              onChange={(e) => setOrderAddress({ ...orderAddress, landmark: e.target.value })}
              className="w-full bg-[#0B192D] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-[12px] text-white placeholder-[#8994A3] focus:outline-none focus:border-white/30"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-white text-[#071426] text-[14px] font-bold tracking-wide hover:bg-[#F5F5F5] active:scale-[0.98] transition shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Continue to Payment</span>
              <span>→</span>
            </button>
          </div>
        </form>
      </div>

      {/* iPhone Home Indicator */}
      <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mb-2"></div>
    </div>
  );
};
