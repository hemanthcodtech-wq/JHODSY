import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck } from 'lucide-react';
import { JHODSY_ASSETS } from '../data/assets';
import { useAuthStore } from '../store/useAuthStore';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api';

export const OrdersPage: React.FC = () => {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setOrders(data.orders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center text-white">Loading orders...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif">My Orders</h1>
        <p className="text-xs sm:text-sm text-[#AEB6C2]">Track and manage your JHODSY purchases</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-[#0B192D] border border-white/10 rounded-3xl">
          <Package className="w-12 h-12 mx-auto text-white/20 mb-4" />
          <h2 className="text-xl font-bold text-white">No Orders Found</h2>
          <p className="text-sm text-[#AEB6C2] mt-2 mb-6">Looks like you haven't placed any orders yet.</p>
          <Link to="/shop" className="px-6 py-2.5 rounded-full bg-white text-[#071426] text-sm font-bold hover:bg-[#F5F5F5]">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-[#0B192D] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-card-dark">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-2">
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-white" />
                  <div>
                    <h3 className="text-base font-bold text-white">Order #{order.id}</h3>
                    <p className="text-xs text-[#8994A3]">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">{order.status}</span>
                  <span className="text-base font-bold text-white">₹{order.total}</span>
                </div>
              </div>

              <div className="space-y-3">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center space-x-4 bg-[#071426] p-4 rounded-2xl">
                    <div className="w-16 h-16 bg-[#0B192D] rounded-xl flex items-center justify-center p-1.5 flex-shrink-0">
                      <img src={JHODSY_ASSETS.serumFront} alt={item.product_name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{item.product_name}</h4>
                      <p className="text-xs text-[#8994A3]">Qty: {item.quantity} · {item.size}</p>
                      <p className="text-xs text-[#AEB6C2] mt-0.5">Est. Delivery: {new Date(order.estimated_delivery).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
