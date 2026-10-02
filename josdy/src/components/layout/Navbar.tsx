import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { JHODSY_ASSETS } from '../../data/assets';
import { useAuthStore } from '../../store/useAuthStore';

export const Navbar: React.FC = () => {
  const { totalCount } = useCart();
  const { wishlist } = useWishlist();
  const { user, token } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Science', path: '/science' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#071426]/95 backdrop-blur-md border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center space-x-3 sm:space-x-8">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 -ml-1 text-white/80 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link to="/" className="flex items-center space-x-2.5 group">
            <img
              src={JHODSY_ASSETS.logoSymbol}
              alt="JHODSY"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain transition group-hover:scale-105 brightness-[0.8]"
            />
            <span className="text-lg sm:text-xl font-bold tracking-[0.2em] text-[#C0C0C0] font-sans uppercase">
              JHODSY
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 pl-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-medium tracking-wide transition relative py-1 ${
                  isActive(link.path)
                    ? 'text-white font-semibold'
                    : 'text-[#AEB6C2] hover:text-white'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full"></span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center/Right: Search Bar & Icons */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Search Input Bar on Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative">
            <Search className="w-4 h-4 text-[#8994A3] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skincare products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 md:w-64 bg-[#0B192D] border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-[#8994A3] focus:outline-none focus:border-white/30"
            />
          </form>

          {/* User Profile */}
          <Link
            to={token ? (user?.role === 'admin' ? '/admin' : '/account') : '/login'}
            className="p-1.5 text-[#AEB6C2] hover:text-white transition"
            aria-label={token ? 'My Account' : 'Login'}
          >
            <User className="w-5 h-5 stroke-[1.8]" />
          </Link>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="p-1.5 text-[#AEB6C2] hover:text-white transition relative"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5 stroke-[1.8]" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></span>
            )}
          </Link>

          {/* Shopping Bag Cart with Real Badge */}
          <Link
            to="/cart"
            className="p-1.5 text-white transition relative flex items-center"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            <span className="absolute -top-1 -right-1 bg-white text-[#071426] text-[9.5px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
              {totalCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B192D] border-t border-white/10 px-5 py-4 space-y-3 animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="flex items-center relative pb-2">
            <Search className="w-4 h-4 text-[#8994A3] absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search skincare products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#071426] border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-[#8994A3] focus:outline-none"
            />
          </form>

          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-xl text-xs font-medium transition ${
                  isActive(link.path)
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-[#AEB6C2] hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
