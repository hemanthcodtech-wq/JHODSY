import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Truck, Package, Clock, PhoneCall, ArrowLeft, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BRAND_INFO } from '../data/product';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const TrackOrderPage: React.FC = () => {
  const { currentOrder, orders } = useCart();
  const location = useLocation();
  const [order, setOrder] = useState<any>(location.state?.order || currentOrder || orders[0] || null);
  const [trackId, setTrackId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!trackId.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/orders/track/${trackId}`);
      const data = await res.json();
      if (res.ok) {
        setOrder(data.order);
      } else {
        setError(data.error || 'Order not found');
      }
    } catch (e) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <Truck className="w-16 h-16 text-white/30 mx-auto" />
        <h1 className="text-3xl font-bold text-white font-serif">Track Your Order</h1>
        <p className="text-[#AEB6C2]">Enter your Order ID or AWB Tracking Number</p>
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. AWB123456789" 
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
              className="flex-1 bg-[#0B192D] border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40"
            />
            <button 
              onClick={handleTrack}
              disabled={loading}
              className="bg-white text-[#071426] font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
            >
              {loading ? '...' : 'Track'}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm text-left px-2">{error}</p>}
        </div>
      </div>
    );
  }

  // Helper to format dates
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Pending';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const getSteps = () => {
    const status = order.status || 'Processing';
    const created = formatDate(order.created_at);
    const estimated = order.estimated_delivery ? new Date(order.estimated_delivery).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : 'Pending';

    // Status mapping logic
    const statusIndex = ['Processing', 'Quality Check', 'Dispatched', 'Out for Delivery', 'Delivered'].indexOf(status);
    const currentIndex = statusIndex === -1 ? 0 : statusIndex;

    return [
      { title: 'Order Placed', time: created, completed: currentIndex >= 0, current: currentIndex === 0 },
      { title: 'Confirmed & Quality Check', time: currentIndex >= 1 ? 'Completed' : 'Pending', completed: currentIndex >= 1, current: currentIndex === 1 },
      { title: 'Dispatched via Delhivery Express', time: currentIndex >= 2 ? 'Completed' : 'Pending', completed: currentIndex >= 2, current: currentIndex === 2 },
      { title: 'Out for Delivery', time: `Expected ${estimated}`, completed: currentIndex >= 3, current: currentIndex === 3 },
      { title: 'Delivered to Doorstep', time: `Expected ${estimated}`, completed: currentIndex >= 4, current: currentIndex === 4 }
    ];
  };

  const trackingSteps = getSteps();

  // Handle refetch if address is missing (when coming from checkout redirect)
  React.useEffect(() => {
    if (order && order.id && (!order.address?.city || order.address.city === 'N/A')) {
      fetch(`${BACKEND_URL}/orders/track/${order.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.order) setOrder(data.order);
        })
        .catch(() => {}); // silent fail, keep existing order state
    }
  }, [order?.id]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
        <Link to="/orders" className="p-2 -ml-2 text-[#AEB6C2] hover:text-white transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-serif">
            Track Shipment
          </h1>
          <p className="text-xs text-[#AEB6C2]">Order #{order.id} {order.tracking_number ? `· AWB: ${order.tracking_number}` : ''}</p>
        </div>
      </div>

      {/* Shipment Status Hero */}
      <div className="bg-[#0B192D] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-card-dark">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs text-[#8994A3]">Courier Partner</span>
            <h3 className="text-base font-bold text-white">Delhivery Express Logistics</h3>
          </div>
          <span className="inline-block self-start sm:self-auto px-3.5 py-1 rounded-full bg-white text-[#071426] text-xs font-bold shadow">
            {order.status || 'Processing'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[#8994A3]">Estimated Delivery</span>
            <p className="text-sm font-bold text-white mt-0.5">
              {order.estimated_delivery ? new Date(order.estimated_delivery).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Pending'}
            </p>
          </div>
          <div>
            <span className="text-[#8994A3]">Destination Address</span>
            <p className="text-sm font-bold text-white mt-0.5">
              {order.address?.city && order.address.city !== 'N/A' ? `${order.address.city}, ${order.address.state}` : 'Fetching address...'}
            </p>
          </div>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="bg-[#0B192D] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-card-dark">
        <h3 className="text-base font-bold text-white mb-6 font-serif">Shipment Progress</h3>

        <div className="space-y-8 relative pl-3 sm:pl-4">
          {trackingSteps.map((step, index) => {
            const isLast = index === trackingSteps.length - 1;
            return (
              <div key={index} className="relative flex items-start space-x-4 sm:space-x-6">
                {!isLast && (
                  <div
                    className={`absolute left-[15px] top-7 w-[2px] h-12 ${
                      step.completed && !step.current ? 'bg-white' : 'bg-white/15'
                    }`}
                  ></div>
                )}

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 flex-shrink-0 ${
                    step.current
                      ? 'bg-white text-[#071426] shadow-[0_0_16px_rgba(255,255,255,0.7)]'
                      : step.completed
                      ? 'bg-white/20 text-white'
                      : 'bg-[#071426] border border-white/20 text-[#8994A3]'
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle2 className="w-5 h-5 fill-current text-white" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-white/40"></div>
                  )}
                </div>

                <div className="flex-1">
                  <h4 className={`text-sm sm:text-base font-bold ${step.completed ? 'text-white' : 'text-[#8994A3]'}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#AEB6C2] mt-0.5">{step.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer Support Callout */}
      <div className="bg-[#071426] border border-white/10 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white">Need Delivery Assistance?</h4>
          <p className="text-xs text-[#AEB6C2] mt-0.5">Call our care team: {BRAND_INFO.customerCare}</p>
        </div>
        <Link
          to="/contact"
          className="px-6 py-2.5 rounded-full bg-white text-[#071426] text-xs font-bold hover:bg-[#F5F5F5] transition"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
};
