
import { Product, Order, User, Seller, Category, SupportTicket } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    sku: 'ZEN-AUDIO-001',
    name: 'Zenith Pro Wireless Headphones',
    brand: 'Zenith',
    description: 'High-fidelity audio with active noise cancellation and 40-hour battery life.',
    price: 299,
    oldPrice: 349,
    category: 'Electronics',
    subCategory: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    rating: 4.8,
    reviews: 1240,
    stock: 15,
    status: 'Published',
    isBestSeller: true,
    specifications: [
      { label: 'Driver Size', value: '40mm Dynamic' },
      { label: 'Connectivity', value: 'Bluetooth 5.2, USB-C' }
    ]
  },
  {
    id: '2',
    sku: 'LUXE-TEE-099',
    name: 'Luxe Cotton Minimalist Tee',
    brand: 'NovaBasics',
    description: '100% organic cotton, breathable, and perfect for every season.',
    price: 45,
    oldPrice: 55,
    category: 'Fashion',
    subCategory: 'Menswear',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    rating: 4.5,
    reviews: 850,
    stock: 100,
    status: 'Published',
    specifications: [
      { label: 'Material', value: '100% Organic Cotton' }
    ]
  },
  {
    id: '4',
    sku: 'GLOW-SERUM-01',
    name: 'Vitamin C Radiance Serum',
    brand: 'GlowLabs',
    description: 'Advanced antioxidant formula for brighter, firmer skin.',
    price: 34,
    oldPrice: 42,
    category: 'Beauty',
    subCategory: 'Skincare',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
    rating: 4.7,
    reviews: 4200,
    stock: 85,
    status: 'Published',
    isBestSeller: true
  }
];

export const HIERARCHICAL_CATEGORIES: Category[] = [
  {
    id: 'c1', name: 'Electronics', slug: 'electronics', level: 1, icon: '⚡', itemCount: 1240,
    children: [
      { id: 'c1-1', name: 'Mobiles', slug: 'mobiles', level: 2, parentId: 'c1', itemCount: 450 },
      { id: 'c1-2', name: 'Laptops', slug: 'laptops', level: 2, parentId: 'c1', itemCount: 320 },
      { id: 'c1-3', name: 'Audio', slug: 'audio', level: 2, parentId: 'c1', itemCount: 280, 
        children: [
          { id: 'c1-3-1', name: 'Headphones', slug: 'headphones', level: 3, parentId: 'c1-3', itemCount: 150 },
          { id: 'c1-3-2', name: 'Speakers', slug: 'speakers', level: 3, parentId: 'c1-3', itemCount: 130 }
        ]
      },
    ]
  },
  {
    id: 'c2', name: 'Fashion', slug: 'fashion', level: 1, icon: '👕', itemCount: 3500,
    children: [
      { id: 'c2-1', name: 'Menswear', slug: 'menswear', level: 2, parentId: 'c2', itemCount: 1200 },
      { id: 'c2-2', name: 'Womenswear', slug: 'womenswear', level: 2, parentId: 'c2', itemCount: 1800 },
    ]
  },
  {
    id: 'c3', name: 'Beauty', slug: 'beauty', level: 1, icon: '💄', itemCount: 1100,
    children: [
      { id: 'c3-1', name: 'Skincare', slug: 'skincare', level: 2, parentId: 'c3', itemCount: 600 },
      { id: 'c3-2', name: 'Makeup', slug: 'makeup', level: 2, parentId: 'c3', itemCount: 300 },
    ]
  },
  { id: 'c4', name: 'Home & Kitchen', slug: 'home-kitchen', level: 1, icon: '🏠', itemCount: 850 },
  { id: 'c5', name: 'Health', slug: 'health', level: 1, icon: '💊', itemCount: 600 },
  { id: 'c6', name: 'Groceries', slug: 'groceries', level: 1, icon: '🥦', itemCount: 5000 },
  { id: 'c7', name: 'Toys & Baby', slug: 'toys-baby', level: 1, icon: '🧸', itemCount: 1200 },
  { id: 'c8', name: 'Sports', slug: 'sports', level: 1, icon: '⚽', itemCount: 900 },
  { id: 'c9', name: 'Books', slug: 'books', level: 1, icon: '📚', itemCount: 2200 },
  { id: 'c10', name: 'Automotive', slug: 'automotive', level: 1, icon: '🚗', itemCount: 400 }
];

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-001', customerName: 'Sarah Wilson', customerEmail: 'sarah@example.com', productName: 'Zenith Pro Headphones', amount: 299, status: 'Delivered', date: '2024-10-14' },
];

export const MOCK_USERS: User[] = [
  { id: 'U1', name: 'John Doe', email: 'john@nova.com', role: 'ADMIN', joinDate: '2023-01-10', status: 'Active', department: 'Management' },
  { id: 'U2', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'USER', joinDate: '2024-05-15', status: 'Active' },
];

export const MOCK_TICKETS: SupportTicket[] = [
  { id: 'TIC-001', subject: 'Refund request for broken item', customerName: 'Sarah Wilson', priority: 'High', status: 'Open', lastUpdated: '2 hours ago' },
];

export const MOCK_SELLERS: Seller[] = [
  { id: 'S1', name: 'Alpha Tech', storeName: 'Alpha Electronics', email: 'sales@alphatech.com', role: 'SELLER', joinDate: '2023-02-12', status: 'Active', revenue: 154000, rating: 4.9, isVerified: true },
];
