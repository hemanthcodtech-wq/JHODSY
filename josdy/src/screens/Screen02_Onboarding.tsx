import React from 'react';
import { StatusBar } from '../components/common/StatusBar';
import { ScreenId } from '../types';
import { JHODSY_ASSETS } from '../data/assets';

interface Screen02OnboardingProps {
  onNavigate?: (screen: ScreenId) => void;
}

export const Screen02_Onboarding: React.FC<Screen02OnboardingProps> = ({ onNavigate }) => {
  return (
    <div className="relative w-full h-full bg-[#05080D] flex flex-col justify-between overflow-hidden select-none">
      {/* Background Gradient & Water glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#071426] via-[#0B192D] to-[#05080D] pointer-events-none"></div>

      <div>
        <StatusBar time="9:41" />
        
        {/* Top bar with Skip button */}
        <div className="w-full px-6 pt-1 flex justify-end">
          <button
            onClick={() => onNavigate?.('home')}
            className="text-[13px] font-medium text-[#AEB6C2] hover:text-white transition tracking-wide"
          >
            Skip
          </button>
        </div>
      </div>

      {/* Hero Product Shot with Water Splash */}
      <div className="relative flex-1 flex items-center justify-center -my-2 px-4">
        <div className="relative w-full max-w-[290px] aspect-square flex items-center justify-center">
          {/* Subtle Radial Glow */}
          <div className="absolute inset-0 bg-[#163660]/30 blur-3xl rounded-full scale-110 pointer-events-none"></div>
          
          <img
            src={JHODSY_ASSETS.heroSplash}
            alt="JHODSY Serum Splash"
            className="w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] relative z-10"
          />
        </div>
      </div>

      {/* Content & Action Area */}
      <div className="relative z-20 px-6 pb-6 text-center flex flex-col items-center">
        {/* Headline */}
        <h2 className="text-[22px] sm:text-[24px] font-bold tracking-[0.08em] text-white leading-[1.2] uppercase font-serif mb-2">
          RADIANT SKIN<br />
          REAL CONFIDENCE
        </h2>

        {/* Supporting Text */}
        <p className="text-[13px] text-[#AEB6C2] font-normal leading-relaxed max-w-[240px] mb-5">
          Science-backed skincare<br />for a brighter, healthier you.
        </p>

        {/* Pagination Dots */}
        <div className="flex items-center space-x-1.5 mb-6">
          <div className="w-4 h-1.5 bg-white rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => onNavigate?.('home')}
          className="w-full py-3.5 px-6 rounded-full bg-white text-[#071426] font-semibold text-[14px] tracking-wide shadow-lg hover:bg-[#F5F5F5] active:scale-[0.98] transition flex items-center justify-center space-x-2"
        >
          <span>Get Started</span>
          <span>→</span>
        </button>
      </div>

      {/* iPhone Home Indicator */}
      <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mb-2"></div>
    </div>
  );
};
