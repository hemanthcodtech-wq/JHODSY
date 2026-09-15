import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Order, OrderAddress } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode: string;
  appliedCoupon: string | null;
  couponDiscountPercentage: number;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  orderAddress: OrderAddress;
  setOrderAddress: (address: OrderAddress) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  currentOrder: Order | null;
  placeOrder: () => Order;
  orders: Order[];
}

const emptyAddress: OrderAddress = {
  fullName: '',
  phoneNumber: '',
  pincode: '',
  address: '',
  city: '',
  state: '',
  landmark: ''
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponDiscountPercentage, setCouponDiscountPercentage] = useState<number>(0);
  const [orderAddress, setOrderAddress] = useState<OrderAddress>(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState<string>('online');
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart(token);
    }
  }, []);

  const fetchCart = async (token: string) => {
    try {
      const [cartRes, prodRes] = await Promise.all([
        fetch(`${BACKEND_URL}/cart`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${BACKEND_URL}/products`) // fetch real products with effective_price
      ]);

      if (!cartRes.ok) return;

      const cartData = await cartRes.json();
      const prodData = prodRes.ok ? await prodRes.json() : { products: [] };
      const productsMap: Record<string, any> = {};
      (prodData.products || []).forEach((p: any) => { productsMap[String(p.id)] = p; });

      const items = cartData.items.map((item: any) => {
        const dbProduct = productsMap[String(item.product_id)];
        const product = dbProduct
          ? {
              id: String(dbProduct.id),
              name: dbProduct.name,
              price: Number(dbProduct.effective_price || dbProduct.price), // offer-discounted price
              mrp: Number(dbProduct.mrp || dbProduct.price),
              description: dbProduct.description || '',
              tagline: dbProduct.tagline || '',
              size: item.size || dbProduct.variants?.[0]?.sizes?.[0]?.size || '30ml',
              images: dbProduct.images || [],
              variants: dbProduct.variants || [],
              offer_discount: dbProduct.offer_discount || 0,
            }
          : {
              id: String(item.product_id),
              name: 'Product',
              price: 0,
              mrp: 0,
              size: item.size || '',
            };
        return { id: item.id, product, quantity: item.quantity, size: item.size };
      });
      setCartItems(items);
    } catch (e) {
      console.error(e);
    }
  };

  const addToCart = async (product: Product, quantity = 1) => {
    const token = localStorage.getItem('token');
    
    // 1. Optimistic UI update (Instant responsiveness)
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, size: product.size }];
    });

    if (!token) return; // If offline, we're done

    // 2. Background sync
    try {
      await fetch(`${BACKEND_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ productId: product.id, quantity, size: product.size })
      });
      // Refetch to ensure absolute sync (now lightning fast via Redis)
      fetchCart(token);
    } catch (e) {
      console.error('Failed to sync cart:', e);
    }
  };

  const removeFromCart = async (productId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartItems(prev => prev.filter(item => item.product.id !== productId));
      return;
    }
    const item = cartItems.find(i => i.product.id === productId);
    if (item && (item as any).id) {
      try {
        await fetch(`${BACKEND_URL}/cart/${(item as any).id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchCart(token);
      } catch (e) {
        console.error(e);
      }
    } else {
      setCartItems(prev => prev.filter(item => item.product.id !== productId));
    }
  };

  const updateQuantity = async (productId: string, delta: number) => {
    const token = localStorage.getItem('token');
    const item = cartItems.find(i => i.product.id === productId);
    if (!item) return;
    
    const newQty = Math.max(1, item.quantity + delta);

    if (!token || !(item as any).id) {
      setCartItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: newQty } : i));
      return;
    }

    try {
      await fetch(`${BACKEND_URL}/cart/${(item as any).id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ quantity: newQty })
      });
      fetchCart(token);
    } catch (e) {
      console.error(e);
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartItems([]);
      return;
    }
    try {
      await fetch(`${BACKEND_URL}/cart`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCartItems([]);
    } catch (e) {
      console.error(e);
    }
  };

  const applyCoupon = async (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    try {
      const res = await fetch(`${BACKEND_URL}/cart/coupon/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode })
      });
      if (res.ok) {
        const data = await res.json();
        setAppliedCoupon(cleanCode);
        setCouponDiscountPercentage(data.discount_percentage);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscountPercentage(0);
  };

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const discount = appliedCoupon ? Math.round(subtotal * (couponDiscountPercentage / 100)) : 0;
  const total = Math.max(0, subtotal - discount + shipping);

  const placeOrder = (): Order => {
    const newOrder: Order = {
      id: 'JHD' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      items: [...cartItems],
      subtotal,
      shipping,
      discount,
      total: total || 559,
      paymentMethod: paymentMethod === 'upi' ? 'UPI (GPay, PhonePe)' : paymentMethod === 'card' ? 'Credit / Debit Card' : paymentMethod === 'netbanking' ? 'Net Banking' : 'Cash on Delivery',
      address: { ...orderAddress },
      status: 'Confirmed',
      trackingNumber: 'DELHIVERY_JHD' + Math.floor(10000 + Math.random() * 90000),
      estimatedDelivery: '3-4 Business Days'
    };

    setOrders(prev => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        shipping,
        discount,
        total,
        couponCode,
        appliedCoupon,
        couponDiscountPercentage,
        applyCoupon,
        removeCoupon,
        orderAddress,
        setOrderAddress,
        paymentMethod,
        setPaymentMethod,
        currentOrder,
        placeOrder,
        orders
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
