import React from 'react';
import { IPhoneFrame } from '../common/IPhoneFrame';
import { Screen01_Splash } from '../../screens/Screen01_Splash';
import { Screen02_Onboarding } from '../../screens/Screen02_Onboarding';
import { Screen03_Home } from '../../screens/Screen03_Home';
import { Screen04_Shop } from '../../screens/Screen04_Shop';
import { Screen05_ProductDetail } from '../../screens/Screen05_ProductDetail';
import { Screen06_Cart } from '../../screens/Screen06_Cart';
import { Screen07_CheckoutAddress } from '../../screens/Screen07_CheckoutAddress';
import { Screen08_CheckoutPayment } from '../../screens/Screen08_CheckoutPayment';
import { Screen09_OrderSuccess } from '../../screens/Screen09_OrderSuccess';
import { Screen10_MyAccount } from '../../screens/Screen10_MyAccount';
import { Screen11_More } from '../../screens/Screen11_More';
import { Screen12_About } from '../../screens/Screen12_About';
import { ScreenId } from '../../types';

interface ShowcaseGridProps {
  onSelectScreen?: (screen: ScreenId) => void;
}

export const ShowcaseGrid: React.FC<ShowcaseGridProps> = ({ onSelectScreen }) => {
  const row1Screens = [
    { id: 'splash' as ScreenId, name: '01 · Splash Screen', component: <Screen01_Splash isStatic={true} onNavigate={onSelectScreen} /> },
    { id: 'onboarding' as ScreenId, name: '02 · Onboarding', component: <Screen02_Onboarding onNavigate={onSelectScreen} /> },
    { id: 'home' as ScreenId, name: '03 · Home', component: <Screen03_Home onNavigate={onSelectScreen || (() => {})} /> },
    { id: 'shop' as ScreenId, name: '04 · Shop / Catalog', component: <Screen04_Shop onNavigate={onSelectScreen || (() => {})} /> },
    { id: 'product' as ScreenId, name: '05 · Product Detail', component: <Screen05_ProductDetail onNavigate={onSelectScreen || (() => {})} /> },
    { id: 'cart' as ScreenId, name: '06 · Cart', component: <Screen06_Cart onNavigate={onSelectScreen || (() => {})} /> },
  ];

  const row2Screens = [
    { id: 'checkout-address' as ScreenId, name: '07 · Checkout Address', component: <Screen07_CheckoutAddress onNavigate={onSelectScreen || (() => {})} /> },
    { id: 'checkout-payment' as ScreenId, name: '08 · Checkout Payment', component: <Screen08_CheckoutPayment onNavigate={onSelectScreen || (() => {})} /> },
    { id: 'order-success' as ScreenId, name: '09 · Order Success', component: <Screen09_OrderSuccess onNavigate={onSelectScreen || (() => {})} /> },
    { id: 'account' as ScreenId, name: '10 · My Account', component: <Screen10_MyAccount onNavigate={onSelectScreen || (() => {})} /> },
    { id: 'more' as ScreenId, name: '11 · More / Settings', component: <Screen11_More onNavigate={onSelectScreen || (() => {})} /> },
    { id: 'about' as ScreenId, name: '12 · About JHODSY', component: <Screen12_About onNavigate={onSelectScreen || (() => {})} /> },
  ];

  return (
    <div className="w-full min-h-screen bg-[#03070D] text-white py-8 px-4 sm:px-6 lg:px-8 relative overflow-x-auto selection:bg-white/20">
      {/* Background Radial Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#0A2244]/25 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#0B1E38]/20 blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-[2600px] mx-auto relative z-10 space-y-12">
        {/* Showcase Header */}
        <div className="text-center space-y-2 pt-2 pb-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#D8D8D8] uppercase">
              JHODSY LUXURY SKINCARE UI SYSTEM
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-serif">
            Mobile-First E-Commerce Experience
          </h1>
          <p className="text-sm text-[#8994A3] max-w-2xl mx-auto">
            12-Screen Master Design Montage · iPhone Titanium Visual Mockup Presentation
          </p>
        </div>

        {/* ROW 1: Screens 01 – 06 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 px-2">
            <span className="text-xs font-bold tracking-widest text-[#AEB6C2] uppercase">
              Row 1 · Discovery & Purchase Funnel
            </span>
            <div className="flex-1 h-[1px] bg-white/10"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center">
            {row1Screens.map((item) => (
              <div key={item.id} className="flex flex-col items-center group w-full">
                <div className="w-full flex justify-center transform group-hover:-translate-y-2 transition-transform duration-300">
                  <IPhoneFrame isMockup={true}>
                    {item.component}
                  </IPhoneFrame>
                </div>
                <span className="text-[11px] font-semibold text-[#8994A3] mt-4 tracking-wider group-hover:text-white transition">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 2: Screens 07 – 12 */}
        <div className="space-y-4 pt-6">
          <div className="flex items-center space-x-3 px-2">
            <span className="text-xs font-bold tracking-widest text-[#AEB6C2] uppercase">
              Row 2 · Checkout, Account & Brand Identity
            </span>
            <div className="flex-1 h-[1px] bg-white/10"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center">
            {row2Screens.map((item) => (
              <div key={item.id} className="flex flex-col items-center group w-full">
                <div className="w-full flex justify-center transform group-hover:-translate-y-2 transition-transform duration-300">
                  <IPhoneFrame isMockup={true}>
                    {item.component}
                  </IPhoneFrame>
                </div>
                <span className="text-[11px] font-semibold text-[#8994A3] mt-4 tracking-wider group-hover:text-white transition">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
