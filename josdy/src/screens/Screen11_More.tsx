import React from 'react';
import { StatusBar } from '../components/common/StatusBar';
import { AppHeader } from '../components/common/AppHeader';
import { ScreenId } from '../types';
import {
  Info,
  BookOpen,
  Sparkles,
  PhoneCall,
  HelpCircle,
  Truck,
  RotateCcw,
  FileText,
  ShieldCheck,
  Headphones,
  ChevronRight
} from 'lucide-react';
import { BRAND_INFO } from '../data/product';

interface Screen11MoreProps {
  onNavigate: (screen: ScreenId) => void;
}

export const Screen11_More: React.FC<Screen11MoreProps> = ({ onNavigate }) => {
  const moreLinks = [
    { id: 'about', label: 'About JHODSY', icon: Info, route: 'about' as ScreenId },
    { id: 'story', label: 'Our Story', icon: BookOpen, route: 'story' as ScreenId },
    { id: 'science', label: 'Skincare Science', icon: Sparkles, route: 'science' as ScreenId },
    { id: 'contact', label: 'Contact Us', icon: PhoneCall, route: 'contact' as ScreenId },
    { id: 'faq', label: 'FAQ', icon: HelpCircle, route: 'faq' as ScreenId },
    { id: 'shipping', label: 'Shipping Policy', icon: Truck, route: 'shipping-policy' as ScreenId },
    { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw, route: 'returns-policy' as ScreenId },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText, route: 'terms' as ScreenId },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck, route: 'privacy' as ScreenId },
  ];

  return (
    <div className="relative w-full h-full bg-[#05080D] flex flex-col justify-between overflow-hidden select-none">
      <StatusBar time="9:41" />

      {/* Header */}
      <AppHeader
        title="More"
        showBack={true}
        onBack={() => onNavigate('home')}
        onNavigate={onNavigate}
        rightAction="none"
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-4 no-scrollbar">
        {/* Menu list */}
        <div className="bg-[#0B192D] border border-white/10 rounded-2xl overflow-hidden shadow-card-dark divide-y divide-white/5">
          {moreLinks.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.route)}
                className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-white/[0.03] transition text-left"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-[#AEB6C2] stroke-[1.8]" />
                  <span className="text-[12px] font-medium text-white tracking-wide">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#8994A3]" />
              </button>
            );
          })}
        </div>

        {/* Customer Support Bottom Card */}
        <div className="bg-[#0B192D] border border-white/10 rounded-2xl p-4 flex items-start space-x-3.5 shadow-card-dark">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-white mt-0.5">
            <Headphones className="w-5 h-5 stroke-[1.8]" />
          </div>

          <div className="space-y-1 text-[11px]">
            <h4 className="text-[13px] font-bold text-white tracking-wide">
              Need Help?
            </h4>
            <p className="text-white font-medium">
              {BRAND_INFO.customerCare}
            </p>
            <p className="text-[#AEB6C2]">
              {BRAND_INFO.email}
            </p>
            <p className="text-[#8994A3] text-[10px]">
              {BRAND_INFO.timings}
            </p>
          </div>
        </div>
      </div>

      {/* iPhone Home Indicator */}
      <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mb-2"></div>
    </div>
  );
};
