import React, { useState } from 'react';
import { StatusBar } from '../components/common/StatusBar';
import { AppHeader } from '../components/common/AppHeader';
import { ScreenId } from '../types';
import { Sparkles, Sun, Droplet, Star, Minus, Plus } from 'lucide-react';
import { PRIMARY_PRODUCT, FAQS } from '../data/product';
import { JHODSY_ASSETS } from '../data/assets';
import { useCart } from '../context/CartContext';
import { AccordionItem } from '../components/common/Accordion';

interface Screen05ProductDetailProps {
  onNavigate: (screen: ScreenId) => void;
  onShowToast?: (msg: string) => void;
}

export const Screen05_ProductDetail: React.FC<Screen05ProductDetailProps> = ({
  onNavigate,
  onShowToast
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Canonical gallery hierarchy from Section 7 of instructions
  const productGallery = [
    { src: JHODSY_ASSETS.serumWater, label: 'Hero Water' },       // assets (9).png
    { src: JHODSY_ASSETS.serumFront, label: 'Clean Front' },      // assets (10).png
    { src: JHODSY_ASSETS.serumBox, label: 'Serum & Box' },        // assets (11).png
    { src: JHODSY_ASSETS.serumClean, label: 'Bottle Shot' },      // assets (12).png
    { src: JHODSY_ASSETS.serumPackaging, label: 'Packaging' },    // product (2).png
    { src: JHODSY_ASSETS.serumSplashAlt, label: 'Splash' }        // product (1).png
  ];

  const handleAddToCart = () => {
    addToCart(PRIMARY_PRODUCT, quantity);
    onShowToast?.('Added JHODSY Brightening Serum to cart');
    onNavigate('cart');
  };

  return (
    <div className="relative w-full h-full bg-[#05080D] flex flex-col justify-between overflow-hidden select-none">
      <StatusBar time="9:41" />

      {/* Top Header */}
      <AppHeader
        showBack={true}
        onBack={() => onNavigate('shop')}
        onNavigate={onNavigate}
        rightAction="heart-share"
      />

      {/* Scrollable Product Details Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-28 space-y-4 no-scrollbar">
        {/* Large Hero Showcase */}
        <div className="relative w-full h-64 bg-gradient-to-b from-[#0B1E38]/80 to-[#071426] border border-white/10 rounded-2xl flex items-center justify-center p-4 overflow-hidden">
          <div className="absolute inset-0 bg-[#163660]/30 blur-2xl rounded-full scale-110 pointer-events-none"></div>
          <img
            src={productGallery[selectedImage].src}
            alt="JHODSY Brightening Serum"
            className="w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] relative z-10 transition-all duration-300"
          />
        </div>

        {/* Thumbnail Selector Carousel */}
        <div className="flex items-center justify-start space-x-2.5 overflow-x-auto no-scrollbar py-1">
          {productGallery.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`w-12 h-12 rounded-xl p-1 bg-[#0B192D] border flex-shrink-0 transition-all ${
                selectedImage === idx
                  ? 'border-white ring-1 ring-white/50 shadow-md scale-105'
                  : 'border-white/10 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={item.src} alt={item.label} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>

        {/* Product Heading & Subtitle */}
        <div className="space-y-1">
          <h2 className="text-[18px] font-bold text-white tracking-wide">
            JHODSY Brightening Serum
          </h2>

          <div className="flex items-center space-x-1.5 text-[11px] text-[#AEB6C2]">
            <Star className="w-3 h-3 fill-white text-white" />
            <span className="font-semibold text-white">4.8</span>
            <span>(100 reviews)</span>
          </div>

          <p className="text-[12px] text-[#8994A3] pt-0.5">
            For brighter, even-toned and radiant skin.
          </p>
        </div>

        {/* 3 Key Benefit Badges */}
        <div className="grid grid-cols-3 gap-2 py-1">
          <div className="bg-[#0B192D] border border-white/10 rounded-xl p-2.5 flex flex-col items-center text-center">
            <Sun className="w-4 h-4 text-white mb-1 stroke-[1.8]" />
            <span className="text-[9px] text-[#BFC3C8] font-medium leading-tight">
              Brightens<br />Skin Tone
            </span>
          </div>

          <div className="bg-[#0B192D] border border-white/10 rounded-xl p-2.5 flex flex-col items-center text-center">
            <Droplet className="w-4 h-4 text-white mb-1 stroke-[1.8]" />
            <span className="text-[9px] text-[#BFC3C8] font-medium leading-tight">
              Evens<br />Complexion
            </span>
          </div>

          <div className="bg-[#0B192D] border border-white/10 rounded-xl p-2.5 flex flex-col items-center text-center">
            <Sparkles className="w-4 h-4 text-white mb-1 stroke-[1.8]" />
            <span className="text-[9px] text-[#BFC3C8] font-medium leading-tight">
              Radiant<br />Glow
            </span>
          </div>
        </div>

        {/* Size Selection */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[11px] font-medium text-[#AEB6C2] tracking-wide">
            Size: <span className="text-white font-semibold">30ml</span>
          </label>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-1.5 rounded-lg bg-[#0B192D] border-2 border-white text-white text-[12px] font-semibold">
              30ml
            </button>
          </div>
        </div>

        {/* Expandable Accordions for Deep Brand Information */}
        <div className="pt-2 space-y-1">
          <AccordionItem title="Why You'll Love It" defaultOpen={true}>
            <p>
              JHODSY Brightening Serum is engineered to deliver a luminous, healthy glass-skin radiance. Its fast-absorbing formulation combats hyperpigmentation, restores moisture barrier integrity, and evens out discoloration without any sticky residue.
            </p>
          </AccordionItem>

          <AccordionItem title="Benefits">
            <ul className="list-disc list-inside space-y-1 text-[11.5px]">
              <li>Visibly illuminates dull complexion and refines skin texture.</li>
              <li>Diminishes the appearance of dark spots and blemishes.</li>
              <li>Delivers multi-depth hydration for all skin types.</li>
              <li>Lightweight, non-greasy, and dermatologically tested.</li>
            </ul>
          </AccordionItem>

          <AccordionItem title="How To Use">
            <ol className="list-decimal list-inside space-y-1 text-[11.5px]">
              {PRIMARY_PRODUCT.howToUse.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </AccordionItem>

          <AccordionItem title="Ingredients">
            <ul className="list-disc list-inside space-y-1 text-[11.5px]">
              {PRIMARY_PRODUCT.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </AccordionItem>

          <AccordionItem title="Suitable For">
            <p>
              All Skin Types — tailored for both Men and Women seeking a clean, high-performance skincare routine.
            </p>
          </AccordionItem>

          <AccordionItem title="Shipping & Returns">
            <p>
              Free Standard Delivery across India (2–4 business days). 7-day hassle-free return and replacement policy.
            </p>
          </AccordionItem>

          <AccordionItem title="Frequently Asked Questions">
            <div className="space-y-2 text-[11px]">
              {FAQS.slice(0, 3).map((faq, i) => (
                <div key={i} className="border-b border-white/5 pb-1.5 last:border-none">
                  <p className="font-semibold text-white">{faq.q}</p>
                  <p className="text-[#AEB6C2] mt-0.5">{faq.a}</p>
                </div>
              ))}
            </div>
          </AccordionItem>
        </div>
      </div>

      {/* Sticky Bottom Purchase Action Bar matching reference */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#071426]/95 backdrop-blur-md border-t border-white/10 p-4 z-40 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-[18px] font-bold text-white">₹559</span>
            <span className="text-[12px] text-[#8994A3] line-through">₹799</span>
            <span className="bg-white/15 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              30% OFF
            </span>
          </div>

          {/* Quantity Stepper */}
          <div className="flex items-center bg-[#0B192D] border border-white/15 rounded-lg px-2 py-1 space-x-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-[#AEB6C2] hover:text-white transition"
              aria-label="Decrease Quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-[12px] font-semibold text-white min-w-[12px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="text-[#AEB6C2] hover:text-white transition"
              aria-label="Increase Quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Add to Cart CTA */}
        <button
          onClick={handleAddToCart}
          className="w-full py-3 rounded-full bg-white text-[#071426] text-[14px] font-bold tracking-wide hover:bg-[#F5F5F5] active:scale-[0.98] transition shadow-lg flex items-center justify-center"
        >
          Add to Cart
        </button>

        {/* iPhone Home Indicator */}
        <div className="w-32 h-1 bg-white/30 rounded-full mx-auto -mb-1"></div>
      </div>
    </div>
  );
};
