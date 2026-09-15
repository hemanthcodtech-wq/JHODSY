import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, X, Save, Shield, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export function AdminOffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit/Create state
  const [editOffer, setEditOffer] = useState(null);
  const [formData, setFormData] = useState({ title: "", discount_percentage: 0, is_active: true });
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);

  // Apply Offer state
  const [applyOfferId, setApplyOfferId] = useState(null);
  const [applyMode, setApplyMode] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState("");

  // Products selection
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchOffers();
    fetchProducts();
  }, []);

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/admin/offers`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.offers) setOffers(data.offers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/products`);
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (err) {}
  };

  const handleAdd = () => {
    setFormData({ title: "", discount_percentage: 0, is_active: true });
    setEditOffer({});
    setIsNew(true);
  };

  const handleEdit = (offer) => {
    setFormData({ title: offer.title, discount_percentage: offer.discount_percentage, is_active: offer.is_active });
    setEditOffer(offer);
    setIsNew(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete offer? This will also remove the offer from all associated products.")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BACKEND_URL}/admin/offers/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      fetchOffers();
      fetchProducts();
    } catch (err) {}
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const url = isNew ? `${BACKEND_URL}/admin/offers` : `${BACKEND_URL}/admin/offers/${editOffer.id}`;
      await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      setEditOffer(null);
      fetchOffers();
    } catch (err) {
    } finally {
      setSaving(false);
    }
  };

  const handleApplyAction = async () => {
    if (!applyOfferId) return;
    setApplying(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {};

      if (applyMode === 'all') {
        payload.applyToAll = true;
      } else if (applyMode === 'category') {
        if (!selectedCategory) { alert("Select a category"); setApplying(false); return; }
        payload.category = selectedCategory;
      } else {
        if (selectedProducts.length === 0) { alert("Select at least one product"); setApplying(false); return; }
        payload.productIds = selectedProducts;
      }

      const res = await fetch(`${BACKEND_URL}/admin/offers/${applyOfferId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Offer applied successfully! Customers will now see the discounted price.");
        setApplyOfferId(null);
        setSelectedCategory("");
        setSelectedProducts([]);
        setSearchQuery("");
        fetchProducts();
      } else {
        const err = await res.json();
        alert("Failed: " + err.error);
      }
    } catch (err) {
      alert("Failed to apply offer");
    } finally {
      setApplying(false);
    }
  };

  const handleRemoveOffer = async (offerId) => {
    if (!confirm("Remove this offer from all products?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BACKEND_URL}/admin/offers/${offerId}/remove`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Offer removed from all products.");
      fetchProducts();
    } catch (err) {}
  };

  const toggleProductSelection = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Count products per offer
  const productCountPerOffer = (offerId) => products.filter(p => p.offer_id === offerId).length;

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-white/10 border-t-[#08183A] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">Offers</h1>
          <p className="text-white/40 text-xs font-sans mt-0.5">Manage promotional offers — prices shown to customers only</p>
        </div>
        <button onClick={handleAdd}
          className="flex items-center gap-2 bg-brand-green text-white px-4 py-2.5 rounded-xl font-semibold transition-colors hover:opacity-90">
          <Plus className="w-4 h-4" /> Create Offer
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer, i) => {
          const appliedCount = productCountPerOffer(offer.id);
          return (
            <motion.div key={offer.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-[#0B192D] rounded-2xl border border-white/10 p-5 shadow-[0_4px_12px_rgba(0,0,0,0.2)] relative overflow-hidden flex flex-col justify-between">
              {!offer.is_active && (
                <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-[10px] font-bold px-3 py-1 rounded-bl-xl">INACTIVE</div>
              )}
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200">
                    <Shield className="w-4 h-4" />
                    <span className="font-bold tracking-wider">{offer.title}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(offer)} className="text-white/50 hover:text-white p-1.5 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(offer.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <p className="font-serif text-xl font-bold text-white">{parseFloat(offer.discount_percentage)}% OFF</p>
                <p className="text-xs text-white/40 mt-1">
                  {appliedCount > 0
                    ? <span className="text-emerald-400 font-semibold">Applied to {appliedCount} product{appliedCount !== 1 ? 's' : ''}</span>
                    : <span className="text-white/30">Not applied to any products</span>
                  }
                </p>
                <p className="text-[10px] text-white/30 mt-1 font-sans">Admin prices unchanged · discount shown to customers only</p>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                <button onClick={() => setApplyOfferId(offer.id)}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 text-white transition-colors">
                  Apply <ArrowRight className="w-4 h-4" />
                </button>
                {appliedCount > 0 && (
                  <button onClick={() => handleRemoveOffer(offer.id)}
                    className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-sm font-semibold text-red-400 transition-colors"
                    title="Remove from all products">
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Edit / Create Modal */}
      {editOffer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-[#0B192D] rounded-2xl w-full max-w-md overflow-hidden">
            <div className="bg-[#0B192D] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-white">{isNew ? "Create" : "Edit"} Offer</h2>
              <button onClick={() => setEditOffer(null)} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-sans font-semibold text-white/70 mb-1 block">Offer Title</label>
                <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Diwali Special"
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-white focus:outline-none focus:border-white/30" />
              </div>
              <div>
                <label className="text-xs font-sans font-semibold text-white/70 mb-1 block">Discount Percentage (%)</label>
                <input type="number" min="1" max="99" value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-white focus:outline-none focus:border-white/30" />
                <p className="text-[10px] text-white/30 mt-1">This % will be deducted from the product's price for customers only</p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" id="offer_active" checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4" />
                <label htmlFor="offer_active" className="text-sm font-sans font-semibold text-white cursor-pointer">Active</label>
              </div>
            </div>
            <div className="border-t border-white/10 px-6 py-4 flex gap-3">
              <button onClick={() => setEditOffer(null)} className="flex-1 px-4 py-2 bg-white/[0.02] text-white rounded-xl font-semibold">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2 bg-brand-green text-white rounded-xl font-semibold flex justify-center items-center gap-2">
                {saving ? "Saving..." : <><Save className="w-4 h-4" /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Offer Modal */}
      {applyOfferId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-[#0B192D] rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#0B192D] border-b border-white/10 px-6 py-4 flex items-center justify-between shrink-0">
              <div>
                <h2 className="font-serif text-xl font-bold text-white">Apply Offer</h2>
                <p className="text-xs text-white/40 mt-0.5">Discounted price will be shown to customers only</p>
              </div>
              <button onClick={() => { setApplyOfferId(null); setSelectedCategory(""); setSelectedProducts([]); }} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {/* Mode Tabs */}
              <div className="flex border-b border-white/10 mb-5 gap-1">
                {[
                  { key: 'all', label: 'All Products' },
                  { key: 'category', label: 'By Category' },
                  { key: 'products', label: 'Specific Products' },
                ].map(m => (
                  <button key={m.key}
                    className={`flex-1 py-2 font-semibold text-xs rounded-t-lg transition ${applyMode === m.key ? 'border-b-2 border-brand-green text-white' : 'text-white/40 hover:text-white/70'}`}
                    onClick={() => setApplyMode(m.key)}>
                    {m.label}
                  </button>
                ))}
              </div>

              {applyMode === 'all' && (
                <div className="text-center py-6">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                  <p className="text-white font-semibold">Apply to all active products</p>
                  <p className="text-xs text-white/40 mt-1">All {products.length} active product{products.length !== 1 ? 's' : ''} will get this discount applied</p>
                </div>
              )}

              {applyMode === 'category' && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold block text-white">Select Category</label>
                  <input
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    placeholder="e.g. Serums"
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-white focus:outline-none focus:border-white/30 text-sm"
                  />
                  <p className="text-xs text-white/30 mt-1">Type the exact category name (e.g. Serums)</p>
                </div>
              )}

              {applyMode === 'products' && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-white focus:outline-none text-sm"
                  />
                  <div className="max-h-[260px] overflow-y-auto border border-white/10 rounded-lg p-2 space-y-1">
                    {filteredProducts.map(p => {
                      const hasOffer = p.offer_id !== null && p.offer_id !== undefined;
                      return (
                        <label key={p.id} className="flex items-center gap-3 p-2 hover:bg-white/[0.02] rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(p.id)}
                            onChange={() => toggleProductSelection(p.id)}
                            className="w-4 h-4"
                          />
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-sm font-semibold text-white truncate">{p.name}</span>
                            <span className="text-xs text-white/40 shrink-0">₹{p.price}</span>
                          </div>
                          {hasOffer && (
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full shrink-0">Has Offer</span>
                          )}
                        </label>
                      );
                    })}
                    {filteredProducts.length === 0 && <p className="text-center text-white/40 text-sm py-4">No products found</p>}
                  </div>
                  <div className="text-xs text-white/40 text-right">{selectedProducts.length} selected</div>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 px-6 py-4 flex gap-3 shrink-0">
              <button onClick={() => { setApplyOfferId(null); setSelectedCategory(""); setSelectedProducts([]); }}
                className="flex-1 px-4 py-2 bg-white/[0.02] text-white rounded-xl font-semibold">Cancel</button>
              <button onClick={handleApplyAction} disabled={applying}
                className="flex-1 px-4 py-2 bg-brand-green text-white rounded-xl font-semibold disabled:opacity-60">
                {applying ? "Applying..." : "Apply Offer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
