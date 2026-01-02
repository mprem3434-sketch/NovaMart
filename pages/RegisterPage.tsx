
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface RegisterPageProps {
  onRegister: (user: any) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      ...formData,
      id: 'U' + Math.random().toString(36).substr(2, 9),
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    onRegister(newUser);
    navigate('/');
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-[#FAFAFB]">
      <div className="w-full max-w-xl bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_50px_120px_rgba(0,0,0,0.04)] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="p-10 sm:p-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              Join Nova Elite
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Create Your Account</h2>
            <p className="text-slate-400 font-medium mt-3">Access exclusive drops, early sales, and priority shipping.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-slate-900"
                  placeholder="Alexander Nova"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Account Role</label>
                <select 
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-slate-900 appearance-none"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="USER">Personal Account</option>
                  <option value="SELLER">Become a Seller</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
              <input 
                type="email" required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-slate-900"
                placeholder="alex@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Secure Password</label>
              <input 
                type="password" required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-slate-900"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <input type="checkbox" required className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" />
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                 I agree to the <a href="#" className="text-indigo-600 underline">Terms of Service</a> and Privacy Policy.
               </span>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Initialize Account
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              Already a member? <Link to="/login" className="text-indigo-600 hover:text-indigo-700">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
