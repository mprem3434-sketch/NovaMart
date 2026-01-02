
import React, { useState, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrdersPage from './pages/OrdersPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import { CartItem, Product, User } from './types';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to cart.`);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        showToast('Removed from wishlist.', 'info');
        return prev.filter(p => p.id !== product.id);
      } else {
        showToast('Saved to wishlist.');
        return [...prev, product];
      }
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    showToast('Order confirmed!', 'success');
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    showToast(`Welcome, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Logged out.', 'info');
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistIds = useMemo(() => new Set(wishlist.map(p => p.id)), [wishlist]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col selection:bg-[#FF6F00] selection:text-white pb-24 md:pb-0 bg-white">
        <Header 
          cartCount={totalItems} 
          wishlistCount={wishlist.length}
          currentUser={currentUser} 
          onLogout={handleLogout} 
        />
        
        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-24 md:bottom-10 right-4 z-[100] animate-in slide-in-from-right-10 duration-500">
            <div className={`px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10 ${
              toast.type === 'success' ? 'bg-[#1A237E] text-white' : 'bg-slate-100 text-slate-900'
            }`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${toast.type === 'success' ? 'bg-[#FF6F00] text-white' : 'bg-[#1A237E] text-white'}`}>
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
              <span className="text-xs font-black uppercase tracking-widest">{toast.message}</span>
            </div>
          </div>
        )}

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage onAddToCart={addToCart} onToggleWishlist={toggleWishlist} wishlistIds={wishlistIds} />} />
            <Route path="/product/:id" element={<ProductDetailPage onAddToCart={addToCart} />} />
            <Route path="/cart" element={<CartPage cart={cart} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />} />
            <Route path="/wishlist" element={<WishlistPage wishlist={wishlist} onAddToCart={addToCart} onRemoveFromWishlist={(id) => setWishlist(p => p.filter(i => i.id !== id))} />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage onRegister={handleLogin} />} />
            <Route path="/checkout" element={<CheckoutPage cart={cart} onClearCart={clearCart} />} />
            <Route path="/orders" element={currentUser ? <OrdersPage /> : <Navigate to="/login" />} />
            <Route path="/admin" element={currentUser?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/" />} />
          </Routes>
        </main>
        
        <footer className="bg-[#1A237E] text-white pt-20 pb-10 hidden md:block">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
              <div className="col-span-2">
                <div className="text-2xl font-black text-white flex items-center gap-3 mb-6 tracking-tighter">
                  <div className="w-10 h-10 bg-[#FF6F00] rounded-lg flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  </div>
                  NovaMart
                </div>
                <p className="text-slate-300 font-medium max-w-sm mb-8 leading-relaxed">
                  The ultimate destination for premium tech, fashion, and lifestyle products delivered across the globe.
                </p>
                <div className="flex gap-4">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-8 h-8 bg-white/10 rounded-lg border border-white/5 hover:bg-[#FF6F00] transition-all cursor-pointer"></div>
                   ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 text-[#FFC107]">Shop</h4>
                <ul className="space-y-3 text-slate-300 text-xs font-bold">
                  <li><a href="#" className="hover:text-white transition-colors">Daily Deals</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">New Releases</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 text-[#FFC107]">Support</h4>
                <ul className="space-y-3 text-slate-300 text-xs font-bold">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Returns & Refunds</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 text-[#FFC107]">Corporate</h4>
                <ul className="space-y-3 text-slate-300 text-xs font-bold">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Press Room</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <p>© 2024 NOVAMART INC. ALL RIGHTS RESERVED.</p>
              <div className="flex gap-8">
                <a href="#" className="hover:text-white">Privacy</a>
                <a href="#" className="hover:text-white">Terms</a>
                <a href="#" className="hover:text-white">Accessibility</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
