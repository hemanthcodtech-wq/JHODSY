import React, { useEffect } from 'react';
import { StatusBar } from '../components/common/StatusBar';
import { ScreenId } from '../types';
import { JHODSY_ASSETS } from '../data/assets';

interface Screen01SplashProps {
  onNavigate?: (screen: ScreenId) => void;
  isStatic?: boolean;
}

export const Screen01_Splash: React.FC<Screen01SplashProps> = ({ onNavigate, isStatic = false }) => {
  useEffect(() => {
    if (!isStatic && onNavigate) {
      const timer = setTimeout(() => {
        // Auto advance can happen or remain clickable
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isStatic, onNavigate]);

  return (
    <div
      onClick={() => onNavigate?.('onboarding')}
      className="relative w-full h-full bg-[#05080D] flex flex-col justify-between overflow-hidden cursor-pointer select-none"
    >
      {/* Subtle Dark Navy Water Texture Background */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
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

      {/* Center Brand Identity */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-8 px-6 text-center">
        {/* Large Metallic Logo Lockup */}
        <div className="relative w-full max-w-[220px] aspect-[9/16] max-h-[300px] flex flex-col items-center justify-center">
          <img
            src={JHODSY_ASSETS.logoLockup}
            alt="JHODSY"
            className="w-full h-full object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          />
        </div>

        {/* Tagline */}
        <p className="text-[10.5px] font-medium tracking-[0.3em] text-[#BFC3C8] uppercase mt-2">
          SKIN THAT DEFINES YOU
        </p>
      </div>

      {/* Bottom Progress & Slogan */}
      <div className="relative z-10 pb-10 px-8 flex flex-col items-center">
        {/* Thin Silver Progress Bar */}
        <div className="w-28 h-[2px] bg-white/15 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent w-full animate-shimmer"></div>
        </div>

        <span className="text-[9.5px] font-semibold tracking-[0.28em] text-[#8994A3] uppercase">
          BEAUTY IN CONFIDENCE
        </span>
      </div>

      {/* iPhone Home Indicator */}
      <div className="relative z-10 w-32 h-1 bg-white/40 rounded-full mx-auto mb-2"></div>
    </div>
  );
};
