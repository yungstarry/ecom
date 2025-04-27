export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  created_at: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    phone?: string;
  };
  role?: 'user' | 'admin';
  email_verified?: boolean;
  last_login?: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shipping_address: ShippingAddress;
  created_at: string;
}

export interface ShippingAddress {
  full_name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

export interface AuthError {
  message: string;
}