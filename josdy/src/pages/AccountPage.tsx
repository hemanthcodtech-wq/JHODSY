import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Heart, HelpCircle, Info, ShieldCheck, PhoneCall, ChevronRight, LogOut } from 'lucide-react';
import { BRAND_INFO } from '../data/product';
import { useAuthStore } from '../store/useAuthStore';

export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, token, fetchProfile, logout } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      navigate('/login');
    }
  }, [fetchProfile, token, navigate]);

  if (!token) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const accountLinks = [
    { label: 'My Orders', desc: 'Track, return, or view past purchases', path: '/orders', icon: Package },
    { label: 'Saved Addresses', desc: 'Manage your primary delivery locations', path: '/checkout/address', icon: MapPin },
    { label: 'Wishlist', desc: 'Your saved skincare essentials', path: '/wishlist', icon: Heart },
    { label: 'Skincare Science', desc: 'Learn about our active molecular formulation', path: '/science', icon: ShieldCheck },
    { label: 'Customer Concierge', desc: 'Call our dedicated care team or WhatsApp', path: '/contact', icon: PhoneCall },
    { label: 'About JHODSY', desc: 'Our story, values, and vision', path: '/about', icon: Info },
    { label: 'Frequently Asked Questions', desc: 'Delivery, ingredients, and return answers', path: '/faq', icon: HelpCircle },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Profile Welcome Banner */}
      <div className="bg-[#0B192D] border border-white/10 rounded-3xl p-6 sm:p-8 flex items-center justify-between shadow-card-dark">
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
            <User className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-[#8994A3] font-medium">Welcome to JHODSY</span>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-serif">
              {user ? user.name || user.email.split('@')[0] : 'Skincare Lover!'}
            </h1>
            <p className="text-xs text-[#AEB6C2]">
              {user ? user.email : 'Member of the JHODSY Radiant Skin Circle'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="p-3 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors self-start"
          title="Log Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Account Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {accountLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="bg-[#0B192D] border border-white/10 hover:border-white/25 rounded-2xl p-5 flex items-center justify-between transition group shadow-card-dark"
            >
              <div className="flex items-center space-x-4">
                <div className="w-11 h-11 rounded-xl bg-[#071426] border border-white/10 flex items-center justify-center text-white group-hover:scale-105 transition">
                  <Icon className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#E7E7E7] transition">
                    {item.label}
                  </h3>
                  <p className="text-xs text-[#8994A3]">{item.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#8994A3] group-hover:text-white transition" />
            </Link>
          );
        })}
      </div>

      {/* Customer Care Callout */}
      <div className="bg-[#071426] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Need Assistance with your Order?</h4>
          <p className="text-xs text-[#AEB6C2] mt-0.5">Toll-Free: {BRAND_INFO.customerCare} · {BRAND_INFO.timings}</p>
        </div>
        <Link
          to="/contact"
          className="px-6 py-2.5 rounded-full bg-white text-[#071426] text-xs font-bold hover:bg-[#F5F5F5] transition"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
};
