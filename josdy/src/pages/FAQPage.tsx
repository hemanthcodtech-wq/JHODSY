import React from 'react';
import { FAQS } from '../data/product';
import { AccordionItem } from '../components/common/Accordion';

export const FAQPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs font-bold tracking-[0.25em] text-[#BFC3C8] uppercase font-sans">
          HELP & ANSWERS
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-white font-serif">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-[#AEB6C2]">
          Everything you need to know about JHODSY Brightening Serum, ingredients, usage, and express shipping.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => (
          <AccordionItem key={idx} title={faq.q} defaultOpen={idx === 0}>
            <p className="text-xs sm:text-sm text-[#AEB6C2] leading-relaxed py-1">{faq.a}</p>
          </AccordionItem>
        ))}
      </div>
    </div>
  );
};
