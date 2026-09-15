export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: string;
  size: string;
  mrp: number;
  price: number;
  discount: string;
  rating: number;
  reviewCount: number;
  inventory: number;
  benefits: string[];
  description: string;
  suitableFor: string;
  howToUse: string[];
  ingredients: string[];
  images: {
    hero: string;
    splash: string;
    box: string;
    front: string;
    clean: string;
    detailHero: string;
    packaging: string;
    splashAlt: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

export interface OrderAddress {
  id?: number | string;
  fullName: string;
  phoneNumber: string;
  pincode: string;
  address: string;
  city: string;
  state: string;
  landmark?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  address: OrderAddress;
  status: 'Confirmed' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  trackingNumber: string;
  estimatedDelivery: string;
}

export type ScreenId =
  | 'splash'
  | 'onboarding'
  | 'home'
  | 'shop'
  | 'product'
  | 'cart'
  | 'checkout-address'
  | 'checkout-payment'
  | 'order-success'
  | 'account'
  | 'more'
  | 'about'
  | 'search'
  | 'wishlist'
  | 'orders'
  | 'order-details'
  | 'track-order'
  | 'contact'
  | 'faq'
  | 'story'
  | 'science'
  | 'shipping-policy'
  | 'returns-policy'
  | 'terms'
  | 'privacy';
