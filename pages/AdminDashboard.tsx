
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { MOCK_ORDERS, MOCK_PRODUCTS, MOCK_USERS, MOCK_SELLERS, HIERARCHICAL_CATEGORIES, MOCK_TICKETS } from '../constants';
import { generateAIDescription, generateSEOData } from '../services/geminiService';
import { Product, Order, User, Category } from '../types';

const COLORS = ['#1A237E', '#FF6F00', '#1976D2', '#D32F2F', '#388E3C'];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Overview');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Data States
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  
  // UI States
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newProd, setNewProd] = useState<Partial<Product>>({
    name: '', sku: '', brand: '', category: 'Electronics', price: 0, stock: 0, status: 'Draft',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    description: '', specifications: []
  });

  const handleAIService = async (service: 'desc' | 'seo') => {
    if (!newProd.name) return alert('Enter product name first');
    setIsGenerating(true);
    try {
      if (service === 'desc') {
        const desc = await generateAIDescription(newProd.name, newProd.category!);
        setNewProd(prev => ({ ...prev, description: desc }));
      }
    } catch (e) { console.error(e); }
    setIsGenerating(false);
  };

  const saveProduct = () => {
    const finalProd: Product = { ...newProd as Product, id: Date.now().toString(), rating: 5, reviews: 0 };
    setProducts([finalProd, ...products]);
    setShowAddProduct(false);
    setFormStep(1);
  };

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '$128,430', trend: '+14%', color: 'text-green-600', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2' },
          { label: 'Active Orders', value: orders.length.toString(), trend: '+8%', color: 'text-indigo-600', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
          { label: 'Total Customers', value: users.length.toString(), trend: '+22%', color: 'text-orange-600', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197' },
          { label: 'Pending Tickets', value: MOCK_TICKETS.length.toString(), trend: 'Stable', color: 'text-rose-600', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
        ].map((metric, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-slate-50 text-slate-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={metric.icon} /></svg>
              </div>
              <span className={`text-[10px] font-black ${metric.color}`}>{metric.trend}</span>
            </div>
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{metric.label}</h3>
            <p className="text-2xl font-black text-slate-900 mt-1">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 tracking-tight mb-8">Weekly Sales Trend</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Mon', rev: 4000 }, { name: 'Tue', rev: 3000 }, { name: 'Wed', rev: 5000 },
                { name: 'Thu', rev: 2780 }, { name: 'Fri', rev: 4890 }, { name: 'Sat', rev: 6390 }, { name: 'Sun', rev: 7000 }
              ]}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A237E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1A237E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip />
                <Area type="monotone" dataKey="rev" stroke="#1A237E" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 tracking-tight mb-8">Recent Activity</h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-[#1A237E] shadow-sm">
                    {order.customerName[0]}
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">{order.customerName}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{order.productName}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-slate-900">${order.amount}</div>
                  <div className={`text-[9px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'text-green-600' : 'text-amber-600'}`}>
                    {order.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Product Catalog</h2>
        <button onClick={() => setShowAddProduct(true)} className="bg-[#FF6F00] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 hover:bg-[#FF8F00] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
          New Product
        </button>
      </div>
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-8 py-4">Product Name</th>
              <th className="px-8 py-4">Category</th>
              <th className="px-8 py-4">Price</th>
              <th className="px-8 py-4">Stock Status</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="text-xs font-bold text-slate-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-8 py-4 text-[10px] font-black uppercase text-slate-500">{p.category}</td>
                <td className="px-8 py-4 text-xs font-black text-slate-900">${p.price}</td>
                <td className="px-8 py-4">
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                      <span className="text-xs font-black text-slate-600">{p.stock} units</span>
                   </div>
                </td>
                <td className="px-8 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-[#1A237E]"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                  <button className="p-2 text-slate-400 hover:text-rose-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" /></svg></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manage Orders</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-400">Export CSV</button>
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-8 py-4">Order ID</th>
              <th className="px-8 py-4">Customer</th>
              <th className="px-8 py-4">Total</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4">Date</th>
              <th className="px-8 py-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-4 text-xs font-black text-indigo-600">{o.id}</td>
                <td className="px-8 py-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">{o.customerName}</span>
                    <span className="text-[10px] text-slate-400">{o.customerEmail}</span>
                  </div>
                </td>
                <td className="px-8 py-4 text-xs font-black text-slate-900">${o.amount}</td>
                <td className="px-8 py-4">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    o.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                  }`}>{o.status}</span>
                </td>
                <td className="px-8 py-4 text-xs text-slate-500 font-bold">{o.date}</td>
                <td className="px-8 py-4 text-right">
                  <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Category Management</h2>
        <button className="bg-[#1A237E] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Add Root Category</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {HIERARCHICAL_CATEGORIES.map(cat => (
          <div key={cat.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:border-indigo-600 transition-colors">
             <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{cat.icon}</div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                   <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-rose-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" /></svg></button>
                </div>
             </div>
             <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-1">{cat.name}</h3>
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{cat.itemCount} Active Items</div>
             
             {cat.children && (
               <div className="space-y-2 border-t border-slate-50 pt-4">
                  {cat.children.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between text-xs font-bold text-slate-600 hover:text-indigo-600 cursor-pointer">
                       <span>{sub.name}</span>
                       <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded-full">{sub.itemCount}</span>
                    </div>
                  ))}
               </div>
             )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Customer Database</h2>
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-8 py-4">Customer</th>
              <th className="px-8 py-4">Role</th>
              <th className="px-8 py-4">Joined</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-black">{u.name[0]}</div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900">{u.name}</span>
                      <span className="text-[10px] text-slate-400">{u.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${u.role === 'ADMIN' ? 'text-indigo-600' : 'text-slate-500'}`}>{u.role}</span>
                </td>
                <td className="px-8 py-4 text-xs text-slate-500 font-bold">{u.joinDate}</td>
                <td className="px-8 py-4">
                   <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                      <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                      {u.status}
                   </span>
                </td>
                <td className="px-8 py-4 text-right">
                   <button className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline">Block</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Business Intelligence</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
           <h3 className="text-lg font-black text-slate-900 tracking-tight mb-8">Revenue Breakdown</h3>
           <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={[
                   { name: 'Jan', val: 45000 }, { name: 'Feb', val: 52000 }, { name: 'Mar', val: 48000 },
                   { name: 'Apr', val: 61000 }, { name: 'May', val: 55000 }, { name: 'Jun', val: 67000 }
                 ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                    <Tooltip />
                    <Bar dataKey="val" fill="#1A237E" radius={[8, 8, 0, 0]} barSize={40} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
           <h3 className="text-lg font-black text-slate-900 tracking-tight mb-8">Category Share</h3>
           <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={[
                      { name: 'Electronics', value: 400 }, { name: 'Fashion', value: 300 },
                      { name: 'Beauty', value: 300 }, { name: 'Home', value: 200 }
                    ]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                       {COLORS.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                 {HIERARCHICAL_CATEGORIES.slice(0, 4).map((c, i) => (
                   <div key={c.id} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                      <span className="text-[10px] font-black uppercase text-slate-400">{c.name}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">System Settings</h2>
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-50">
        <div className="p-8">
           <h3 className="text-lg font-black text-slate-900 mb-6">Store Identity</h3>
           <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Store Name</label>
                    <input className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold" defaultValue="NovaMart Premium" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Support Email</label>
                    <input className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold" defaultValue="concierge@novamart.com" />
                 </div>
              </div>
           </div>
        </div>
        <div className="p-8">
           <h3 className="text-lg font-black text-slate-900 mb-6">Security & Access</h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                 <div>
                    <div className="text-xs font-black text-slate-900 uppercase">Two-Factor Authentication</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Mandatory for all Admin roles</div>
                 </div>
                 <div className="w-12 h-6 bg-indigo-600 rounded-full relative flex items-center px-1">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
                 </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                 <div>
                    <div className="text-xs font-black text-slate-900 uppercase">API Access</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Generate production secret keys</div>
                 </div>
                 <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Regenerate</button>
              </div>
           </div>
        </div>
        <div className="p-8 bg-slate-50/50 flex justify-end">
           <button className="bg-[#FF6F00] text-white px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Save Changes</button>
        </div>
      </div>
    </div>
  );

  const SideNav = () => (
    <nav className="flex flex-col h-full">
      <div className={`mb-12 transition-all ${isCollapsed ? 'px-0 text-center' : 'px-2'}`}>
        <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-tighter">
          <div className="w-10 h-10 bg-[#FF6F00] rounded-xl flex items-center justify-center text-white shadow-xl shadow-black/20 flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          {!isCollapsed && <span>Nova Admin</span>}
        </h2>
      </div>

      <div className="space-y-1">
        {[
          { id: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z' },
          { id: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10' },
          { id: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2' },
          { id: 'Categories', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
          { id: 'Customers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197' },
          { id: 'Reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
          { id: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bold transition-all text-sm uppercase tracking-widest ${
              activeTab === tab.id ? 'bg-[#FF6F00] text-white shadow-xl shadow-black/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={tab.icon} /></svg>
            {!isCollapsed && <span>{tab.id}</span>}
          </button>
        ))}
      </div>

      <div className="mt-auto pt-12 border-t border-white/10">
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bold text-slate-400 hover:text-white text-sm uppercase tracking-widest mb-4">
           <svg className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
           {!isCollapsed && <span>Collapse</span>}
        </button>
        <button onClick={() => window.location.hash = '/'} className="w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bold text-slate-400 hover:text-white text-sm uppercase tracking-widest">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
           {!isCollapsed && <span>Exit Panel</span>}
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className={`${isCollapsed ? 'w-24' : 'w-72'} hidden lg:block bg-[#1A237E] p-8 flex-shrink-0 sticky top-0 h-screen transition-all no-scrollbar`}>
        <SideNav />
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
           <div className="absolute inset-y-0 left-0 w-4/5 bg-[#1A237E] p-8 animate-in slide-in-from-left duration-300">
              <SideNav />
           </div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-slate-100 px-8 py-6 sticky top-0 z-40">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg></button>
                 <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">{activeTab}</h1>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Global Operations Hub</div>
                 </div>
              </div>
              <div className="flex items-center gap-6">
                 <div className="w-10 h-10 bg-[#FF6F00]/10 rounded-full flex items-center justify-center text-[#FF6F00] font-black text-xs border border-[#FF6F00]/20">A</div>
              </div>
           </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto">
          {activeTab === 'Overview' && renderOverview()}
          {activeTab === 'Products' && renderProducts()}
          {activeTab === 'Orders' && renderOrders()}
          {activeTab === 'Categories' && renderCategories()}
          {activeTab === 'Customers' && renderCustomers()}
          {activeTab === 'Reports' && renderReports()}
          {activeTab === 'Settings' && renderSettings()}
        </main>
      </div>

      {showAddProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddProduct(false)}></div>
           <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 bg-[#1A237E] text-white flex justify-between items-center">
                 <h2 className="text-xl font-black">Quick Catalog Entry</h2>
                 <button onClick={() => setShowAddProduct(false)}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="p-10 space-y-6">
                 {formStep === 1 ? (
                   <>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Name</label>
                        <input value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} className="w-full bg-slate-50 rounded-xl px-4 py-3 font-bold text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Price</label>
                        <input type="number" value={newProd.price} onChange={e => setNewProd({...newProd, price: parseFloat(e.target.value)})} className="w-full bg-slate-50 rounded-xl px-4 py-3 font-bold text-sm" />
                      </div>
                    </div>
                    <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between">
                       <span className="text-[10px] font-black text-indigo-600 uppercase">AI Writing Assistant</span>
                       <button onClick={() => handleAIService('desc')} disabled={isGenerating} className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase">{isGenerating ? 'Drafting...' : 'Generate Copy'}</button>
                    </div>
                    <textarea value={newProd.description} onChange={e => setNewProd({...newProd, description: e.target.value})} rows={3} className="w-full bg-slate-50 rounded-xl px-4 py-3 font-bold text-sm" placeholder="Tell the product story..." />
                    <button onClick={() => setFormStep(2)} className="w-full bg-[#FF6F00] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Review & Launch</button>
                   </>
                 ) : (
                   <div className="text-center py-6 space-y-6">
                      <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></div>
                      <h3 className="text-2xl font-black text-slate-900">Publish to Live Store?</h3>
                      <div className="flex gap-4">
                         <button onClick={() => setFormStep(1)} className="flex-1 bg-slate-100 py-4 rounded-2xl font-black uppercase text-xs">Edit More</button>
                         <button onClick={saveProduct} className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black uppercase text-xs shadow-xl">Go Live</button>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
