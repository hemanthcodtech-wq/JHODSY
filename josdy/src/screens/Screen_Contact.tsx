import React from 'react';
import { StatusBar } from '../components/common/StatusBar';
import { AppHeader } from '../components/common/AppHeader';
import { ScreenId } from '../types';
import { PhoneCall, MessageCircle, Mail, MapPin, Clock, Building } from 'lucide-react';
import { BRAND_INFO } from '../data/product';

interface ScreenContactProps {
  onNavigate: (screen: ScreenId) => void;
}

export const Screen_Contact: React.FC<ScreenContactProps> = ({ onNavigate }) => {
  return (
    <div className="relative w-full h-full bg-[#05080D] flex flex-col justify-between overflow-hidden select-none">
      <StatusBar time="9:41" />

      {/* Header */}
      <AppHeader
        title="Contact JHODSY"
        showBack={true}
        onBack={() => onNavigate('more')}
        onNavigate={onNavigate}
        rightAction="none"
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-3.5 no-scrollbar">
        {/* Intro */}
        <div className="text-center py-1">
          <h2 className="text-[17px] font-bold text-white font-serif tracking-wide">
            We're Here For You
          </h2>
          <p className="text-[11px] text-[#AEB6C2] mt-1 max-w-[260px] mx-auto">
            Reach out to our dedicated luxury skincare concierge for inquiries, orders, or support.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Toll Free Call */}
          <a
            href={`tel:${BRAND_INFO.customerCare}`}
            className="bg-[#0B192D] border border-white/10 hover:border-white/20 rounded-2xl p-3.5 flex flex-col items-center text-center transition active:scale-95"
          >
            <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white mb-2">
              <PhoneCall className="w-4 h-4" />
            </div>
            <span className="text-[12px] font-bold text-white">Call Care</span>
            <span className="text-[10px] text-[#AEB6C2] mt-0.5">{BRAND_INFO.customerCare}</span>
          </a>

          {/* WhatsApp Direct */}
          <a
            href={BRAND_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#0B192D] border border-white/10 hover:border-white/20 rounded-2xl p-3.5 flex flex-col items-center text-center transition active:scale-95"
          >
            <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white mb-2 shadow-sm">
              <MessageCircle className="w-4 h-4 fill-white" />
            </div>
            <span className="text-[12px] font-bold text-white">WhatsApp</span>
            <span className="text-[10px] text-[#AEB6C2] mt-0.5">{BRAND_INFO.whatsapp}</span>
          </a>
        </div>

        {/* Email Support */}
        <a
          href={`mailto:${BRAND_INFO.email}`}
          className="bg-[#0B192D] border border-white/10 rounded-2xl p-3.5 flex items-center space-x-3.5 hover:border-white/20 transition block"
        >
          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white flex-shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#8994A3] block">Official Email</span>
            <span className="text-[12px] font-bold text-white">{BRAND_INFO.email}</span>
          </div>
        </a>

        {/* Operational Hours */}
        <div className="bg-[#0B192D] border border-white/10 rounded-2xl p-3.5 flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white flex-shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#8994A3] block">Working Hours</span>
            <span className="text-[12px] font-bold text-white">{BRAND_INFO.timings}</span>
          </div>
        </div>

        {/* Registered Business Address */}
        <div className="bg-[#0B192D] border border-white/10 rounded-2xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-white font-bold text-[12.5px]">
            <MapPin className="w-4 h-4 text-[#D8D8D8]" />
            <span>Registered Business Address</span>
          </div>
          <p className="text-[11.5px] text-[#AEB6C2] leading-relaxed pl-6">
            JHODSY<br />
            1-328, Kothapeta,<br />
            VSMD 011, Rambilli,<br />
            Anakapalli, Andhra Pradesh - 531061
          </p>
          <div className="pt-2 border-t border-white/5 flex justify-between text-[10px] text-[#8994A3] pl-6">
            <span>GST: {BRAND_INFO.gst}</span>
            <span>Category: Skincare Retail</span>
          </div>
        </div>
      </div>

      {/* iPhone Home Indicator */}
      <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mb-2"></div>
    </div>
  );
};
