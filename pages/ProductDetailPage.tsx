
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../constants';
import { getProductAnalysis } from '../services/geminiService';
import { Product } from '../types';

interface ProductDetailPageProps {
  onAddToCart: (p: Product) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  const [aiTip, setAiTip] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'Description' | 'Specs' | 'Delivery'>('Description');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setActiveImage(product.image);
      setLoadingAi(true);
      getProductAnalysis(product.name).then(tip => {
        setAiTip(tip || '');
        setLoadingAi(false);
      });
    }
  }, [product]);

  if (!product) return null;

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl pb-40 md:pb-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-3 mb-10 text-[10px] font-black uppercase tracking-[0.25em]">
        <Link to="/" className="text-slate-400 hover:text-slate-900 transition-colors">Marketplace</Link>
        <svg className="w-3 h-3 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
        <span className="text-slate-400">{product.category}</span>
        <svg className="w-3 h-3 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
        <span className="text-amber-600">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Left Column: Media */}
        <div className="space-y-8">
          <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-white border border-slate-100 shadow-[0_50px_100px_rgba(0,0,0,0.05)] relative group">
             <img src={activeImage} alt={product.name} className="w-full h-full object-cover transition-opacity duration-700" />
             {product.isBestSeller && (
               <div className="absolute top-8 left-8 bg-amber-500 text-slate-900 px-6 py-3 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl">Verified Seller</div>
             )}
          </div>
          <div className="grid grid-cols-5 gap-4">
             {productImages.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-[1.5rem] overflow-hidden cursor-pointer transition-all border-2 ${activeImage === img ? 'border-amber-500 scale-95 shadow-xl' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                   <img src={img} className="w-full h-full object-cover" alt={`Thumb ${i}`} />
                </div>
             ))}
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="flex flex-col">
          <div className="inline-flex items-center gap-3 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.25em] mb-8 w-fit shadow-xl shadow-slate-200">
             <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 6.707l-4.5 4.5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L8.5 11.086l3.793-3.793a1 1 0 011.414 1.414z" /></svg>
             Official Brand Product
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.9]">{product.name}</h1>
          
          <div className="flex items-center gap-8 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-2xl">
              <svg className="w-5 h-5 text-amber-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <span className="text-sm font-black text-amber-700">{product.rating} Rating</span>
            </div>
            <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{product.reviews} Verified Reviews</span>
          </div>

          <div className="flex items-end gap-6 mb-12">
             <div className="flex flex-col">
                <span className="text-7xl font-black text-slate-900 tracking-tighter leading-none">${product.price}</span>
                {product.oldPrice && (
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-2xl text-slate-300 line-through font-bold">${product.oldPrice}</span>
                    <span className="bg-rose-600 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-rose-100">
                      -{Math.round((product.oldPrice - product.price) / product.oldPrice * 100)}% Discount
                    </span>
                  </div>
                )}
             </div>
          </div>

          {/* AI Feature Component */}
          <div className="bg-slate-900 rounded-[3rem] p-10 mb-12 text-white relative overflow-hidden shadow-[0_40px_80px_rgba(15,23,42,0.15)] border border-white/5">
            <div className="absolute top-0 right-0 p-6 opacity-10">
               <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div className="relative z-10 flex items-start gap-6">
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl shadow-amber-500/20">
                <svg className="w-7 h-7 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div className="flex-1">
                <h4 className="text-[10px] font-black uppercase tracking-[0.25em] mb-3 text-amber-500">Intelligent Analysis</h4>
                <p className={`text-xl leading-relaxed font-black italic tracking-tight ${loadingAi ? 'shimmer text-transparent rounded h-12 w-full' : ''}`}>
                  {loadingAi ? '' : `"${aiTip}"`}
                </p>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex items-center bg-slate-100 rounded-[2rem] p-3 h-20 w-full sm:w-56">
                 <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="flex-1 text-slate-400 hover:text-slate-900 transition-colors font-black text-lg">-</button>
                 <span className="w-16 text-center font-black text-slate-900 text-xl">{quantity}</span>
                 <button onClick={() => setQuantity(q => q+1)} className="flex-1 text-slate-400 hover:text-slate-900 transition-colors font-black text-lg">+</button>
              </div>
              <button
                onClick={() => onAddToCart(product)}
                className="flex-[2] bg-amber-500 text-slate-900 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-3xl shadow-amber-500/10 hover:bg-slate-900 hover:text-white hover:scale-[1.02] transition-all flex items-center justify-center gap-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                Secure Purchase
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="mt-4">
               <div className="flex border-b border-slate-100 mb-10 overflow-x-auto no-scrollbar">
                  {['Description', 'Specs', 'Delivery'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest border-b-4 transition-all whitespace-nowrap ${activeTab === tab ? 'border-amber-500 text-slate-900' : 'border-transparent text-slate-400'}`}
                    >
                      {tab}
                    </button>
                  ))}
               </div>
               <div className="min-h-[200px] animate-in fade-in duration-700">
                  {activeTab === 'Description' && (
                    <div className="text-slate-500 text-xl leading-relaxed font-medium tracking-tight">
                      <p>{product.description}</p>
                    </div>
                  )}
                  {activeTab === 'Specs' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {product.specifications?.map((spec, i) => (
                         <div key={i} className="flex justify-between p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                           <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{spec.label}</span>
                           <span className="text-xs font-black text-slate-900">{spec.value}</span>
                         </div>
                       ))}
                    </div>
                  )}
                  {activeTab === 'Delivery' && (
                    <div className="space-y-6">
                       <div className="p-8 bg-slate-50 rounded-[2.5rem] flex items-center gap-8 border border-slate-100">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                             <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" /></svg>
                          </div>
                          <div>
                            <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1">Standard Logistics</h5>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">3-5 Business Days</p>
                          </div>
                       </div>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-2xl p-5 border-t border-slate-200 flex items-center gap-4 z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
         <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Global Price</span>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">${product.price}</span>
         </div>
         <button onClick={() => onAddToCart(product)} className="flex-1 bg-amber-500 text-slate-900 py-4.5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl">Add to Bag</button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
