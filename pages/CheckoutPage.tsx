
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';

interface CheckoutPageProps {
  cart: CartItem[];
  onClearCart: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, onClearCart }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + tax + shipping;

  const handleComplete = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onClearCart();
      navigate('/orders');
    }, 2000);
  };

  if (cart.length === 0) return <div className="p-20 text-center">Your bag is empty.</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Main Checkout Flow */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Header */}
          <div className="flex items-center justify-between bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             {[
               { s: 1, l: 'Shipping' },
               { s: 2, l: 'Payment' },
               { s: 3, l: 'Review' }
             ].map(i => (
               <div key={i.s} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all ${
                    step === i.s ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 
                    step > i.s ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {step > i.s ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg> : i.s}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${step === i.s ? 'text-slate-900' : 'text-slate-300'}`}>{i.l}</span>
               </div>
             ))}
          </div>

          {/* Form Content */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm min-h-[500px] flex flex-col">
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left duration-500">
                 <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black text-slate-900">Delivery Information</h3>
                    <button className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl">AI Auto-Fill</button>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Street Address</label>
                       <input className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500" placeholder="123 Luxury Lane" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">City</label>
                       <input className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500" placeholder="San Francisco" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Postal Code</label>
                       <input className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500" placeholder="94103" />
                    </div>
                 </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left duration-500">
                 <h3 className="text-2xl font-black text-slate-900">Payment Selection</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button className="p-6 border-2 border-indigo-600 rounded-[2rem] bg-indigo-50 text-left flex items-start justify-between">
                       <div>
                          <div className="font-black text-slate-900 text-sm">Credit Card</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Visa / Mastercard / Amex</div>
                       </div>
                       <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                       </div>
                    </button>
                    <button className="p-6 border-2 border-slate-100 rounded-[2rem] hover:border-indigo-200 text-left flex items-start justify-between">
                       <div>
                          <div className="font-black text-slate-900 text-sm">UPI / Digital Wallets</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Fast & Secure</div>
                       </div>
                    </button>
                    <button className="p-6 border-2 border-slate-100 rounded-[2rem] hover:border-indigo-200 text-left flex items-start justify-between">
                       <div>
                          <div className="font-black text-slate-900 text-sm">Cash on Delivery</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Available for this order</div>
                       </div>
                    </button>
                 </div>
                 
                 <div className="space-y-4 pt-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Card Number</label>
                       <input className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900" placeholder="•••• •••• •••• ••••" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <input className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900" placeholder="MM/YY" />
                       <input className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900" placeholder="CVC" />
                    </div>
                 </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left duration-500">
                 <div className="text-center py-10">
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                       <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900">Confirm Order</h3>
                    <p className="text-slate-400 font-medium max-w-sm mx-auto mt-2">Please review your items and address before final submission.</p>
                 </div>
                 
                 <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm font-bold p-4 bg-slate-50 rounded-2xl">
                         <span className="text-slate-600">{item.name} <span className="text-slate-300 ml-2">x{item.quantity}</span></span>
                         <span className="text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            <div className="mt-auto pt-10 flex justify-between items-center">
               <button 
                onClick={() => setStep(s => Math.max(1, s-1))}
                className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors ${step === 1 ? 'invisible' : ''}`}
               >
                 Go Back
               </button>
               {step < 3 ? (
                 <button 
                  onClick={() => setStep(s => s + 1)}
                  className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-100"
                 >
                   Continue to {step === 1 ? 'Payment' : 'Review'}
                 </button>
               ) : (
                 <button 
                  onClick={handleComplete}
                  disabled={isProcessing}
                  className="bg-indigo-600 text-white px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:scale-105 transition-all flex items-center gap-3"
                 >
                   {isProcessing ? (
                     <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Securing Order...
                     </>
                   ) : 'Confirm & Pay'}
                 </button>
               )}
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl sticky top-28 space-y-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Order Summary</h3>
              
              <div className="space-y-4 border-b border-slate-50 pb-8">
                 <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-slate-900">${subtotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Sales Tax (8%)</span>
                    <span className="text-slate-900">${tax.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-500' : 'text-slate-900'}>
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                 </div>
              </div>

              <div className="flex justify-between items-end">
                 <div className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Total Payable</div>
                 <div className="text-4xl font-black text-slate-900 tracking-tighter">${total.toFixed(2)}</div>
              </div>

              <div className="bg-slate-900 text-white p-6 rounded-3xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Security Assistant</div>
                 <p className="text-[10px] font-bold leading-relaxed text-slate-300">Your session is protected by end-to-end AES-256 encryption. We never store full card details.</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
