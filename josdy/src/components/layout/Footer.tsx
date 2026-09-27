import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, MessageCircle, Mail, MapPin, ShieldCheck, RotateCcw, Truck, Award, Instagram } from 'lucide-react';
import { BRAND_INFO } from '../../data/product';
import { JHODSY_ASSETS } from '../../data/assets';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#03070D] text-white border-t border-white/10 pt-12 pb-24 md:pb-12 mt-16 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Reassurance Trust Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pb-10 border-b border-white/10">
          <div className="flex items-center space-x-3.5 p-4 rounded-2xl bg-[#071426]/60 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white flex-shrink-0">
              <Truck className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Free Delivery</h4>
              <p className="text-[11px] text-[#8994A3]">Across India (2–4 Days)</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-4 rounded-2xl bg-[#071426]/60 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white flex-shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">100% Secure</h4>
              <p className="text-[11px] text-[#8994A3]">Encrypted Payments</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-4 rounded-2xl bg-[#071426]/60 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white flex-shrink-0">
              <RotateCcw className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Easy Returns</h4>
              <p className="text-[11px] text-[#8994A3]">7-Day Replacement</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-4 rounded-2xl bg-[#071426]/60 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white flex-shrink-0">
              <Award className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Original Formula</h4>
              <p className="text-[11px] text-[#8994A3]">Dermatologist Tested</p>
            </div>
          </div>
        </div>

        {/* Middle Main Footer Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Mission Column */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2.5">
              <img src={JHODSY_ASSETS.logoSymbol} alt="JHODSY" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold tracking-[0.25em] text-white font-sans uppercase">
                JHODSY
              </span>
            </Link>
            <p className="text-xs text-[#AEB6C2] leading-relaxed">
              Science-backed luxury skincare engineered to deliver luminous glass-skin radiance and even complexion for everyone.
            </p>
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#8994A3]">
                GSTIN: {BRAND_INFO.gst}
              </span>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">Collections</h4>
            <ul className="space-y-2 text-xs text-[#AEB6C2]">
              <li>
                <Link to="/product/jhodsy-brightening-serum" className="hover:text-white transition">
                  JHODSY Brightening Serum (30ml)
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition">
                  All Serums & Treatments
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition">
                  Men's Skincare Essentials
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition">
                  Women's Radiant Formulations
                </Link>
              </li>
            </ul>
          </div>

          {/* Brand & Science */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">Company & Science</h4>
            <ul className="space-y-2 text-xs text-[#AEB6C2]">
              <li>
                <Link to="/about" className="hover:text-white transition">About JHODSY</Link>
              </li>
              <li>
                <Link to="/story" className="hover:text-white transition">Our Story</Link>
              </li>
              <li>
                <Link to="/science" className="hover:text-white transition">Skincare Science</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">Contact Concierge</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Address */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">Customer Care</h4>
            <div className="space-y-2 text-xs text-[#AEB6C2]">
              <a href={`tel:${BRAND_INFO.customerCare}`} className="flex items-center space-x-2 text-white font-semibold hover:underline">
                <PhoneCall className="w-4 h-4 text-white" />
                <span>{BRAND_INFO.customerCare} (Toll-Free)</span>
              </a>

              <a
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-[#25D366] font-semibold hover:underline"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp: {BRAND_INFO.whatsapp}</span>
              </a>

              <a
                href={(BRAND_INFO as any).instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-[#E1306C] font-semibold hover:underline"
              >
                <Instagram className="w-4 h-4" />
                <span>Follow on Instagram</span>
              </a>

              <a href={`mailto:${BRAND_INFO.email}`} className="flex items-center space-x-2 hover:text-white transition">
                <Mail className="w-4 h-4" />
                <span>{BRAND_INFO.email}</span>
              </a>

              <div className="flex items-start space-x-2 pt-1 text-[11px] text-[#8994A3]">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{BRAND_INFO.address.full}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Copyright Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8994A3] gap-4">
          <p>© {new Date().getFullYear()} JHODSY. All rights reserved. Registered Skincare Brand.</p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms & Conditions</Link>
            <Link to="/shipping" className="hover:text-white transition">Shipping Policy</Link>
            <Link to="/returns" className="hover:text-white transition">Returns & Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
