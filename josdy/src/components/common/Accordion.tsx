import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-[#0B192D] border border-white/10 rounded-xl overflow-hidden mb-2.5 transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3.5 flex items-center justify-between text-left transition hover:bg-white/[0.02]"
      >
        <span className="text-[13px] font-medium text-white/95 tracking-wide">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-[#8994A3] transition-transform duration-200 stroke-[2] ${
            isOpen ? 'transform rotate-180 text-white' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1 text-[12px] text-[#AEB6C2] leading-relaxed border-t border-white/5">
          {children}
        </div>
      )}
    </div>
  );
};
