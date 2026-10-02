import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Droplet, Sun, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { JHODSY_ASSETS } from '../data/assets';

export const SciencePage: React.FC = () => {
  const actives = [
    {
      name: 'Hyaluronic Acid',
      role: 'Deep Hydration',
      desc: 'Attracts and retains moisture to instantly plump fine lines and seal long-lasting hydration.'
    },
    {
      name: 'Tranexamic Acid',
      role: 'Pigmentation Corrector',
      desc: 'Effectively targets discoloration, melasma, and hyperpigmentation for a visibly brighter, even-toned complexion.'
    },
    {
      name: 'Niacinamide',
      role: 'Skin Barrier & Brightening',
      desc: 'Strengthens the skin barrier, reduces redness, and minimizes the appearance of pores while boosting overall radiance.'
    },
    {
      name: 'Sepiwhite (Undecylenoyl Phenylalanine)',
      role: 'Advanced Brightening',
      desc: 'An innovative molecule that gently regulates melanin production to fade persistent dark spots and illuminate the skin.'
    },
    {
      name: 'Lactic Acid',
      role: 'Gentle Exfoliation',
      desc: 'A gentle alpha hydroxy acid (AHA) that softly exfoliates dead skin cells, promoting a smoother texture and renewed glow.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-bold tracking-[0.25em] text-[#BFC3C8] uppercase font-sans">
          ACTIVE FORMULATION SCIENCE
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-white font-serif">
          Skincare Science
        </h1>
        <p className="text-sm sm:text-base text-[#AEB6C2]">
          Our dermatologically tested formulas combine advanced molecular carriers with proven active brightening agents.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0B192D] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-card-dark">
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-2xl font-bold text-white font-serif">Precision Active Delivery</h2>
          <p className="text-xs sm:text-sm text-[#AEB6C2] leading-relaxed">
            Unlike superficial serums that sit on the skin surface, JHODSY Brightening Serum utilizes lightweight botanical micro-emulsions to deliver active compounds directly to the epidermal junction.
          </p>
          <div className="space-y-2 pt-2 text-xs text-[#E7E7E7]">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
              <span>Bio-available stabilized active compounds</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
              <span>Dermatologically tested for zero comedogenicity</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
              <span>Optimal skin barrier balance at pH 5.5</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center">
          <div className="rounded-2xl overflow-hidden border border-white/15 w-full max-w-[320px] aspect-square shadow-card-dark">
            <img src={JHODSY_ASSETS.science} alt="Active Science" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Actives Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {actives.map((act, i) => (
          <div key={i} className="bg-[#071426] border border-white/10 rounded-2xl p-6 space-y-2 shadow-card-dark">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{act.role}</span>
            <h3 className="text-base font-bold text-white">{act.name}</h3>
            <p className="text-xs text-[#AEB6C2] leading-relaxed">{act.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
