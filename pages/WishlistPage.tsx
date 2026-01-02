
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

interface WishlistPageProps {
  wishlist: Product[];
  onAddToCart: (p: Product) => void;
  onRemoveFromWishlist: (id: string) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ wishlist, onAddToCart, onRemoveFromWishlist }) => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Saved for Later</h1>
          <p className="text-slate-400 font-medium mt-1">Manage your most wanted premium essentials.</p>
        </div>
        <div className="bg-indigo-50 px-6 py-3 rounded-2xl flex items-center gap-4 border border-indigo-100">
           <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black">
              {wishlist.length}
           </div>
           <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Items in Wishlist</div>
        </div>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
          {wishlist.map(p => (
            <div key={p.id} className="relative group">
               <ProductCard product={p} onAddToCart={onAddToCart} />
               <button 
                onClick={() => onRemoveFromWishlist(p.id)}
                className="absolute top-6 right-6 p-2 bg-white/90 backdrop-blur-md rounded-xl text-rose-500 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" /></svg>
               </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
           </div>
           <h3 className="text-2xl font-black text-slate-900 mb-2">Your wishlist is empty.</h3>
           <p className="text-slate-400 max-w-xs mx-auto font-medium">Capture the products you love before they vanish from the catalog.</p>
           <Link to="/" className="inline-block mt-10 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 transition-all">Explore Collections</Link>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
