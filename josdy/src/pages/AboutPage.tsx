import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Award, Users, ArrowRight } from 'lucide-react';
import { BRAND_INFO } from '../data/product';
import { JHODSY_ASSETS } from '../data/assets';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
      {/* Brand Hero */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border border-white/10 mx-auto shadow-card-dark">
          <img src={JHODSY_ASSETS.logoWater} alt="JHODSY" className="w-full h-full object-cover" />
        </div>
        <span className="text-xs font-bold tracking-[0.25em] text-[#BFC3C8] uppercase font-sans">
          SKINCARE FOR A BRIGHTER TOMORROW
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-white font-serif">
          About JHODSY
        </h1>
        <p className="text-sm sm:text-base text-[#AEB6C2] leading-relaxed">
          {BRAND_INFO.aboutText}
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#0B192D] border border-white/10 rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-card-dark">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white">
            <Sparkles className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h3 className="text-base font-bold text-white">Science Backed</h3>
          <p className="text-xs text-[#AEB6C2] leading-relaxed">
            Formulated with multi-weight Hyaluronic Acid, stabilized Vitamin C, and pure active botanicals.
          </p>
        </div>

        <div className="bg-[#0B192D] border border-white/10 rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-card-dark">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white">
            <Award className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h3 className="text-base font-bold text-white">Premium Quality</h3>
          <p className="text-xs text-[#AEB6C2] leading-relaxed">
            Purity and potency guaranteed in dark UV-protective glass packaging with precision dropper.
          </p>
        </div>

        <div className="bg-[#0B192D] border border-white/10 rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-card-dark">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white">
            <Users className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h3 className="text-base font-bold text-white">For All Skin Types</h3>
          <p className="text-xs text-[#AEB6C2] leading-relaxed">
            Universal unisex skincare formulated to give every skin tone a radiant, luminous glow.
          </p>
        </div>
      </div>

      {/* Pull Quote */}
      <div className="bg-[#071426] border border-white/10 rounded-3xl p-8 sm:p-12 text-center shadow-card-dark">
        <blockquote className="text-xl sm:text-2xl italic font-serif text-white max-w-xl mx-auto">
          {BRAND_INFO.quote}
        </blockquote>
        <p className="text-xs font-bold tracking-widest text-[#8994A3] uppercase mt-3">
          — The JHODSY Skincare Philosophy
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          to="/product/jhodsy-brightening-serum"
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-white text-[#071426] text-sm font-bold hover:bg-[#F5F5F5] transition shadow-lg"
        >
          <span>Experience JHODSY Brightening Serum</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
