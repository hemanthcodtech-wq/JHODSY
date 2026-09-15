import React from 'react';
import { Link } from 'react-router-dom';
import { JHODSY_ASSETS } from '../data/assets';

export const StoryPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold tracking-[0.25em] text-[#BFC3C8] uppercase font-sans">
          THE GENESIS OF JHODSY
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-white font-serif">
          Our Brand Story
        </h1>
        <p className="text-sm sm:text-base text-[#AEB6C2]">
          Uncompromising skincare formulation dedicated to real confidence and authentic skin health.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#0B192D] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-card-dark">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-serif">Where Science Meets Luxury</h2>
          <p className="text-xs sm:text-sm text-[#AEB6C2] leading-relaxed">
            JHODSY was founded with a singular purpose: to deliver high-performance, clinical-grade brightening skincare that doesn't compromise on luxury or skin safety.
          </p>
          <p className="text-xs sm:text-sm text-[#AEB6C2] leading-relaxed">
            Too often, skincare products either promise quick results with harsh chemicals or offer luxury fragrances without genuine active delivery. We engineered JHODSY Brightening Serum to bridge this exact gap.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden border border-white/15 h-64 sm:h-80">
          <img src={JHODSY_ASSETS.womanProduct} alt="JHODSY Story" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#071426] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-card-dark">
        <div className="rounded-2xl overflow-hidden border border-white/15 h-64 sm:h-80 order-2 md:order-1">
          <img src={JHODSY_ASSETS.menWomen} alt="Confidence Looks Good on Everyone" className="w-full h-full object-cover" />
        </div>
        <div className="space-y-4 order-1 md:order-2">
          <h2 className="text-2xl font-bold text-white font-serif">A Universal Vision</h2>
          <p className="text-xs sm:text-sm text-[#AEB6C2] leading-relaxed">
            We believe healthy, radiant skin has no gender. Our textures are designed to be weightless, non-greasy, and rapidly absorbed—delivering optimal hydration and brightening whether you're starting your morning rush or finishing a nighttime routine.
          </p>
          <div className="pt-2">
            <Link
              to="/product/jhodsy-brightening-serum"
              className="inline-block px-6 py-3 rounded-full bg-white text-[#071426] text-xs font-bold hover:bg-[#F5F5F5] transition"
            >
              Shop The Serum →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
