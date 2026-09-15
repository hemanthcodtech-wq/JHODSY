import React from 'react';
import { StatusBar } from '../components/common/StatusBar';
import { AppHeader } from '../components/common/AppHeader';
import { ScreenId } from '../types';
import { BRAND_INFO } from '../data/product';

interface ScreenPolicyProps {
  type: 'shipping-policy' | 'returns-policy' | 'terms' | 'privacy' | 'story' | 'science';
  onNavigate: (screen: ScreenId) => void;
}

export const Screen_Policy: React.FC<ScreenPolicyProps> = ({ type, onNavigate }) => {
  const getPolicyContent = () => {
    switch (type) {
      case 'shipping-policy':
        return {
          title: 'Shipping Policy',
          sections: [
            {
              h: 'Shipping Areas',
              p: 'We deliver all over India to 27,000+ pin codes through reputed express logistics partners including Delhivery, BlueDart, and DTDC.'
            },
            {
              h: 'Processing Time',
              p: 'All orders are verified, securely packed, and dispatched within 24–48 hours of order confirmation.'
            },
            {
              h: 'Delivery Time',
              p: 'Standard shipping takes 2 to 4 business days for metro cities, and 3 to 6 business days for the rest of India.'
            },
            {
              h: 'Shipping Charges',
              p: 'Enjoy FREE Standard Delivery on all orders of JHODSY Brightening Serum.'
            },
            {
              h: 'Order Tracking',
              p: 'Once dispatched, live tracking links are shared via SMS, WhatsApp, and email.'
            }
          ]
        };

      case 'returns-policy':
        return {
          title: 'Returns & Refunds',
          sections: [
            {
              h: 'Return Eligibility',
              p: 'To ensure the highest hygiene and purity standards for luxury skincare, unopened items in original tamper-evident packaging are eligible for return within 7 days of delivery.'
            },
            {
              h: 'Damaged or Incorrect Item',
              p: 'If your item arrives damaged, leaking, or incorrect, contact us immediately at 18008907404 or jhodsyskin@gmail.com with photos for an immediate priority replacement.'
            },
            {
              h: 'Refund Processing',
              p: 'Approved refunds are processed back to the original payment method within 5–7 business days.'
            }
          ]
        };

      case 'story':
        return {
          title: 'Our Story',
          sections: [
            {
              h: 'The Genesis of JHODSY',
              p: 'JHODSY was founded with a single uncompromising philosophy: luxury skincare should be grounded in rigorous scientific formulation while celebrating the natural confidence in every skin tone.'
            },
            {
              h: 'Universal Skincare',
              p: 'We believe radiant, healthy skin knows no gender barriers. Every single batch is crafted with precision to deliver luminous clarity and supreme hydration.'
            }
          ]
        };

      case 'science':
        return {
          title: 'Skincare Science',
          sections: [
            {
              h: 'Active Molecular Delivery',
              p: 'Our Brightening Serum combines multi-weight hyaluronic acid complexes to deliver deep dermal hydration alongside stabilized antioxidant Vitamin C and Alpha Arbutin.'
            },
            {
              h: 'Dermatologically Balanced',
              p: 'Formulated at optimal pH 5.5, preserving skin barrier integrity while enhancing natural collagen synthesis.'
            }
          ]
        };

      case 'terms':
        return {
          title: 'Terms & Conditions',
          sections: [
            {
              h: 'Overview',
              p: 'By using the JHODSY platform, you agree to our terms of retail sale, digital terms, and pricing integrity.'
            },
            {
              h: 'Product Usage',
              p: 'Products are for personal external cosmetic use. Follow all label instructions.'
            }
          ]
        };

      case 'privacy':
      default:
        return {
          title: 'Privacy Policy',
          sections: [
            {
              h: 'Data Protection',
              p: 'We respect your privacy. Your address and contact information are solely used to fulfill orders and provide verified concierge customer updates.'
            },
            {
              h: 'Secure Transactions',
              p: 'Payment transactions are processed through 256-bit encrypted PCI-DSS certified gateways.'
            }
          ]
        };
    }
  };

  const { title, sections } = getPolicyContent();

  return (
    <div className="relative w-full h-full bg-[#05080D] flex flex-col justify-between overflow-hidden select-none">
      <StatusBar time="9:41" />

      {/* Header */}
      <AppHeader
        title={title}
        showBack={true}
        onBack={() => onNavigate('more')}
        onNavigate={onNavigate}
        rightAction="none"
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-6 space-y-4 text-left no-scrollbar">
        {sections.map((sec, i) => (
          <div key={i} className="bg-[#0B192D] border border-white/10 rounded-2xl p-4 space-y-1.5 shadow-card-dark">
            <h4 className="text-[13px] font-bold text-white tracking-wide">{sec.h}</h4>
            <p className="text-[11.5px] text-[#AEB6C2] leading-relaxed">{sec.p}</p>
          </div>
        ))}
      </div>

      {/* iPhone Home Indicator */}
      <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mb-2"></div>
    </div>
  );
};
