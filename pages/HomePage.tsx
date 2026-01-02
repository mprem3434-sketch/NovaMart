
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MOCK_PRODUCTS, HIERARCHICAL_CATEGORIES } from '../constants';
import ProductCard from '../components/ProductCard';
import { Product, Category } from '../types';

interface HomePageProps {
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  wishlistIds: Set<string>;
}

const HomePage: React.FC<HomePageProps> = ({ onAddToCart, onToggleWishlist, wishlistIds }) => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [sortBy, setSortBy] = useState('Featured');
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(['c1', 'c2']));
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, mins: 45, secs: 30 });
  
  const query = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
      if (!matchesSearch) return false;
      
      if (!selectedCategory) return true;
      
      const isMatch = p.category === selectedCategory.name || 
                      p.subCategory === selectedCategory.name;
      
      return isMatch;
    });

    if (sortBy === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'Top Rated') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [query, selectedCategory, sortBy]);

  const toggleExpand = (id: string) => {
    const next = new Set(expandedCats);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedCats(next);
  };

  const getBreadcrumbs = () => {
    const crumbs = [{ name: 'Home', target: null }];
    if (selectedCategory) {
      crumbs.push({ name: selectedCategory.name, target: selectedCategory });
    }
    return crumbs;
  };

  const SubCategoryGrid = () => {
    const visibleSubcats = selectedCategory 
      ? selectedCategory.children 
      : HIERARCHICAL_CATEGORIES;

    if (!visibleSubcats || visibleSubcats.length === 0) return null;

    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-12">
        {visibleSubcats.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setSelectedCategory(cat)}
            className="group bg-[#F9FAFB] p-6 rounded-xl border border-slate-100 hover:border-[#1976D2] hover:bg-white transition-all text-center flex flex-col items-center"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{cat.icon || '📦'}</div>
            <div className="text-xs font-black uppercase tracking-widest text-[#1976D2]">{cat.name}</div>
          </button>
        ))}
      </div>
    );
  };

  const FilterContent = () => (
    <div className="space-y-1">
      <button
        onClick={() => { setSelectedCategory(null); setShowMobileFilters(false); }}
        className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
          selectedCategory === null ? 'bg-[#1A237E] text-white' : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        All Marketplace
      </button>

      {HIERARCHICAL_CATEGORIES.map(cat => (
        <div key={cat.id} className="space-y-0.5">
          <div className="flex items-center justify-between group">
            <button
              onClick={() => { setSelectedCategory(cat); setShowMobileFilters(false); }}
              className={`flex-1 text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-3 uppercase tracking-widest ${
                selectedCategory?.id === cat.id ? 'bg-[#1A237E]/10 text-[#1A237E]' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
            {cat.children && (
              <button 
                onClick={() => toggleExpand(cat.id)}
                className={`p-1.5 hover:bg-slate-100 rounded-md text-slate-300 transition-transform ${expandedCats.has(cat.id) ? 'rotate-180' : ''}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
              </button>
            )}
          </div>
          
          {cat.children && expandedCats.has(cat.id) && (
            <div className="ml-6 space-y-0.5 border-l-2 border-slate-100 pl-3">
              {cat.children.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => { setSelectedCategory(sub); setShowMobileFilters(false); }}
                  className={`block w-full text-left px-4 py-2 rounded-md text-[10px] font-bold transition-all uppercase tracking-widest ${
                    selectedCategory?.id === sub.id ? 'text-[#1A237E]' : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="pb-24 md:pb-12 bg-white">
      {/* Sale Strip */}
      <div className="bg-[#D32F2F] text-white py-2 text-center text-[10px] font-black uppercase tracking-[0.25em]">
        <div className="container mx-auto px-4 flex items-center justify-center gap-6">
          <span>End of Season Sale — Up to 70% Off</span>
          <div className="flex items-center gap-3 font-mono">
            <span>{(timeLeft.mins).toString().padStart(2, '0')}m</span>
            <span>:</span>
            <span>{(timeLeft.secs).toString().padStart(2, '0')}s</span>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      {!query && !selectedCategory && (
        <section className="relative h-[400px] md:h-[550px] overflow-hidden bg-slate-900">
          <div className="absolute inset-0">
             <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80" 
              className="w-full h-full object-cover opacity-60" 
              alt="Hero"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A237E]/90 to-transparent"></div>
          </div>
          <div className="container mx-auto px-6 relative z-10 h-full flex items-center">
            <div className="max-w-xl text-white">
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter">Your Marketplace <br/><span className="text-[#FF6F00]">Redefined.</span></h1>
              <p className="text-lg mb-8 text-slate-200 font-medium max-w-sm leading-relaxed">Shop the latest trends in electronics, fashion, and home essentials with trust.</p>
              <div className="flex gap-4">
                <button className="bg-[#FF6F00] text-white px-10 py-4 rounded-lg font-black shadow-xl hover:bg-[#FF8F00] transition-all text-sm uppercase tracking-widest">
                  Shop Now
                </button>
                <button className="bg-white/10 backdrop-blur-md text-white border-2 border-white/20 px-10 py-4 rounded-lg font-black hover:bg-white/20 transition-all text-sm uppercase tracking-widest">
                  Best Sellers
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <div className="container mx-auto px-4 mt-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28">
              <h3 className="font-black text-[#1A237E] mb-6 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                <div className="w-1.5 h-4 bg-[#FF6F00] rounded-full"></div>
                Departments
              </h3>
              <FilterContent />
              
              <div className="mt-8 p-6 bg-[#1976D2]/10 rounded-xl border border-[#1976D2]/20">
                <h4 className="text-[10px] font-black uppercase text-[#1976D2] mb-2 tracking-widest">Prime Savings</h4>
                <p className="text-[11px] text-[#1976D2] font-bold mb-4">Get free next-day delivery on over 2M items.</p>
                <button className="w-full bg-[#1976D2] text-white py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md">Join Now</button>
              </div>
            </div>
          </aside>

          {/* Listing */}
          <main className="flex-1">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 mb-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {getBreadcrumbs().map((crumb, i) => (
                <React.Fragment key={i}>
                  <button onClick={() => setSelectedCategory(crumb.target as any)} className="hover:text-[#1A237E] transition-colors">{crumb.name}</button>
                  {i < getBreadcrumbs().length - 1 && <span>/</span>}
                </React.Fragment>
              ))}
            </nav>

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-[#333333] tracking-tight">
                {query ? `Search: "${query}"` : selectedCategory?.name || 'New Arrivals'}
              </h2>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Sort by</span>
                <select
                  className="bg-slate-50 border-none focus:ring-0 text-[10px] font-black text-[#1A237E] cursor-pointer uppercase tracking-widest rounded-lg px-3 py-2"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Top Rated</option>
                </select>
              </div>
            </div>

            {!query && <SubCategoryGrid />}

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(p => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    onAddToCart={onAddToCart} 
                    onToggleWishlist={onToggleWishlist}
                    isWishlisted={wishlistIds.has(p.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h3 className="text-xl font-black text-slate-900">No matches found</h3>
                <p className="text-slate-400 text-sm mt-2">Try adjusting your filters or search keywords.</p>
                <button onClick={() => setSelectedCategory(null)} className="mt-8 bg-[#1A237E] text-white px-8 py-3 rounded-lg text-xs font-black uppercase tracking-widest">Clear Selection</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
