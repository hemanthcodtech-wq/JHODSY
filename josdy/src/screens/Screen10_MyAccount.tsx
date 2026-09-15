import React from 'react';
import { StatusBar } from '../components/common/StatusBar';
import { AppHeader } from '../components/common/AppHeader';
import { BottomNavigation } from '../components/common/BottomNavigation';
import { ScreenId } from '../types';
import { User, Package, MapPin, Heart, HelpCircle, Info, LogOut, ChevronRight, Settings } from 'lucide-react';

interface Screen10MyAccountProps {
  onNavigate: (screen: ScreenId) => void;
  onShowToast?: (msg: string) => void;
}

export const Screen10_MyAccount: React.FC<Screen10MyAccountProps> = ({ onNavigate, onShowToast }) => {
  const menuItems = [
    {
      id: 'orders',
      label: 'My Orders',
      icon: Package,
      action: () => onNavigate('orders')
    },
    {
      id: 'addresses',
      label: 'Addresses',
      icon: MapPin,
      action: () => onNavigate('checkout-address')
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      action: () => onNavigate('wishlist')
    },
    {
      id: 'manage-account',
      label: 'Manage Account',
      icon: User,
      action: () => onShowToast?.('Account profile details up to date')
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: HelpCircle,
      action: () => onNavigate('contact')
    },
    {
      id: 'about',
      label: 'About JHODSY',
      icon: Info,
      action: () => onNavigate('about')
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: LogOut,
      action: () => onShowToast?.('Logged out securely')
    }
  ];

  return (
    <div className="relative w-full h-full bg-[#05080D] flex flex-col justify-between overflow-hidden select-none">
      <StatusBar time="9:41" />

      {/* Header */}
      <AppHeader
        title="My Account"
        showBack={false}
        onNavigate={onNavigate}
        rightAction="none"
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-3.5 no-scrollbar">
        {/* Welcome Profile Card */}
        <div
          onClick={() => onNavigate('more')}
          className="bg-[#0B192D] border border-white/10 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:border-white/20 transition shadow-card-dark"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <User className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <span className="text-[11px] text-[#AEB6C2] block">Welcome</span>
              <h3 className="text-[14px] font-bold text-white tracking-wide">
                Skincare Lover !
              </h3>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#8994A3]" />
        </div>

        {/* Menu Items List */}
        <div className="bg-[#0B192D] border border-white/10 rounded-2xl overflow-hidden shadow-card-dark divide-y divide-white/5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/[0.03] transition text-left"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-[#AEB6C2] stroke-[1.8]" />
                  <span className="text-[12.5px] font-medium text-white tracking-wide">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8994A3]" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentScreen="account" onNavigate={onNavigate} />

      {/* iPhone Home Indicator */}
      <div className="w-32 h-1 bg-white/30 rounded-full mx-auto -mt-3 mb-1.5 z-50 pointer-events-none"></div>
    </div>
  );
};
