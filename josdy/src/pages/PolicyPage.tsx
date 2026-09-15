import React from 'react';

interface PolicyPageProps {
  type: 'shipping' | 'returns' | 'terms' | 'privacy';
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ type }) => {
  const getPolicyContent = () => {
    switch (type) {
      case 'shipping':
        return {
          title: 'Shipping Policy',
          tag: 'LOGISTICS & DELIVERY',
          sections: [
            {
              h: 'Free Express Shipping Across India',
              p: 'We provide complimentary standard shipping on all orders of JHODSY Brightening Serum delivered across India, covering over 27,000+ pin codes.'
            },
            {
              h: 'Dispatch & Processing Timeline',
              p: 'Orders placed before 2:00 PM are processed and handed over to our logistics partners (Delhivery / Blue Dart) within 24 to 48 hours.'
            },
            {
              h: 'Delivery Estimates',
              p: 'Metro cities: 2 to 4 business days. Non-metro and regional locations: 3 to 6 business days. Real-time tracking links are provided upon dispatch.'
            },
            {
              h: 'Tamper-Proof Packaging',
              p: 'Every bottle is encased in heavy-duty dark UV glass and protected by tamper-evident luxury outer boxes to prevent any transit damage.'
            }
          ]
        };

      case 'returns':
        return {
          title: 'Returns & Refunds Policy',
          tag: '7-DAY GUARANTEE',
          sections: [
            {
              h: '7-Day Return & Replacement Policy',
              p: 'To ensure the highest hygiene and purity standards for cosmetic skincare formulations, unopened products in their original tamper-sealed packaging are eligible for return or replacement within 7 days of delivery.'
            },
            {
              h: 'Damaged or Defective Items',
              p: 'In the rare event that your product arrives damaged or broken during transit, contact us within 48 hours at 18008907404 or jhodsyskin@gmail.com with photographs. We will immediately dispatch a priority replacement at no extra charge.'
            },
            {
              h: 'Refund Processing',
              p: 'Approved refunds are credited back to your original payment method (Bank Account / UPI / Card) within 5–7 business days.'
            }
          ]
        };

      case 'terms':
        return {
          title: 'Terms & Conditions',
          tag: 'TERMS OF SERVICE',
          sections: [
            {
              h: 'Platform Usage',
              p: 'By visiting and purchasing from JHODSY, you agree to comply with our digital terms of service, fair pricing policies, and copyright restrictions.'
            },
            {
              h: 'Product Usage & Disclaimer',
              p: 'JHODSY Brightening Serum is a cosmetic topical formulation designed for external skincare use. Perform a patch test before first use. Not intended to diagnose, treat, or cure medical skin diseases.'
            },
            {
              h: 'Pricing Integrity',
              p: 'All prices are in Indian Rupees (INR) and inclusive of applicable GST taxes. We reserve the right to revise pricing and promotions at our discretion.'
            }
          ]
        };

      case 'privacy':
      default:
        return {
          title: 'Privacy Policy',
          tag: 'DATA PROTECTION & SECURITY',
          sections: [
            {
              h: 'Information We Collect',
              p: 'We collect customer names, delivery addresses, phone numbers, and email addresses solely to fulfill and deliver your skincare orders.'
            },
            {
              h: 'Payment Security',
              p: 'Your payment card numbers, UPI PINs, and banking credentials are never seen or stored on our servers. All transactions are securely processed through encrypted PCI-DSS certified payment gateways.'
            },
            {
              h: 'No Third-Party Data Selling',
              p: 'We strictly never sell, rent, or trade your personal information to third-party marketing companies.'
            }
          ]
        };
    }
  };

  const { title, tag, sections } = getPolicyContent();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs font-bold tracking-[0.25em] text-[#BFC3C8] uppercase font-sans">
          {tag}
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-white font-serif">
          {title}
        </h1>
      </div>

      <div className="bg-[#0B192D] border border-white/10 rounded-3xl p-6 sm:p-10 space-y-6 shadow-card-dark">
        {sections.map((sec, i) => (
          <div key={i} className="space-y-2 border-b border-white/5 pb-6 last:border-none last:pb-0">
            <h3 className="text-base sm:text-lg font-bold text-white font-serif">{sec.h}</h3>
            <p className="text-xs sm:text-sm text-[#AEB6C2] leading-relaxed">{sec.p}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
