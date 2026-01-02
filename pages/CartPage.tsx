
import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../types';

interface CartPageProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

const CartPage: React.FC<CartPageProps> = ({ cart, onUpdateQuantity, onRemove }) => {
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-slate-200">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Your bag is empty</h2>
        <p className="text-slate-400 mb-10 max-w-sm mx-auto font-medium">Capture your premium essentials before they vanish from the showcase.</p>
        <Link to="/" className="inline-block bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-amber-500 hover:text-slate-900 transition-all">
          Explore Showcase
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex flex-col sm:flex-row items-end justify-between gap-6 mb-16">
        <div>
          <div className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] mb-2">Shopping Bag</div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Review Selection</h1>
        </div>
        <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Continue Browsing</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          {cart.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-8 p-8 bg-white rounded-[3rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)] relative group">
              <div className="w-40 h-40 bg-slate-50 rounded-[2rem] overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-black text-2xl text-slate-900 mb-1 tracking-tight">{item.name}</h3>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{item.category}</p>
                  </div>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="p-3 bg-slate-50 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between mt-8">
                  <div className="flex items-center bg-slate-100 rounded-2xl p-2 px-4 gap-6">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="text-slate-400 hover:text-slate-900 font-black text-lg transition-colors"
                    >
                      -
                    </button>
                    <span className="w-4 text-center font-black text-slate-900 text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="text-slate-400 hover:text-slate-900 font-black text-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-2xl font-black text-slate-900 tracking-tighter">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-900 text-white rounded-[3.5rem] p-10 shadow-[0_50px_100px_rgba(15,23,42,0.2)] sticky top-28 border border-white/5 overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <h3 className="text-2xl font-black mb-10 tracking-tight">Financial Summary</h3>
            
            <div className="space-y-6 mb-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <div className="flex justify-between">
                <span>Gross Value</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className={`text-white ${shipping === 0 ? 'text-amber-500' : ''}`}>
                  {shipping === 0 ? 'COMPLIMENTARY' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax (8%)</span>
                <span className="text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-white/10 pt-6 flex justify-between items-end">
                <span className="text-slate-400">Total Payable</span>
                <span className="text-4xl font-black text-amber-500 tracking-tighter">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <Link to="/checkout" className="w-full bg-amber-500 text-slate-900 py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-widest text-center block shadow-2xl shadow-amber-500/10 hover:bg-white transition-all transform hover:-translate-y-1">
                Begin Checkout
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Encrypted Checkout</span>
               <div className="flex gap-4 opacity-50">
                  <div className="w-8 h-5 bg-white/10 rounded"></div>
                  <div className="w-8 h-5 bg-white/10 rounded"></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
