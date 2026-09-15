import React from 'react';

interface IPhoneFrameProps {
  children: React.ReactNode;
  className?: string;
  isMockup?: boolean;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({
  children,
  className = '',
  isMockup = false
}) => {
  return (
    <div
      className={`relative mx-auto bg-[#000000] rounded-[52px] p-[10px] shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.18)] transition-all duration-300 ${
        isMockup
          ? 'w-[280px] sm:w-[320px] md:w-[350px] lg:w-[320px] xl:w-[360px] aspect-[390/844]'
          : 'w-full max-w-[420px] h-[890px] max-h-[92vh]'
      } ${className}`}
    >
      {/* Outer rim subtle titanium metallic edge */}
      <div className="absolute inset-0 rounded-[52px] pointer-events-none border border-white/10"></div>
      
      {/* Side buttons simulation */}
      <div className="absolute -left-[2.5px] top-[115px] w-[2.5px] h-[26px] bg-[#333] rounded-l-sm"></div>
      <div className="absolute -left-[2.5px] top-[155px] w-[2.5px] h-[48px] bg-[#333] rounded-l-sm"></div>
      <div className="absolute -left-[2.5px] top-[215px] w-[2.5px] h-[48px] bg-[#333] rounded-l-sm"></div>
      <div className="absolute -right-[2.5px] top-[160px] w-[2.5px] h-[75px] bg-[#333] rounded-r-sm"></div>

      {/* Screen container */}
      <div className="relative w-full h-full bg-[#05080D] rounded-[42px] overflow-hidden flex flex-col border border-white/5">
        {children}
      </div>
    </div>
  );
};
