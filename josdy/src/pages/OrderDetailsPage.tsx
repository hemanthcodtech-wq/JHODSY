import React from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, CreditCard, Truck, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { JHODSY_ASSETS } from '../data/assets';

export const OrderDetailsPage: React.FC = () => {
  const { orders } = useCart();
  const order = orders[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
        <Link to="/orders" className="p-2 -ml-2 text-[#AEB6C2] hover:text-white transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-serif">
            Order Details (#{order.id})
          </h1>
          <p className="text-xs text-[#AEB6C2]">Placed on {order.date}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* LEFT: ITEMS & ADDRESS */}
        <div className="md:col-span-8 space-y-6">
          {/* Status Box */}
          <div className="bg-[#0B192D] border border-white/10 rounded-2xl p-6 flex items-center justify-between shadow-card-dark">
            <div>
              <span className="text-xs text-[#8994A3]">Current Status</span>
              <h3 className="text-lg font-bold text-white mt-0.5">{order.status}</h3>
              <p className="text-xs text-[#AEB6C2] mt-0.5">Estimated Delivery: {order.estimatedDelivery}</p>
            </div>
            <Link
              to="/track-order"
              className="px-6 py-2.5 rounded-full bg-white text-[#071426] text-xs font-bold hover:bg-[#F5F5F5] transition shadow"
            >
              Track Order →
            </Link>
          </div>

          {/* Items */}
          <div className="bg-[#0B192D] border border-white/10 rounded-2xl p-6 space-y-4 shadow-card-dark">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Item Details</h3>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-4 bg-[#071426] p-4 rounded-xl">
                <div className="w-16 h-16 bg-[#0B192D] rounded-xl flex items-center justify-center p-1.5 flex-shrink-0">
                  <img src={JHODSY_ASSETS.serumFront} alt={item.product.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">{item.product.name}</h4>
                  <p className="text-xs text-[#8994A3]">{item.size} · Qty: {item.quantity}</p>
                  <span className="text-sm font-bold text-white">₹{item.product.price * item.quantity}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Address */}
          <div className="bg-[#0B192D] border border-white/10 rounded-2xl p-6 space-y-2 shadow-card-dark text-xs">
            <div className="flex items-center space-x-2 text-white font-bold text-sm mb-2">
              <MapPin className="w-4 h-4 text-white" />
              <span>Shipping Address</span>
            </div>
            <p className="text-white font-semibold text-sm">{order.address.fullName}</p>
            <p className="text-[#AEB6C2]">{order.address.address}</p>
            <p className="text-[#AEB6C2]">{order.address.city}, {order.address.state} - {order.address.pincode}</p>
            <p className="text-[#8994A3] pt-1">Phone: {order.address.phoneNumber}</p>
          </div>
        </div>

        {/* RIGHT: COST BREAKDOWN */}
        <div className="md:col-span-4 bg-[#0B192D] border border-white/10 rounded-2xl p-6 space-y-4 shadow-card-dark text-xs sm:text-sm">
          <h3 className="font-bold text-white text-base tracking-wide border-b border-white/10 pb-3">
            Payment Summary
          </h3>

          <div className="flex justify-between text-[#AEB6C2]">
            <span>Method</span>
            <span className="text-white font-medium">{order.paymentMethod}</span>
          </div>

          <div className="flex justify-between text-[#AEB6C2]">
            <span>Item Total</span>
            <span className="text-white font-medium">₹{order.subtotal}</span>
          </div>

          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-400 font-semibold">
              <span>Savings</span>
              <span>- ₹{order.discount}</span>
            </div>
          )}

          <div className="flex justify-between text-[#AEB6C2]">
            <span>Shipping</span>
            <span className="text-white font-medium">FREE</span>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-between items-baseline font-bold text-white">
            <span>Total Paid</span>
            <span className="text-xl font-extrabold">₹{order.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
