
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSmartSuggestions } from '../services/geminiService';
import { User } from '../types';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  currentUser: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, wishlistCount, currentUser, onLogout }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length >= 3) {
        setIsSearching(true);
        const results = await getSmartSuggestions(query);
        setSuggestions(results);
        setIsSearching(false);
      } else {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query)}`);
      setSuggestions([]);
    }
  };

  return (
    <header className="glass-nav sticky top-0 z-50 border-b border-[#1A237E]/20">
      <div className="container mx-auto px-4 py-3.5 flex items-center justify-between gap-3 lg:gap-4">
        {/* Logo */}
        <Link to="/" className="text-xl lg:text-2xl font-black text-white flex items-center gap-2 tracking-tighter shrink-0">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#FF6F00] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF6F00]/20">
            <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span className="hidden lg:inline">NovaMart</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 relative">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-3 lg:left-4 flex items-center pointer-events-none">
              <svg className={`w-4 h-4 lg:w-5 lg:h-5 ${isSearching ? 'text-[#FF6F00] animate-pulse' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="w-full bg-white border-none focus:ring-2 focus:ring-[#FF6F00] rounded-xl py-2 lg:py-3 pl-9 lg:pl-12 pr-4 lg:pr-6 outline-none transition-all duration-300 font-bold text-xs lg:text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>

          {/* AI Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="px-6 py-2 bg-slate-50 border-b border-slate-100">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Smart Suggestions</span>
              </div>
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  className="w-full text-left px-6 py-3.5 hover:bg-slate-50 flex items-center gap-3 text-xs font-bold text-slate-700 transition-colors border-b last:border-0 border-slate-50"
                  onClick={() => {
                    setQuery(s);
                    navigate(`/?search=${encodeURIComponent(s)}`);
                    setSuggestions([]);
                  }}
                >
                  <svg className="w-3 h-3 text-[#FF6F00]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions - Conditionally hidden on mobile in favor of BottomNav */}
        <div className="flex items-center gap-3 lg:gap-6 shrink-0">
          <Link to="/wishlist" className="hidden lg:flex relative text-white hover:text-[#FFC107] transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D32F2F] text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="hidden lg:flex relative text-white hover:text-[#FFC107] transition-all items-center gap-2 group">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <div className="hidden xl:flex flex-col items-start -space-y-1">
              <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Bag</span>
              <span className="text-xs font-black">{cartCount} Items</span>
            </div>
          </Link>

          {currentUser ? (
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-8 h-8 lg:w-9 lg:h-9 bg-[#FFC107] rounded-lg flex items-center justify-center text-[#1A237E] font-black cursor-pointer hover:scale-105 transition-all text-xs"
              >
                {currentUser.name[0]}
              </button>
              
              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-4 duration-300 z-[100]">
                   <div className="px-4 py-3 border-b border-slate-50 mb-1">
                      <div className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{currentUser.name}</div>
                      <div className="text-[9px] text-slate-400 font-bold truncate tracking-widest">{currentUser.email}</div>
                   </div>
                   
                   {currentUser.role === 'ADMIN' && (
                     <Link to="/admin" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                       Admin Panel
                     </Link>
                   )}

                   <Link to="/orders" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#1A237E] rounded-lg transition-all">
                     Orders
                   </Link>
                   <button 
                    onClick={() => { onLogout(); setShowProfileMenu(false); navigate('/'); }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-all mt-1"
                   >
                     Logout
                   </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login"
              className="bg-[#FF6F00] text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl text-[10px] lg:text-xs font-black uppercase tracking-widest shadow-lg shadow-[#FF6F00]/20 hover:bg-[#FF8F00] transition-all active:scale-95"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
