import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const BottomNav: React.FC = () => {
  const { totalCount } = useCart();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Shop', path: '/shop', icon: ShoppingBag },
    { label: 'Cart', path: '/cart', icon: ShoppingCart, badge: totalCount },
    { label: 'Profile', path: '/account', icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#071426]/95 backdrop-blur-xl border-t border-white/10 px-4 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center space-y-1 relative transition-colors ${
                isActive ? 'text-white' : 'text-[#8994A3] hover:text-[#D8D8D8]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                  {Boolean(item.badge && item.badge > 0) && (
                    <span className="absolute -top-1.5 -right-2 bg-white text-[#071426] text-[9.5px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'text-white font-semibold' : 'text-[#8994A3]'}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};
