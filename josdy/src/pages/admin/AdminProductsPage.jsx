import React, { useEffect, useState } from "react";
import { Package, Plus, Trash2, Edit2, X, Save, Upload, Search } from "lucide-react";
import { motion } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  
  const initialFormData = { 
    name: "", tagline: "", description: "", price: "", mrp: "", product_code: "", instagram_reel_url: "", category: "", model: "", is_active: true, allow_reviews: true,
    benefits: [], howToUse: [], ingredients: [],
    variants: [
      { color: "", instagram_link: "", images: [], sizes: [{ size: "", mrp: "", our_price: "", shopkeeper_price: "", stock: 0, stock_delta: "", code: "", weight: "", offer_id: "" }] }
    ],
    details: [],
    reviews: []
  };

  const [formData, setFormData] = useState(initialFormData);
  
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useState("");
  const [stockSort, setStockSort] = useState("none");
  const [offerFilter, setOfferFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [prodRes, catRes, offerRes] = await Promise.all([
        fetch(`${BACKEND_URL}/admin/products`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BACKEND_URL}/admin/categories`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BACKEND_URL}/admin/offers`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      const offerData = await offerRes.json();
      
      if (prodData.products) setProducts(prodData.products);
      if (catData.categories) setCategories(catData.categories);
      if (offerData.offers) setOffers(offerData.offers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e, variantIndex) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    
    try {
      const token = localStorage.getItem("token");
      const uploadedUrls = [];
      
      for (const file of files) {
        const fd = new FormData();
        fd.append("image", file);
        const res = await fetch(`${BACKEND_URL}/admin/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd
        });
        const data = await res.json();
        if (data.url) uploadedUrls.push(data.url);
      }
      
      if (uploadedUrls.length > 0) {
        const updatedVariants = [...formData.variants];
        updatedVariants[variantIndex].images = [...(updatedVariants[variantIndex].images || []), ...uploadedUrls];
        setFormData({ ...formData, variants: updatedVariants });
      }
    } catch (err) {
      console.error(err);
      alert("Upload error");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (variantIndex, imageIndex) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[variantIndex].images.splice(imageIndex, 1);
    setFormData({ ...formData, variants: updatedVariants });
  };

  const handleAdd = () => {
    setFormData(initialFormData);
    setEditProduct({});
    setIsNew(true);
  };

  const handleEdit = (product) => {
    // Handle backwards compatibility for old products
    let variants = product.variants;
    if (!variants || variants.length === 0) {
      const images = Array.isArray(product.images) && product.images.length > 0 
        ? product.images 
        : (product.image_url ? [product.image_url] : []);
      // migrate old size format
      const sizes = product.sizes ? product.sizes.map(s => ({
         size: s.size,
         mrp: s.price, 
         our_price: s.price,
         shopkeeper_price: s.shopkeeper_price || "",
         stock: s.stock || 0
      })) : [];
      
      variants = [{
        color: product.color || "",
        images: images,
        sizes: sizes
      }];
    }

    setFormData({ 
      ...product, 
      model: product.model || "", 
      instagram_reel_url: product.instagram_reel_url || "",
      tagline: product.tagline || "",
      price: product.price || "",
      mrp: product.mrp || "",
      benefits: product.benefits || [],
      howToUse: product.howToUse || product.how_to_use || [],
      ingredients: product.ingredients || [],
      variants: variants,
      details: product.details || [],
      reviews: product.reviews || [],
      allow_reviews: product.allow_reviews ?? true
    });
    setEditProduct(product);
    setIsNew(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete product?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BACKEND_URL}/admin/products/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const url = isNew ? `${BACKEND_URL}/admin/products` : `${BACKEND_URL}/admin/products/${editProduct.id}`;
      
      const payload = { ...formData };
      
      // Auto-compute root price/mrp/stock from variants if missing
      if (!payload.price && payload.variants?.[0]?.sizes?.[0]?.our_price) {
        payload.price = payload.variants[0].sizes[0].our_price;
      }
      if (!payload.mrp && payload.variants?.[0]?.sizes?.[0]?.mrp) {
        payload.mrp = payload.variants[0].sizes[0].mrp;
      }
      if (!payload.stock && payload.variants?.[0]?.sizes?.[0]?.stock) {
        payload.stock = payload.variants[0].sizes[0].stock;
      }
      
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { alert('Save failed: ' + (data.error || res.status)); return; }
      setEditProduct(null);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addVariant = () => {
    setFormData({ ...formData, variants: [...formData.variants, { color: "", instagram_link: "", images: [], sizes: [{ size: "", mrp: "", our_price: "", shopkeeper_price: "", stock: 0, stock_delta: "", code: "", weight: "", offer_id: "" }] }] });
  };
  
  const removeVariant = (index) => {
    const updated = [...formData.variants];
    updated.splice(index, 1);
    setFormData({ ...formData, variants: updated });
  };

  const addReview = () => {
    setFormData({ ...formData, reviews: [...formData.reviews, { name: "", rating: 5, comment: "", color: "", size: "", date: new Date().toISOString() }] });
  };

  const removeReview = (index) => {
    const updated = [...formData.reviews];
    updated.splice(index, 1);
    setFormData({ ...formData, reviews: updated });
  };

  const updateReviewField = (index, field, value) => {
    const updated = [...formData.reviews];
    updated[index][field] = value;
    setFormData({ ...formData, reviews: updated });
  };

  const addDetail = () => {
    setFormData({ ...formData, details: [...(formData.details || []), { label: "", value: "" }] });
  };

  const removeDetail = (index) => {
    const updated = [...formData.details];
    updated.splice(index, 1);
    setFormData({ ...formData, details: updated });
  };

  const updateDetailField = (index, field, value) => {
    const updated = [...formData.details];
    updated[index][field] = value;
    setFormData({ ...formData, details: updated });
  };

  const addSizeToVariant = (vIndex) => {
    const updated = [...formData.variants];
    updated[vIndex].sizes.push({ size: "", mrp: "", our_price: "", shopkeeper_price: "", stock: 0, stock_delta: "", code: "", weight: "", offer_id: "" });
    setFormData({ ...formData, variants: updated });
  };
  
  const removeSizeFromVariant = (vIndex, sIndex) => {
    const updated = [...formData.variants];
    updated[vIndex].sizes.splice(sIndex, 1);
    setFormData({ ...formData, variants: updated });
  };
  
  const updateSizeField = (vIndex, sIndex, field, value) => {
    const updated = [...formData.variants];
    updated[vIndex].sizes[sIndex][field] = value;
    setFormData({ ...formData, variants: updated });
  };

  const updateVariantField = (vIndex, field, value) => {
    const updated = [...formData.variants];
    updated[vIndex][field] = value;
    setFormData({ ...formData, variants: updated });
  };
  
  const selectedCatObj = categories.find(c => c.name === formData.category);
  const availableModels = selectedCatObj?.models || [];

  const skuRows = [];
  products.forEach(p => {
    let variants = p.variants;
    if (!variants || variants.length === 0) {
      variants = [{ color: p.color, images: p.images || (p.image_url ? [p.image_url] : []) }];
    }
    variants.forEach((v, vIndex) => {
      const sizes = v.sizes && v.sizes.length > 0 ? v.sizes : [{ size: "Default", stock: p.stock || 0, code: p.product_code || "" }];
      sizes.forEach((s, sIndex) => {
        skuRows.push({
          product: p,
          variant: v,
          size: s,
          vIndex,
          sIndex,
          skuId: `${p.id}-${vIndex}-${sIndex}`
        });
      });
    });
  });

  const filteredSkus = skuRows.filter(row => {
    const s = search.toLowerCase();
    const nameMatch = row.product.name?.toLowerCase().includes(s);
    const catMatch = row.product.category?.toLowerCase().includes(s);
    const codeMatch = row.size.code?.toLowerCase().includes(s);
    const colorMatch = row.variant.color?.toLowerCase().includes(s);
    
    if (search && !nameMatch && !catMatch && !codeMatch && !colorMatch) return false;
    if (offerFilter === "has_offer" && !row.size.offer_id) return false;
    if (offerFilter === "no_offer" && row.size.offer_id) return false;
    return true;
  }).sort((a, b) => {
    if (stockSort === "asc") return (a.size.stock || 0) - (b.size.stock || 0);
    if (stockSort === "desc") return (b.size.stock || 0) - (a.size.stock || 0);
    return 0;
  });

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-white/10 border-t-[#08183A] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">Products</h1>
          <p className="text-white/40 text-xs font-sans mt-0.5">Manage inventory, variants, and pricing</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search SKUs..."
              className="pl-9 pr-4 py-2 bg-[#0B192D] rounded-xl border border-white/10 text-sm focus:outline-none w-full sm:w-64" />
          </div>
          <select value={stockSort} onChange={e => setStockSort(e.target.value)} className="px-3 py-2 bg-[#0B192D] rounded-xl border border-white/10 text-sm focus:outline-none">
            <option value="none">Stock: Default</option>
            <option value="asc">Stock: Low to High</option>
            <option value="desc">Stock: High to Low</option>
          </select>
          <select value={offerFilter} onChange={e => setOfferFilter(e.target.value)} className="px-3 py-2 bg-[#0B192D] rounded-xl border border-white/10 text-sm focus:outline-none">
            <option value="all">Offers: All</option>
            <option value="has_offer">Has Offer</option>
            <option value="no_offer">No Offer</option>
          </select>
          <button onClick={handleAdd}
            className="flex items-center gap-2 bg-brand-green text-white hover:bg-brand-orange text-white text-white px-4 py-2 rounded-xl font-semibold transition-colors whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      <div className="bg-[#0B192D] rounded-2xl border border-white/10 overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/10">
                <th className="px-4 py-3 text-xs font-bold text-white/60 uppercase tracking-wider">Product (Variant/Size)</th>
                <th className="px-4 py-3 text-xs font-bold text-white/60 uppercase tracking-wider">Code (SKU)</th>
                <th className="px-4 py-3 text-xs font-bold text-white/60 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-xs font-bold text-white/60 uppercase tracking-wider">Stock Availability</th>
                <th className="px-4 py-3 text-xs font-bold text-white/60 uppercase tracking-wider">Shopkeeper Price</th>
                <th className="px-4 py-3 text-xs font-bold text-white/60 uppercase tracking-wider">Offer</th>
                <th className="px-4 py-3 text-xs font-bold text-white/60 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-white/60 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSkus.map(row => {
                const firstImg = row.variant.images?.[0] || row.product.image_url;
                const offerObj = offers.find(o => o.id == row.size.offer_id);
                return (
                  <tr key={row.skuId} className="hover:bg-white/[0.02]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden shrink-0 border border-white/10">
                          {firstImg ? (
                            <img src={firstImg} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#8994A3]"><Package className="w-5 h-5" /></div>
                          )}
                        </div>
                        <div>
                          <div className="font-sans font-bold text-white line-clamp-1">{row.product.name}</div>
                          <div className="text-[10px] font-semibold text-[#8994A3]">{row.variant.color} • Size: {row.size.size}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-white/80 font-bold">{row.size.code || "-"}</td>
                    <td className="px-4 py-3 text-sm text-white/70">{row.product.category}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                        row.size.stock <= 0 ? 'bg-red-100 text-red-700' :
                        row.size.stock <= 5 ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {row.size.stock} in stock
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-brand-dark-blue font-bold">
                      {row.size.shopkeeper_price ? `₹${row.size.shopkeeper_price}` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {offerObj ? (
                        <span className="text-[10px] font-bold text-white bg-blue-500 px-2 py-0.5 rounded-full">{offerObj.discount_percentage}% OFF</span>
                      ) : <span className="text-xs text-[#8994A3]">-</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${row.product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {row.product.is_active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(row.product)} className="p-1.5 text-brand-green hover:bg-brand-green/10 rounded"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(row.product.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredSkus.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-white/50">No variants/SKUs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0B192D] rounded-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#0B192D] border-b border-white/10 px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="font-serif text-xl font-bold text-white">{isNew ? "Add" : "Edit"} Product</h2>
              <button onClick={() => setEditProduct(null)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-sans font-semibold text-white/70 mb-1 block">Product Name</label>
                  <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 focus:outline-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-sans font-semibold text-white/70 mb-1 block">Category</label>
                  <select value={formData.category} onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value, model: "" });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 focus:outline-none">
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                
                {availableModels.length > 0 && (
                  <div>
                    <label className="text-xs font-sans font-semibold text-white/70 mb-1 block">Model / Subcategory</label>
                    <select value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 focus:outline-none">
                      <option value="">Select Model (Optional)</option>
                      {availableModels.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className={availableModels.length === 0 ? 'col-span-1' : 'col-span-2'}>
                  <label className="text-xs font-sans font-semibold text-white/70 mb-1 block">Allow Reviews</label>
                  <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" checked={formData.allow_reviews} onChange={(e) => setFormData({ ...formData, allow_reviews: e.target.checked })}
                      className="w-4 h-4 text-white" />
                    <span className="text-sm font-sans font-semibold text-white cursor-pointer">Enable reviews</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-sans font-semibold text-white/70 mb-1 block">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 focus:outline-none resize-none" />
              </div>

              <div>
                <label className="text-xs font-sans font-semibold text-white/70 mb-1 block">Tagline</label>
                <input value={formData.tagline || ""} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. For brighter, even-toned skin"
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 focus:outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-sans font-semibold text-white/70 mb-1 block">Root Price (₹)</label>
                  <input type="number" value={formData.price || ""} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Base Selling Price"
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-sans font-semibold text-white/70 mb-1 block">Root MRP (₹)</label>
                  <input type="number" value={formData.mrp || ""} onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    placeholder="Base MRP"
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-sans font-semibold text-white/70 mb-1 block flex justify-between">
                    <span>Benefits</span>
                    <button type="button" onClick={() => setFormData({...formData, benefits: [...(formData.benefits||[]), '']})} className="text-brand-green hover:text-white">Add</button>
                  </label>
                  <div className="space-y-2">
                    {(formData.benefits || []).map((b, i) => (
                      <div key={i} className="flex gap-2">
                        <input value={b} onChange={e => { const newArr = [...formData.benefits]; newArr[i] = e.target.value; setFormData({...formData, benefits: newArr}); }} className="flex-1 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 focus:outline-none text-sm" />
                        <button type="button" onClick={() => { const newArr = [...formData.benefits]; newArr.splice(i, 1); setFormData({...formData, benefits: newArr}); }} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-sans font-semibold text-white/70 mb-1 block flex justify-between">
                    <span>How To Use (Steps)</span>
                    <button type="button" onClick={() => setFormData({...formData, howToUse: [...(formData.howToUse||[]), '']})} className="text-brand-green hover:text-white">Add Step</button>
                  </label>
                  <div className="space-y-2">
                    {(formData.howToUse || []).map((s, i) => (
                      <div key={i} className="flex gap-2">
                        <textarea value={s} onChange={e => { const newArr = [...formData.howToUse]; newArr[i] = e.target.value; setFormData({...formData, howToUse: newArr}); }} rows={2} className="flex-1 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 focus:outline-none text-sm resize-none" />
                        <button type="button" onClick={() => { const newArr = [...formData.howToUse]; newArr.splice(i, 1); setFormData({...formData, howToUse: newArr}); }} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-sans font-semibold text-white/70 mb-1 block flex justify-between">
                    <span>Ingredients</span>
                    <button type="button" onClick={() => setFormData({...formData, ingredients: [...(formData.ingredients||[]), '']})} className="text-brand-green hover:text-white">Add</button>
                  </label>
                  <div className="space-y-2">
                    {(formData.ingredients || []).map((ing, i) => (
                      <div key={i} className="flex gap-2">
                        <input value={ing} onChange={e => { const newArr = [...formData.ingredients]; newArr[i] = e.target.value; setFormData({...formData, ingredients: newArr}); }} className="flex-1 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 focus:outline-none text-sm" />
                        <button type="button" onClick={() => { const newArr = [...formData.ingredients]; newArr.splice(i, 1); setFormData({...formData, ingredients: newArr}); }} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-sans font-semibold text-white/70 mb-1 block">Instagram Reel / Post Link</label>
                <input 
                  type="url"
                  value={formData.instagram_reel_url || ""} 
                  onChange={(e) => setFormData({ ...formData, instagram_reel_url: e.target.value })} 
                  placeholder="https://www.instagram.com/reel/..."
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 focus:outline-none text-sm" 
                />
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-serif font-bold text-white">Variants (Colors & Sizes)</label>
                  <button onClick={addVariant} className="text-xs bg-brand-green text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-brand-orange text-white"><Plus className="w-3 h-3"/> Add Color Variant</button>
                </div>
                
                <div className="space-y-6">
                  {formData.variants.map((variant, vIndex) => (
                    <div key={vIndex} className="bg-white/[0.02] border border-white/10 p-4 rounded-xl relative">
                      <button onClick={() => removeVariant(vIndex)} className="absolute top-3 right-3 text-red-500 hover:bg-red-100 p-1.5 rounded"><Trash2 className="w-4 h-4"/></button>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4 pr-10">
                        <div>
                          <label className="text-xs font-sans font-semibold text-white/70 mb-1 block">Color Name</label>
                          <input value={variant.color} onChange={(e) => updateVariantField(vIndex, 'color', e.target.value)} placeholder="e.g. Gold, Rose Gold"
                            className="w-full px-3 py-2 rounded-lg bg-[#0B192D] border border-white/10 focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-xs font-sans font-semibold text-white/70 mb-1 block">Instagram Reel Link</label>
                          <input value={variant.instagram_link || ""} onChange={(e) => updateVariantField(vIndex, 'instagram_link', e.target.value)} placeholder="https://instagram.com/reel/..."
                            className="w-full px-3 py-2 rounded-lg bg-[#0B192D] border border-white/10 focus:outline-none text-blue-600" />
                        </div>
                      </div>

                      {/* Images for this variant */}
                      <div className="mb-4">
                        <label className="text-xs font-sans font-semibold text-white/70 mb-2 block">Images for {variant.color || 'this color'}</label>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          {variant.images.map((imgUrl, imgIdx) => (
                            <div key={imgIdx} className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 relative group bg-[#0B192D]">
                              <img src={imgUrl} alt={`Preview`} className="w-full h-full object-cover" />
                              <button onClick={() => handleRemoveImage(vIndex, imgIdx)} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          ))}
                          {variant.images.length === 0 && (
                            <div className="w-16 h-16 rounded-lg bg-[#0B192D] border border-white/10 flex items-center justify-center text-gray-300">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div>
                          <input type="file" id={`img_up_${vIndex}`} multiple accept="image/*" onChange={(e) => handleImageUpload(e, vIndex)} className="hidden" />
                          <label htmlFor={`img_up_${vIndex}`} className="inline-flex items-center gap-2 bg-[#0B192D] hover:bg-white/5 text-white border border-white/10 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer">
                            <Upload className="w-3 h-3" /> {uploading ? "Uploading..." : "Upload Images"}
                          </label>
                        </div>
                      </div>

                      {/* Sizes for this variant */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-sans font-semibold text-white/70">Sizes & Pricing for {variant.color || 'this color'}</label>
                          <button onClick={() => addSizeToVariant(vIndex)} className="text-[10px] bg-[#0B192D] border border-gray-300 text-white/80 px-2 py-1 rounded hover:bg-white/5 flex items-center gap-1"><Plus className="w-3 h-3"/> Add Size</button>
                        </div>
                        <div className="space-y-2">
                          {variant.sizes.map((sizeObj, sIndex) => (
                            <div key={sIndex} className="flex flex-wrap items-center gap-2 bg-[#0B192D] p-2 rounded border border-white/10">
                              <input value={sizeObj.size} onChange={e => updateSizeField(vIndex, sIndex, 'size', e.target.value)} placeholder="Size (e.g. S, 10g)" className="flex-1 px-2 py-1.5 bg-white/[0.02] border border-white/10 rounded text-sm focus:outline-none min-w-[80px]" />
                              <input value={sizeObj.code || ""} onChange={e => updateSizeField(vIndex, sIndex, 'code', e.target.value)} placeholder="Code * (e.g. RING-001)" className={`w-32 px-2 py-1.5 bg-white/[0.02] border rounded text-sm focus:outline-none ${!sizeObj.code ? 'border-red-300' : 'border-white/10'}`} />
                              <input type="number" value={sizeObj.mrp} onChange={e => updateSizeField(vIndex, sIndex, 'mrp', e.target.value)} placeholder="MRP (₹)" className="w-20 px-2 py-1.5 bg-white/[0.02] border border-white/10 rounded text-sm focus:outline-none" />
                              <input type="number" value={sizeObj.our_price} onChange={e => updateSizeField(vIndex, sIndex, 'our_price', e.target.value)} placeholder="Our Price (₹)" className="w-24 px-2 py-1.5 bg-white/[0.02] border border-white/10 rounded text-sm focus:outline-none" />
                              <input type="number" value={sizeObj.shopkeeper_price || ""} onChange={e => updateSizeField(vIndex, sIndex, 'shopkeeper_price', e.target.value)} placeholder="Shopkeeper (₹)" className="w-28 px-2 py-1.5 bg-brand-cream/30 border border-brand-gold/30 rounded text-sm focus:outline-none" />
                              <div className="flex items-center gap-1 w-28 bg-white/[0.02] border border-white/10 rounded px-2 py-0.5">
                                <span className="text-xs text-[#8994A3] font-bold w-6 text-center">{sizeObj.stock || 0}</span>
                                <div className="h-4 w-px bg-gray-300"></div>
                                <input type="number" value={sizeObj.stock_delta || ""} onChange={e => updateSizeField(vIndex, sIndex, 'stock_delta', e.target.value)} placeholder="+/- Qty" className="flex-1 w-full bg-transparent text-sm focus:outline-none text-center" />
                              </div>
                              <select value={sizeObj.offer_id || ""} onChange={e => updateSizeField(vIndex, sIndex, 'offer_id', e.target.value)} className="w-24 px-2 py-1.5 bg-white/[0.02] border border-white/10 rounded text-sm focus:outline-none">
                                <option value="">No Offer</option>
                                {offers.filter(o => o.is_active).map(o => (
                                  <option key={o.id} value={o.id}>{o.discount_percentage}% OFF</option>
                                ))}
                              </select>
                              <input value={sizeObj.weight || ""} onChange={e => updateSizeField(vIndex, sIndex, 'weight', e.target.value)} placeholder="Weight (g)" className="w-24 px-2 py-1.5 bg-white/[0.02] border border-white/10 rounded text-sm focus:outline-none" />
                              <button onClick={() => removeSizeFromVariant(vIndex, sIndex)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          ))}
                          {variant.sizes.length === 0 && <p className="text-[10px] text-[#8994A3]">No sizes added.</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.variants.length === 0 && <p className="text-sm text-[#8994A3] italic">No variants added. Please add at least one color variant.</p>}
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-white" />
                  <label htmlFor="is_active" className="text-sm font-sans font-semibold text-white cursor-pointer">Active</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="is_bestseller" checked={formData.is_bestseller || false} onChange={(e) => setFormData({ ...formData, is_bestseller: e.target.checked })}
                    className="w-4 h-4 text-white" />
                  <label htmlFor="is_bestseller" className="text-sm font-sans font-semibold text-white cursor-pointer">Best Seller</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="is_trending" checked={formData.is_trending || false} onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                    className="w-4 h-4 text-white" />
                  <label htmlFor="is_trending" className="text-sm font-sans font-semibold text-white cursor-pointer">Trending</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="is_offer" checked={formData.is_offer || false} onChange={(e) => setFormData({ ...formData, is_offer: e.target.checked })}
                    className="w-4 h-4 text-white" />
                  <label htmlFor="is_offer" className="text-sm font-sans font-semibold text-white cursor-pointer">Offers</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="allow_reviews" checked={formData.allow_reviews ?? true} onChange={(e) => setFormData({ ...formData, allow_reviews: e.target.checked })}
                    className="w-4 h-4 text-white" />
                  <label htmlFor="allow_reviews" className="text-sm font-sans font-semibold text-white cursor-pointer">Allow Customer Reviews</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="is_festive" checked={formData.is_festive || false} onChange={(e) => setFormData({ ...formData, is_festive: e.target.checked })}
                    className="w-4 h-4 text-white" />
                  <label htmlFor="is_festive" className="text-sm font-sans font-semibold text-white cursor-pointer">Festive Collection</label>
                </div>
              </div>

              {/* Product Details Section */}
              <div className="pt-3 border-t border-white/10">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-serif font-bold text-white">Product Details</label>
                  <button onClick={addDetail} className="text-xs bg-brand-green text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-brand-orange text-white"><Plus className="w-3 h-3"/> Add Detail</button>
                </div>
                <p className="text-[10px] text-[#8994A3] mb-3">Add specs like Material, Weight, Purity, Finish, etc. These show in the "Details" tab on the product page.</p>
                <div className="space-y-2">
                  {(formData.details || []).map((detail, dIndex) => (
                    <div key={dIndex} className="flex items-center gap-2 bg-white/[0.02] p-2 rounded border border-white/10">
                      <input
                        value={detail.label}
                        onChange={e => updateDetailField(dIndex, 'label', e.target.value)}
                        placeholder="Label (e.g. Material)"
                        className="flex-1 px-2 py-1.5 bg-[#0B192D] border border-white/10 rounded text-sm focus:outline-none"
                      />
                      <input
                        value={detail.value}
                        onChange={e => updateDetailField(dIndex, 'value', e.target.value)}
                        placeholder="Value (e.g. 18K Gold)"
                        className="flex-1 px-2 py-1.5 bg-[#0B192D] border border-white/10 rounded text-sm focus:outline-none"
                      />
                      <button onClick={() => removeDetail(dIndex)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  ))}
                  {(!formData.details || formData.details.length === 0) && <p className="text-sm text-[#8994A3] italic">No product details added yet.</p>}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="pt-3 border-t border-white/10">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-serif font-bold text-white">Reviews</label>
                  <button onClick={addReview} className="text-xs bg-brand-green text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-brand-orange text-white"><Plus className="w-3 h-3"/> Add Review</button>
                </div>
                
                <div className="space-y-4">
                  {formData.reviews.map((review, rIndex) => (
                    <div key={rIndex} className="bg-white/[0.02] border border-white/10 p-4 rounded-xl relative">
                      <button onClick={() => removeReview(rIndex)} className="absolute top-3 right-3 text-red-500 hover:bg-red-100 p-1.5 rounded"><Trash2 className="w-4 h-4"/></button>
                      <div className="grid grid-cols-2 gap-3 pr-10 mb-3">
                        <div>
                          <label className="text-[10px] font-bold text-[#8994A3] uppercase block mb-1">Name</label>
                          <input value={review.name} onChange={e => updateReviewField(rIndex, 'name', e.target.value)} className="w-full px-2 py-1.5 text-sm bg-[#0B192D] border border-white/10 rounded focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-[#8994A3] uppercase block mb-1">Rating</label>
                          <select value={review.rating} onChange={e => updateReviewField(rIndex, 'rating', Number(e.target.value))} className="w-full px-2 py-1.5 text-sm bg-[#0B192D] border border-white/10 rounded focus:outline-none">
                            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-[#8994A3] uppercase block mb-1">Color (Optional)</label>
                          <input value={review.color || ""} onChange={e => updateReviewField(rIndex, 'color', e.target.value)} className="w-full px-2 py-1.5 text-sm bg-[#0B192D] border border-white/10 rounded focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-[#8994A3] uppercase block mb-1">Size (Optional)</label>
                          <input value={review.size || ""} onChange={e => updateReviewField(rIndex, 'size', e.target.value)} className="w-full px-2 py-1.5 text-sm bg-[#0B192D] border border-white/10 rounded focus:outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#8994A3] uppercase block mb-1">Comment</label>
                        <textarea value={review.comment} onChange={e => updateReviewField(rIndex, 'comment', e.target.value)} rows={2} className="w-full px-2 py-1.5 text-sm bg-[#0B192D] border border-white/10 rounded focus:outline-none resize-none" />
                      </div>
                    </div>
                  ))}
                  {formData.reviews.length === 0 && <p className="text-sm text-[#8994A3] italic">No reviews yet.</p>}
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/10 px-6 py-4 flex gap-3 shrink-0 bg-[#0B192D]">
              <button onClick={() => setEditProduct(null)} className="flex-1 px-4 py-2 bg-white/[0.02] text-white rounded-xl font-semibold hover:bg-white/[0.02]/70">Cancel</button>
              <button onClick={handleSave} disabled={saving || uploading || !formData.name || formData.variants.length === 0} className="flex-1 px-4 py-2 bg-brand-green text-white rounded-xl font-semibold flex justify-center items-center gap-2 disabled:opacity-50 hover:bg-brand-orange text-white transition-colors">
                {saving ? "Saving..." : <><Save className="w-4 h-4" /> Save</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
