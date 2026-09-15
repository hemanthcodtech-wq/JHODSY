import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { ShowcaseGrid } from '../components/presentation/ShowcaseGrid';
import { ScreenId } from '../types';

export const ShowcasePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectScreen = (screen: ScreenId) => {
    switch (screen) {
      case 'home':
        navigate('/');
        break;
      case 'shop':
        navigate('/shop');
        break;
      case 'product':
        navigate('/product/jhodsy-brightening-serum');
        break;
      case 'cart':
        navigate('/cart');
        break;
      case 'checkout-address':
        navigate('/checkout/address');
        break;
      case 'checkout-payment':
        navigate('/checkout/payment');
        break;
      case 'order-success':
        navigate('/order-success');
        break;
      case 'account':
        navigate('/account');
        break;
      case 'about':
        navigate('/about');
        break;
      default:
        navigate('/');
        break;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#03070D] text-white">
      {/* Top Banner with direct return button to the Real App */}
      <div className="w-full bg-[#071426] border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-bold text-white hover:text-[#D8D8D8] transition bg-white/10 px-4 py-2 rounded-full border border-white/15"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live E-Commerce Store</span>
        </Link>
        <div className="text-right">
          <span className="text-[11px] font-bold text-[#AEB6C2] uppercase tracking-widest">
            Visual Design Showcase Montage (6×2)
          </span>
        </div>
      </div>

      <ShowcaseGrid onSelectScreen={handleSelectScreen} />
    </div>
  );
};
