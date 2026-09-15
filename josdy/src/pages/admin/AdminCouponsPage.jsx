import React, { useEffect, useState } from "react";
import { Ticket, Plus, Trash2, Edit2, X, Save, Calendar, Search } from "lucide-react";
import { motion } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCoupon, setEditCoupon] = useState(null);
  const [skuSearch, setSkuSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const initialForm = {
    code: '',
    discount_percentage: 10,
    min_order_value: 0,
    usage_type: 'multiple',
    max_uses: '',
    expiry_date: '',
    is_active: true,
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [couponRes, prodRes] = await Promise.all([
        fetch(`${BACKEND_URL}/admin/coupons`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BACKEND_URL}/products`)
      ]);
      const couponData = await couponRes.json();
      const prodData = await prodRes.json();
      if (couponData.coupons) setCoupons(couponData.coupons);
      if (prodData.products) setProducts(prodData.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = () => {
    setFormData(initialForm);
    setEditCoupon({});
    setIsNew(true);
  };

  const handleEdit = (coupon) => {
    let localDate = '';
    if (coupon.expiry_date) {
      const d = new Date(coupon.expiry_date);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      localDate = d.toISOString().slice(0, 16);
    }
    setFormData({
      code: coupon.code || '',
      discount_percentage: coupon.discount_percentage || 0,
      min_order_value: coupon.min_order_value || 0,
      usage_type: coupon.usage_type || 'multiple',
      max_uses: coupon.max_uses || '',
      expiry_date: localDate,
      is_active: coupon.is_active !== false,
    });
    setEditCoupon(coupon);
    setIsNew(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BACKEND_URL}/admin/coupons/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    if (!formData.code.trim()) return alert("Coupon code is required");
    if (!formData.discount_percentage) return alert("Discount percentage is required");
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const url = isNew ? `${BACKEND_URL}/admin/coupons` : `${BACKEND_URL}/admin/coupons/${editCoupon.id}`;
      const payload = {
        ...formData,
        code: formData.code.toUpperCase(),
        expiry_date: formData.expiry_date || null,
        max_uses: formData.max_uses ? Number(formData.max_uses) : null,
      };
      await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      setEditCoupon(null);
      fetchData();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const filteredCoupons = coupons.filter(c => c.code?.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-white/10 border-t-white rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">Coupons</h1>
          <p className="text-white/40 text-xs font-sans mt-0.5">Manage discount codes for customers</p>
        </div>
        <button onClick={handleAdd}
          className="flex items-center gap-2 bg-brand-green text-white px-4 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-colors">
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search coupons by code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-md px-4 py-2 rounded-xl bg-[#0B192D] border border-white/10 text-white focus:outline-none focus:border-white/30"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCoupons.map((coupon, i) => (
          <motion.div key={coupon.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-[#0B192D] rounded-2xl border border-white/10 p-5 shadow-[0_4px_12px_rgba(0,0,0,0.2)] relative overflow-hidden">
            {!coupon.is_active && (
              <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-[10px] font-bold px-3 py-1 rounded-bl-xl">INACTIVE</div>
            )}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200">
                <Ticket className="w-4 h-4" />
                <span className="font-bold tracking-wider">{coupon.code}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(coupon)} className="text-white/50 hover:text-white p-1.5 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(coupon.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-serif text-xl font-bold text-white">
                {coupon.discount_percentage != null
                  ? <>{coupon.discount_percentage}% OFF</>
                  : <span className="text-yellow-400 text-sm">⚠ Set discount % (click Edit)</span>
                }
              </p>
              <div className="text-xs text-white/60 font-sans space-y-1">
                <p>Min Purchase: ₹{coupon.min_order_value ?? 0}</p>
                <p>Usage: {coupon.usage_type === 'one_time' ? 'One Time' : 'Multiple'}</p>
                {coupon.max_uses && <p>Max Uses: {coupon.max_uses}</p>}
                {coupon.use_count > 0 && <p>Used: {coupon.use_count} time{coupon.use_count !== 1 ? 's' : ''}</p>}
                {coupon.expiry_date && (
                  <p className="flex items-center gap-1 text-white">
                    <Calendar className="w-3.5 h-3.5" /> Expires: {new Date(coupon.expiry_date).toLocaleDateString('en-IN')}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {filteredCoupons.length === 0 && (
          <div className="col-span-3 text-center py-12 text-white/30 text-sm">
            No coupons yet. Click "Add Coupon" to create one.
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {editCoupon && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B192D] rounded-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
            <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="font-serif text-xl font-bold text-white">{isNew ? "Add" : "Edit"} Coupon</h2>
              <button onClick={() => setEditCoupon(null)} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              {/* Code */}
              <div>
                <label className="text-xs font-semibold text-white/70 mb-1 block">Coupon Code *</label>
                <input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SAVE20"
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-white uppercase tracking-wider focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Discount % */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-white/70 mb-1 block">Discount (%) *</label>
                  <input
                    type="number" min="1" max="99"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-white focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/70 mb-1 block">Min Purchase (₹)</label>
                  <input
                    type="number" min="0"
                    value={formData.min_order_value}
                    onChange={(e) => setFormData({ ...formData, min_order_value: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-white focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              {/* Usage & Max Uses */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-white/70 mb-1 block">Usage Type</label>
                  <select
                    value={formData.usage_type}
                    onChange={(e) => setFormData({ ...formData, usage_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#071426] border border-white/10 text-white focus:outline-none"
                  >
                    <option value="multiple">Multiple Times</option>
                    <option value="one_time">One Time Only</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/70 mb-1 block">Max Uses (Optional)</label>
                  <input
                    type="number" min="1"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                    placeholder="Unlimited"
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-white focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              {/* Expiry */}
              <div>
                <label className="text-xs font-semibold text-white/70 mb-1 block">Expiry Date (Optional)</label>
                <input
                  type="datetime-local"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-white focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Active */}
              <div className="flex items-center gap-2">
                <input type="checkbox" id="coupon_active" checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4" />
                <label htmlFor="coupon_active" className="text-sm font-semibold text-white cursor-pointer">Active</label>
              </div>
            </div>

            <div className="border-t border-white/10 px-6 py-4 flex gap-3 shrink-0">
              <button onClick={() => setEditCoupon(null)} className="flex-1 px-4 py-2 bg-white/[0.02] text-white rounded-xl font-semibold">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 px-4 py-2 bg-brand-green text-white rounded-xl font-semibold flex justify-center items-center gap-2 disabled:opacity-60">
                {saving ? "Saving..." : <><Save className="w-4 h-4" /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
