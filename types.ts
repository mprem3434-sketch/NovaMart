
export interface ProductVariant {
  id: string;
  name: string; // e.g., "Color"
  value: string; // e.g., "Midnight Blue"
  priceModifier?: number;
  stock: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  description: string;
  shortDescription?: string;
  price: number;
  oldPrice?: number;
  category: string;
  subCategory?: string;
  image: string;
  images?: string[];
  videoUrl?: string;
  rating: number;
  reviews: number;
  stock: number;
  lowStockThreshold?: number;
  isBestSeller?: boolean;
  status: 'Draft' | 'Published' | 'Archived';
  variants?: ProductVariant[];
  weight?: number; // in kg
  dimensions?: { l: number, w: number, h: number }; // in cm
  specifications?: { label: string; value: string }[];
  warranty?: string;
  returnPolicy?: string;
  seo?: {
    metaTitle: string;
    metaDescription: string;
    slug: string;
    tags: string[];
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  level: 1 | 2 | 3;
  icon?: string;
  itemCount?: number;
  children?: Category[];
}

export type UserRole = 'USER' | 'ADMIN' | 'EMPLOYEE' | 'SELLER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinDate: string;
  status: 'Active' | 'Blocked';
  department?: 'Management' | 'Support' | 'Logistics' | 'Sales';
}

export interface Seller extends User {
  storeName: string;
  revenue: number;
  rating: number;
  isVerified: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  amount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  customerName: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  lastUpdated: string;
}
