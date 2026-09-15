import React from 'react';
import { Wifi, Battery } from 'lucide-react';

interface StatusBarProps {
  time?: string;
  isLight?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ time = '9:41', isLight = true }) => {
  return (
    <div className={`w-full h-11 pt-2 px-7 flex items-center justify-between z-50 select-none text-[14px] font-semibold tracking-tight ${isLight ? 'text-white' : 'text-[#8994A3]'}`}>
      <span>{time}</span>
      {/* Dynamic Island pill */}
      <div className="w-24 h-5 bg-black rounded-full mx-auto self-start mt-0.5 border border-white/5 flex items-center justify-end px-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[#0d1b30] border border-white/10"></div>
      </div>
      <div className="flex items-center space-x-1.5 text-xs">
        {/* Signal bars */}
        <div className="flex items-end space-x-0.5 h-3">
          <div className="w-0.5 h-1 bg-current rounded-sm"></div>
          <div className="w-0.5 h-1.5 bg-current rounded-sm"></div>
          <div className="w-0.5 h-2 bg-current rounded-sm"></div>
          <div className="w-0.5 h-2.5 bg-current rounded-sm"></div>
        </div>
        <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
        <Battery className="w-4 h-4 stroke-[2.2]" />
      </div>
    </div>
  );
};
