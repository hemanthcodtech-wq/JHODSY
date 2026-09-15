import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Package, MapPin, Truck, AlertCircle, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { JHODSY_ASSETS } from '../data/assets';
import { useAuthStore } from '../store/useAuthStore';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api';

export const CheckoutReviewPage: React.FC = () => {
  const { cartItems, subtotal, discount, total, orderAddress, clearCart, paymentMethod } = useCart();
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vacationModalMessage, setVacationModalMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (!orderAddress.fullName || !orderAddress.address) {
      navigate('/checkout/address');
    }
  }, [orderAddress, navigate]);

  const handlePlaceOrder = async () => {
    if (!orderAddress.id) {
      alert('Address missing!'); return;
    }
    
    setLoading(true);
    try {
      const items = cartItems.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        size: item.size || 'Standard'
      }));

      // 0. Check Vacation Mode
      const vacRes = await fetch(`${BACKEND_URL}/settings/vacation`);
      const vacData = await vacRes.json();
      if (vacData.is_active) {
        setVacationModalMessage(vacData.message || 'Store is currently on vacation mode. Orders cannot be placed right now.');
        setLoading(false);
        return;
      }

      // Online (Razorpay) Flow
      // 1. Create Razorpay order
      const res = await fetch(`${BACKEND_URL}/orders/razorpay/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ total: total })
      });
      
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to initialize payment');
        setLoading(false);
        return;
      }

      // 2. Fetch Razorpay public key
      const keyRes = await fetch(`${BACKEND_URL}/orders/razorpay/key`);
      const keyData = await keyRes.json();

      // 3. Setup Razorpay options
      const options = {
        key: keyData.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'JHODSY',
        description: 'Luxury Skincare Purchase',
        image: '/assets/logo_silver.png',
        order_id: data.order.id,
        handler: async function (response: any) {
          // 3. Verify payment on backend
          try {
            const verifyRes = await fetch(`${BACKEND_URL}/orders/razorpay/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                addressId: orderAddress.id,
                total: total,
                items: items
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              clearCart();
              navigate('/order-success', { state: { order: verifyData.order } });
            } else {
              alert(verifyData.error || 'Payment verification failed');
            }
          } catch (e) {
            alert('Verification network error');
          }
        },
        prefill: {
          name: orderAddress.fullName,
          contact: orderAddress.phoneNumber
        },
        theme: {
          color: '#0B192D'
        }
      };

      // 4. Open Razorpay Modal
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert(response.error.description);
      });
      rzp.open();

    } catch (e) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="max-w-xl mx-auto flex items-center justify-between pb-4">
        <div className="flex items-center space-x-2 opacity-60">
          <div className="w-7 h-7 rounded-full bg-[#0B192D] border border-white/20 text-[#AEB6C2] text-xs font-medium flex items-center justify-center">1</div>
          <span className="text-xs sm:text-sm font-medium text-[#AEB6C2]">Address</span>
        </div>
        <div className="flex-1 h-[2px] bg-emerald-500/50 mx-4"></div>
        <div className="flex items-center space-x-2 opacity-60">
          <div className="w-7 h-7 rounded-full bg-[#0B192D] border border-white/20 text-[#AEB6C2] text-xs font-medium flex items-center justify-center">2</div>
          <span className="text-xs sm:text-sm font-medium text-[#AEB6C2]">Payment</span>
        </div>
        <div className="flex-1 h-[2px] bg-emerald-500/50 mx-4"></div>
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-full bg-white text-[#071426] text-xs font-bold flex items-center justify-center shadow">3</div>
          <span className="text-xs sm:text-sm font-bold text-white">Review</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#0B192D] border border-white/10 rounded-3xl p-6 shadow-card-dark space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2"><MapPin className="w-4 h-4" /> Delivery Address</h3>
              <Link to="/checkout/address" className="text-xs font-bold text-[#AEB6C2] hover:text-white">Edit</Link>
            </div>
            <div>
              <p className="text-sm font-bold text-white">{orderAddress.fullName}</p>
              <p className="text-xs text-[#8994A3] mt-1">{orderAddress.address}, {orderAddress.city}, {orderAddress.state} {orderAddress.pincode}</p>
              <p className="text-xs text-[#8994A3] mt-1">Phone: {orderAddress.phoneNumber}</p>
            </div>
          </div>
          
          <div className="bg-[#0B192D] border border-white/10 rounded-3xl p-6 shadow-card-dark space-y-4">
            <h3 className="text-base font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2"><Package className="w-4 h-4" /> Order Items</h3>
            <div className="space-y-4">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-4 bg-[#071426] p-3 rounded-2xl">
                  <div className="w-16 h-16 bg-[#0B192D] rounded-xl flex justify-center p-1">
                    <img src={JHODSY_ASSETS.serumFront} alt={item.product.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">{item.product.name}</h4>
                    <p className="text-xs text-[#8994A3]">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-bold text-white">₹{item.product.price * item.quantity}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#0B192D] border border-white/10 rounded-3xl p-6 space-y-4 shadow-card-dark text-xs sm:text-sm">
          <h3 className="font-bold text-white text-base tracking-wide border-b border-white/10 pb-3">Order Summary</h3>
          <div className="flex justify-between text-[#AEB6C2]"><span>Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</span><span className="text-white font-medium">₹{subtotal}</span></div>
          {discount > 0 && <div className="flex justify-between text-emerald-400"><span>Savings</span><span>- ₹{discount}</span></div>}
          <div className="flex justify-between text-[#AEB6C2]"><span>Shipping</span><span className="text-white font-medium">FREE</span></div>
          <div className="pt-3 border-t border-white/10 flex justify-between items-baseline font-bold text-white"><span className="text-sm">Payable Amount</span><span className="text-xl font-extrabold">₹{total}</span></div>
          <div className="pt-4">
            <button onClick={handlePlaceOrder} disabled={loading} className="w-full px-8 py-3.5 rounded-full bg-white text-[#071426] text-sm font-bold tracking-wide hover:bg-[#F5F5F5] active:scale-95 transition shadow-lg flex items-center justify-center space-x-2">
              {loading ? <span>Processing...</span> : <><span>Place Order</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>
        </div>
      </div>

      {/* Beautiful Vacation Mode Modal */}
      {vacationModalMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-[#0B192D] border border-white/10 rounded-3xl max-w-md w-full p-8 shadow-2xl relative overflow-hidden text-center transform transition-all">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-brand-orange to-amber-500"></div>
            
            <div className="w-20 h-20 mx-auto bg-amber-50 rounded-full flex items-center justify-center mb-6 border-4 border-[#071426] shadow-[0_0_20px_rgba(251,191,36,0.1)]">
              <span className="text-4xl">🌴</span>
            </div>
            
            <h3 className="font-serif text-2xl font-bold text-white mb-2">We're on Vacation!</h3>
            <p className="text-[#AEB6C2] text-sm leading-relaxed mb-8">
              {vacationModalMessage}
            </p>
            
            <button
              onClick={() => setVacationModalMessage(null)}
              className="w-full px-6 py-3.5 bg-brand-green hover:bg-white text-white hover:text-[#071426] font-bold rounded-xl transition-colors duration-300 shadow-lg"
            >
              Okay, I understand
            </button>
            <button
              onClick={() => { setVacationModalMessage(null); navigate('/shop'); }}
              className="mt-4 text-xs font-semibold text-[#8994A3] hover:text-white transition-colors"
            >
              Return to Shop
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
