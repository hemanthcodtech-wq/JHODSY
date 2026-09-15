import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { PRIMARY_PRODUCT } from '../data/product';
import { JHODSY_ASSETS } from '../data/assets';
import { RatingStars } from '../components/common/RatingStars';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {});
  };

  const matches = query.trim()
    ? [PRIMARY_PRODUCT].filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.benefits.some((b) => b.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const popularTags = ['Brightening Serum', 'Face Serum', 'Radiant Glow', 'Evens Complexion', 'All Skin Types', '30ml'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="w-5 h-5 text-[#8994A3] absolute left-4 top-4" />
        <input
          type="text"
          autoFocus
          placeholder="Search skincare products, serums, ingredients..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchParams(e.target.value.trim() ? { q: e.target.value.trim() } : {});
          }}
          className="w-full bg-[#0B192D] border border-white/20 rounded-2xl pl-12 pr-12 py-3.5 text-sm sm:text-base text-white placeholder-[#8994A3] focus:outline-none focus:border-white/50 shadow-card-dark"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSearchParams({});
            }}
            className="absolute right-4 top-4 text-[#8994A3] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </form>

      {/* Results or Suggestions */}
      {query.trim() ? (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-[#AEB6C2]">
            Search Results for "<span className="text-white font-bold">{query}</span>" ({matches.length})
          </h2>

          {matches.length > 0 ? (
            <div className="space-y-3">
              {matches.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="bg-[#0B192D] border border-white/10 hover:border-white/25 rounded-2xl p-4 sm:p-6 flex items-center space-x-4 sm:space-x-6 transition group shadow-card-dark"
                >
                  <div className="w-20 h-20 bg-[#071426] rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                    <img src={JHODSY_ASSETS.serumFront} alt={product.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[10px] font-bold text-[#BFC3C8] uppercase tracking-wider">
                      {product.category} · {product.size}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-[#E7E7E7] transition truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <RatingStars rating={product.rating} count={product.reviewCount} size="sm" />
                    </div>
                    <div className="flex items-baseline space-x-2 pt-1">
                      <span className="text-base font-bold text-white">₹{product.price}</span>
                      <span className="text-xs text-[#8994A3] line-through">₹{product.mrp}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#8994A3] group-hover:text-white transition" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#0B192D] rounded-3xl border border-white/10 p-8 space-y-4">
              <p className="text-base font-bold text-white">No skincare products found matching "{query}"</p>
              <p className="text-xs text-[#AEB6C2]">Try searching for "Brightening Serum" or "Glow".</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6 pt-2">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#AEB6C2] uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-white" />
              <span>Popular Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(tag);
                    setSearchParams({ q: tag });
                  }}
                  className="px-4 py-2 rounded-full bg-[#0B192D] border border-white/10 hover:border-white/30 text-xs font-medium text-[#D8D8D8] transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
