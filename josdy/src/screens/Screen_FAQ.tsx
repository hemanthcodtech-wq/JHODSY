import React from 'react';
import { StatusBar } from '../components/common/StatusBar';
import { AppHeader } from '../components/common/AppHeader';
import { ScreenId } from '../types';
import { FAQS } from '../data/product';
import { AccordionItem } from '../components/common/Accordion';

interface ScreenFAQProps {
  onNavigate: (screen: ScreenId) => void;
}

export const Screen_FAQ: React.FC<ScreenFAQProps> = ({ onNavigate }) => {
  return (
    <div className="relative w-full h-full bg-[#05080D] flex flex-col justify-between overflow-hidden select-none">
      <StatusBar time="9:41" />

      {/* Header */}
      <AppHeader
        title="Frequently Asked Questions"
        showBack={true}
        onBack={() => onNavigate('more')}
        onNavigate={onNavigate}
        rightAction="none"
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-3 no-scrollbar">
        <div className="text-center py-1">
          <p className="text-[11px] text-[#AEB6C2]">
            Got questions? We're here to answer everything about JHODSY Brightening Serum.
          </p>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, index) => (
            <AccordionItem key={index} title={faq.q} defaultOpen={index === 0}>
              <p>{faq.a}</p>
            </AccordionItem>
          ))}
        </div>
      </div>

      {/* iPhone Home Indicator */}
      <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mb-2"></div>
    </div>
  );
};
