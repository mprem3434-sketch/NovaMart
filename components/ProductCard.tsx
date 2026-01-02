
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onToggleWishlist?: (p: Product) => void;
  isWishlisted?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onToggleWishlist, isWishlisted }) => {
  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
        
        {product.isBestSeller && (
          <div className="absolute top-3 left-3 bg-[#D32F2F] text-white text-[10px] font-black px-3 py-1.5 rounded uppercase tracking-widest shadow-lg">
            Best Seller
          </div>
        )}

        {/* Wishlist Button */}
        {onToggleWishlist && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist(product);
            }}
            className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-20 ${
              isWishlisted ? 'bg-[#D32F2F] text-white shadow-[#D32F2F]/20' : 'bg-white/90 text-slate-400 hover:text-[#D32F2F] shadow-lg'
            }`}
          >
            <svg className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
      </Link>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black text-[#1976D2] uppercase tracking-widest">{product.category}</span>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 text-[#FFC107] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <span className="text-[11px] font-black text-slate-900">{product.rating}</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="text-[#333333] font-bold text-base mb-2 leading-snug group-hover:text-[#1A237E] transition-colors line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-black text-[#FF6F00] tracking-tight">${product.price}</span>
            {product.oldPrice && (
              <span className="text-[10px] text-slate-400 font-bold line-through">${product.oldPrice}</span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-[#FF6F00] hover:bg-[#FF8F00] text-white p-3 rounded-xl transition-all shadow-md shadow-[#FF6F00]/10 flex items-center justify-center"
            title="Add to Cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
