
import React from 'react';
import { MOCK_ORDERS } from '../constants';

const OrdersPage: React.FC = () => {
  // Simulating user orders
  const userOrders = MOCK_ORDERS.filter(o => o.customerName === 'Sarah Wilson');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-600';
      case 'Shipped': return 'bg-blue-100 text-blue-600';
      case 'Processing': return 'bg-amber-100 text-amber-600';
      case 'Cancelled': return 'bg-rose-100 text-rose-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Order History</h1>
          <p className="text-slate-400 font-medium mt-1">Manage and track your recent purchases.</p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-black uppercase text-slate-400 tracking-widest">Member Status</div>
            <div className="text-indigo-600 font-black">Nova Platinum</div>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {userOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500">
            <div className="p-8 sm:p-10 flex flex-col md:flex-row gap-10">
              {/* Product Info */}
              <div className="flex-1 flex gap-6">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-50 rounded-3xl flex-shrink-0 overflow-hidden border border-slate-100">
                   <img 
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" 
                    className="w-full h-full object-cover" 
                    alt="Product"
                  />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Order {order.id}</div>
                    <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">{order.productName}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Ordered {order.date}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 tracking-tighter">${order.amount}</div>
                </div>
              </div>

              {/* Status Tracker */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="relative pt-6">
                  <div className="flex justify-between mb-4">
                    {['Placed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => (
                      <div key={step} className="flex flex-col items-center gap-2 z-10">
                         <div className={`w-4 h-4 rounded-full border-4 border-white shadow-sm transition-colors ${
                           order.status === 'Delivered' || (order.status === 'Shipped' && idx <= 2) || (order.status === 'Processing' && idx <= 1) || idx === 0
                           ? 'bg-indigo-600 scale-125' : 'bg-slate-200'
                         }`}></div>
                         <span className={`text-[9px] font-black uppercase tracking-widest ${
                           order.status === 'Delivered' || (order.status === 'Shipped' && idx <= 2) || (order.status === 'Processing' && idx <= 1) || idx === 0
                           ? 'text-indigo-600' : 'text-slate-300'
                         }`}>{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-[30px] left-4 right-4 h-1 bg-slate-100 -z-0 rounded-full">
                    <div className={`h-full bg-indigo-600 transition-all duration-1000 ${
                      order.status === 'Delivered' ? 'w-full' : 
                      order.status === 'Shipped' ? 'w-2/3' :
                      order.status === 'Processing' ? 'w-1/3' : 'w-0'
                    }`}></div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 justify-center min-w-[160px]">
                <button className="w-full bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">Track Order</button>
                <button className="w-full bg-slate-50 text-slate-400 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-all">Invoice</button>
              </div>
            </div>
          </div>
        ))}

        {userOrders.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
             </div>
             <h3 className="text-xl font-black text-slate-900">No active orders found.</h3>
             <p className="text-slate-400 font-medium max-w-xs mx-auto mt-2">Ready to start your next premium shopping experience?</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
