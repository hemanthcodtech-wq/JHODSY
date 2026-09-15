import React from 'react';
import { StatusBar } from '../components/common/StatusBar';
import { AppHeader } from '../components/common/AppHeader';
import { ScreenId } from '../types';
import { Sparkles, Award, Users, ShieldCheck } from 'lucide-react';
import { BRAND_INFO } from '../data/product';
import { JHODSY_ASSETS } from '../data/assets';

interface Screen12AboutProps {
  onNavigate: (screen: ScreenId) => void;
}

export const Screen12_About: React.FC<Screen12AboutProps> = ({ onNavigate }) => {
  return (
    <div className="relative w-full h-full bg-[#05080D] flex flex-col justify-between overflow-hidden select-none">
      {/* Background Water Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img
          src={JHODSY_ASSETS.waterTexture}
          alt="Water Texture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05080D] via-transparent to-[#05080D]"></div>
      </div>

      <div className="relative z-10">
        <StatusBar time="9:41" />
      </div>

      {/* Header */}
      <AppHeader
        title="About JHODSY"
        showBack={true}
        onBack={() => onNavigate('home')}
        onNavigate={onNavigate}
        rightAction="none"
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-4 space-y-4 text-center no-scrollbar relative z-10">
        {/* Logo Water Hero Showcase */}
        <div className="flex flex-col items-center pt-1">
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-white/10 shadow-card-dark mb-2.5">
            <img
              src={JHODSY_ASSETS.logoWater}
              alt="JHODSY Brand Emblem"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-[20px] font-bold tracking-[0.2em] text-white uppercase font-sans mb-0.5">
            {BRAND_INFO.name}
          </h2>

          <p className="text-[9px] font-semibold tracking-[0.25em] text-[#BFC3C8] uppercase">
            SKINCARE FOR A BRIGHTER TOMORROW
          </p>
        </div>

        {/* Brand Mission Description */}
        <p className="text-[12px] text-[#AEB6C2] leading-relaxed max-w-[280px] mx-auto pt-0.5">
          {BRAND_INFO.aboutText}
        </p>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-3 gap-2 py-1">
          <div className="bg-[#0B192D]/90 border border-white/10 rounded-xl p-2.5 flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center mb-1">
              <Sparkles className="w-3.5 h-3.5 text-white stroke-[1.8]" />
            </div>
            <span className="text-[9px] text-white font-medium leading-tight">
              Science<br />Backed
            </span>
          </div>

          <div className="bg-[#0B192D]/90 border border-white/10 rounded-xl p-2.5 flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center mb-1">
              <Award className="w-3.5 h-3.5 text-white stroke-[1.8]" />
            </div>
            <span className="text-[9px] text-white font-medium leading-tight">
              Premium<br />Quality
            </span>
          </div>

          <div className="bg-[#0B192D]/90 border border-white/10 rounded-xl p-2.5 flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center mb-1">
              <Users className="w-3.5 h-3.5 text-white stroke-[1.8]" />
            </div>
            <span className="text-[9px] text-white font-medium leading-tight">
              For All<br />Skin Types
            </span>
          </div>
        </div>

        {/* Pull Quote */}
        <div className="py-1">
          <blockquote className="text-[14px] italic font-serif text-white tracking-wide">
            {BRAND_INFO.quote}
          </blockquote>
        </div>

        {/* Abstract Liquid Splash Visual at Bottom */}
        <div className="w-full h-20 rounded-xl overflow-hidden relative border border-white/5 opacity-85">
          <img
            src={JHODSY_ASSETS.liquidSplash}
            alt="JHODSY Liquid Splash"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05080D]/40 to-transparent"></div>
        </div>
      </div>

      {/* iPhone Home Indicator */}
      <div className="relative z-20 w-32 h-1 bg-white/30 rounded-full mx-auto mb-2"></div>
    </div>
  );
};
