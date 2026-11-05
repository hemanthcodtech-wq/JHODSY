import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, MapPin, Home, Building2, Compass, ArrowRight, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuthStore } from '../store/useAuthStore';

const BACKEND_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api';

export const CheckoutAddressPage: React.FC = () => {
  const { orderAddress, setOrderAddress, subtotal, discount, total, cartItems } = useCart();
  const { token } = useAuthStore();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newAddr, setNewAddr] = useState({
    country: 'India',
    fullName: '',
    phoneNumber: '',
    flatHouse: '',
    areaStreet: '',
    landmark: '',
    pincode: '',
    city: '',
    state: '',
    isDefault: true
  });

  const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  useEffect(() => {
    if (!token) {
      navigate('/login?returnUrl=/checkout/address');
      return;
    }
    
    fetchAddresses();
  }, [token]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/addresses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setAddresses(data.addresses);
        if (data.addresses.length === 0) {
          setShowNewForm(true);
        } else if (!orderAddress.id && data.addresses.length > 0) {
          // Select default
          const def = data.addresses.find((a: any) => a.is_default) || data.addresses[0];
          setOrderAddress({
            id: def.id,
            fullName: def.name,
            phoneNumber: def.phone,
            address: def.street,
            city: def.city,
            state: def.state,
            pincode: def.zip,
            country: def.country || 'India',
            flatHouse: def.flat_house || '',
            areaStreet: def.area_street || '',
            landmark: def.landmark || ''
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.phoneNumber || !newAddr.flatHouse || !newAddr.areaStreet || !newAddr.pincode || !newAddr.city || !newAddr.state) {
      alert('Please fill in all required address fields'); return;
    }

    const combinedStreet = [newAddr.flatHouse, newAddr.areaStreet, newAddr.landmark ? `Near ${newAddr.landmark}` : '']
      .filter(Boolean)
      .join(', ');
    
    setSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/addresses`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          country: newAddr.country,
          name: newAddr.fullName,
          phone: newAddr.phoneNumber,
          flat_house: newAddr.flatHouse,
          area_street: newAddr.areaStreet,
          landmark: newAddr.landmark,
          street: combinedStreet,
          city: newAddr.city,
          state: newAddr.state,
          zip: newAddr.pincode,
          isDefault: newAddr.isDefault
        })
      });
      const data = await res.json();
      if (res.ok) {
        await fetchAddresses();
        setShowNewForm(false);
        setOrderAddress({
          id: data.address.id,
          fullName: data.address.name,
          phoneNumber: data.address.phone,
          address: data.address.street,
          city: data.address.city,
          state: data.address.state,
          pincode: data.address.zip,
          country: data.address.country || newAddr.country,
          flatHouse: data.address.flat_house || newAddr.flatHouse,
          areaStreet: data.address.area_street || newAddr.areaStreet,
          landmark: data.address.landmark || newAddr.landmark
        });
        navigate('/checkout/payment');
      } else {
        alert(data.error || 'Failed to save address');
      }
    } catch (e) {
      console.error(e);
      alert('Network error while saving address');
    } finally {
      setSaving(false);
    }
  };

  const handleProceed = () => {
    if (!orderAddress.id && !orderAddress.address) {
      alert('Please select or add a shipping address'); return;
    }
    navigate('/checkout/payment');
  };

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center text-white">Loading addresses...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">

      <div className="max-w-2xl mx-auto">
        <div className="bg-[#0B192D] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-card-dark">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">Shipping Address</h2>
              <p className="text-xs sm:text-sm text-[#AEB6C2] mt-1">Select or add a delivery location.</p>
            </div>
            {!showNewForm && (
              <button onClick={() => setShowNewForm(true)} className="flex items-center gap-1 text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition">
                <Plus className="w-3 h-3" /> Add New
              </button>
            )}
          </div>

          {!showNewForm && addresses.length > 0 && (
            <div className="space-y-4">
              {addresses.map(addr => (
                <div key={addr.id} 
                  onClick={() => setOrderAddress({
                    id: addr.id,
                    fullName: addr.name,
                    phoneNumber: addr.phone,
                    address: addr.street,
                    city: addr.city,
                    state: addr.state,
                    pincode: addr.zip,
                    country: addr.country || 'India',
                    flatHouse: addr.flat_house || '',
                    areaStreet: addr.area_street || '',
                    landmark: addr.landmark || ''
                  })}
                  className={`cursor-pointer border rounded-2xl p-4 transition-all ${orderAddress.id === addr.id ? 'border-white bg-white/5' : 'border-white/10 bg-[#071426] hover:border-white/30'}`}
                >
                  <div className="flex justify-between">
                    <h3 className="font-bold text-white">{addr.name}</h3>
                    {addr.is_default && <span className="text-[10px] font-bold uppercase bg-white/10 text-white px-2 py-0.5 rounded">Default</span>}
                  </div>
                  <p className="text-xs text-[#AEB6C2] mt-1">{addr.phone}</p>
                  <p className="text-xs text-[#8994A3] mt-2">{addr.street}, {addr.city}, {addr.state} {addr.zip}</p>
                </div>
              ))}
              <div className="pt-4 flex items-center justify-between">
                <Link to="/cart" className="text-xs text-[#AEB6C2] hover:text-white">← Back to Cart</Link>
                <button onClick={handleProceed} className="px-8 py-3.5 rounded-full bg-white text-[#071426] text-sm font-bold tracking-wide hover:bg-[#F5F5F5] active:scale-95 transition shadow-lg flex items-center space-x-2">
                  <span>Continue to Payment</span><ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {showNewForm && (
            <form onSubmit={handleAddNew} className="space-y-4">
              {/* Country */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#AEB6C2]">Country / Region</label>
                <div className="relative">
                  <select
                    value={newAddr.country}
                    onChange={(e) => setNewAddr({ ...newAddr, country: e.target.value })}
                    className="w-full bg-[#071426] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/40 appearance-none cursor-pointer"
                  >
                    <option value="India" className="bg-[#0B192D] text-white">India</option>
                  </select>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#AEB6C2]">Full name (First and Last name) *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8994A3] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arun Kumar"
                    value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    className="w-full bg-[#071426] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#8994A3] focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#AEB6C2]">Mobile number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8994A3] absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number without prefixes"
                    value={newAddr.phoneNumber}
                    onChange={(e) => setNewAddr({ ...newAddr, phoneNumber: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-[#071426] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#8994A3] focus:outline-none focus:border-white/40"
                  />
                </div>
                <p className="text-[11px] text-[#8994A3]">May be used to assist delivery</p>
              </div>

              {/* Flat, House no. */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#AEB6C2]">Flat, House no., Building, Company, Apartment *</label>
                <div className="relative">
                  <Home className="w-4 h-4 text-[#8994A3] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 402, Royal Heights"
                    value={newAddr.flatHouse}
                    onChange={(e) => setNewAddr({ ...newAddr, flatHouse: e.target.value })}
                    className="w-full bg-[#071426] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#8994A3] focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              {/* Area, Street, Sector, Village */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#AEB6C2]">Area, Street, Sector, Village *</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#8994A3] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Main Road, Gandhi Nagar"
                    value={newAddr.areaStreet}
                    onChange={(e) => setNewAddr({ ...newAddr, areaStreet: e.target.value })}
                    className="w-full bg-[#071426] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#8994A3] focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              {/* Landmark */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#AEB6C2]">Landmark</label>
                <div className="relative">
                  <Compass className="w-4 h-4 text-[#8994A3] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="E.g. near apollo hospital"
                    value={newAddr.landmark}
                    onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })}
                    className="w-full bg-[#071426] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#8994A3] focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              {/* Pincode & Town/City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#AEB6C2]">Pincode *</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#8994A3] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="6-digit Pincode"
                      value={newAddr.pincode}
                      onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value.replace(/\D/g, '') })}
                      className="w-full bg-[#071426] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#8994A3] focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#AEB6C2]">Town/City *</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#8994A3] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vishakapatnam"
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      className="w-full bg-[#071426] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#8994A3] focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>
              </div>

              {/* State dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#AEB6C2]">State *</label>
                <div className="relative">
                  <select
                    required
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full bg-[#071426] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/40 appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#0B192D] text-[#8994A3]">Select State</option>
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st} className="bg-[#0B192D] text-white">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Default address checkbox */}
              <div className="pt-2 flex items-center space-x-2.5">
                <input
                  type="checkbox"
                  id="default_addr_check"
                  checked={newAddr.isDefault}
                  onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })}
                  className="w-4 h-4 rounded bg-[#071426] border-white/20 text-brand-green focus:ring-0 cursor-pointer"
                />
                <label htmlFor="default_addr_check" className="text-xs text-[#AEB6C2] cursor-pointer">
                  Make this my default address
                </label>
              </div>

              <div className="pt-4 flex items-center justify-between">
                {addresses.length > 0 ? (
                  <button type="button" onClick={() => setShowNewForm(false)} className="text-xs text-[#AEB6C2] hover:text-white">Cancel</button>
                ) : (
                  <Link to="/cart" className="text-xs text-[#AEB6C2] hover:text-white">← Back to Cart</Link>
                )}
                <button type="submit" disabled={saving} className="px-8 py-3.5 rounded-full bg-white text-[#071426] text-sm font-bold tracking-wide hover:bg-[#F5F5F5] active:scale-95 transition shadow-lg flex items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed">
                  {saving ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <span>Save Address</span><ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
