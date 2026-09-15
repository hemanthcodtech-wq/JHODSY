import React from 'react';
import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { ScreenId } from '../../types';
import { useCart } from '../../context/CartContext';

interface BottomNavigationProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentScreen, onNavigate }) => {
  const { totalCount } = useCart();

  const navItems: { id: ScreenId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'cart', label: 'Cart', icon: ShoppingCart },
    { id: 'account', label: 'Profile', icon: User }
  ];

  const isActive = (id: ScreenId) => {
    if (id === 'home') return currentScreen === 'home';
    if (id === 'shop') return currentScreen === 'shop' || currentScreen === 'product';
    if (id === 'cart') return currentScreen === 'cart' || currentScreen === 'checkout-address' || currentScreen === 'checkout-payment';
    if (id === 'account') return currentScreen === 'account' || currentScreen === 'more' || currentScreen === 'about' || currentScreen === 'orders';
    return false;
  };

  return (
    <div className="w-full bg-[#071426]/95 backdrop-blur-md border-t border-white/10 pt-2 pb-5 px-6 flex items-center justify-around z-40 select-none">
      {navItems.map(item => {
        const active = isActive(item.id);
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center space-y-1 relative transition-colors duration-200 ${
              active ? 'text-white' : 'text-[#8994A3] hover:text-[#D8D8D8]'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${active ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
              {item.id === 'cart' && totalCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-white text-[#071426] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {totalCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-medium tracking-wide ${active ? 'text-white font-semibold' : 'text-[#8994A3]'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
