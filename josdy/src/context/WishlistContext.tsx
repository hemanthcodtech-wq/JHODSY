import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { PRIMARY_PRODUCT } from '../data/product';

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchWishlist(token);
    } else {
      setWishlist([PRIMARY_PRODUCT]); // Default offline fallback
    }
  }, []);

  const fetchWishlist = async (token: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/wishlist`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const items = data.items.map((item: any) => 
          item.product_id === PRIMARY_PRODUCT.id ? PRIMARY_PRODUCT : { ...PRIMARY_PRODUCT, id: item.product_id }
        );
        setWishlist(items);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleWishlist = async (product: Product) => {
    const token = localStorage.getItem('token');
    
    // Optimistic UI update
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });

    if (!token) return; // Only sync if logged in

    try {
      await fetch(`${BACKEND_URL}/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ productId: product.id })
      });
    } catch (e) {
      console.error(e);
      fetchWishlist(token); // Revert on failure
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
