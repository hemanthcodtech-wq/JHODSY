import { create } from 'zustand';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ProductsState {
  products: any[];
  loading: boolean;
  fetched: boolean;
  fetchProducts: () => Promise<void>;
  getProduct: (id: string | number) => Promise<any>;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  loading: false,
  fetched: false,
  fetchProducts: async () => {
    if (get().fetched) return; // cache locally
    
    set({ loading: true });
    try {
      const res = await fetch(`${BACKEND_URL}/products`);
      const data = await res.json();
      if (data.products) {
        set({ products: data.products, fetched: true });
      }
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  
  getProduct: async (id) => {
    // Check local cache first
    const existing = get().products.find(p => String(p.id) === String(id));
    if (existing) return existing;

    try {
      const res = await fetch(`${BACKEND_URL}/products/${id}`);
      const data = await res.json();
      return data.product;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}));
