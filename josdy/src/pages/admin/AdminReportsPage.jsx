import React, { useEffect, useState } from "react";
import { Download, TrendingUp, DollarSign, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export function AdminReportsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    // Simulate fetching reports by just calling dashboard stats for now
    fetch(`${BACKEND_URL}/admin/dashboard/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const downloadReport = async (type) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      let endpoint = '';
      let filename = `${type}_report.csv`;
      switch (type) {
        case 'revenue': case 'orders': endpoint = '/admin/orders'; break;
        case 'products': endpoint = '/admin/products'; break;
        case 'customers': endpoint = '/admin/users'; break;
        case 'coupons': endpoint = '/admin/coupons'; break;
        default: return;
      }
      const res = await fetch(`${BACKEND_URL}${endpoint}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      let csvContent = "";
      let headers = [];
      let rows = [];
      if (type === 'revenue' || type === 'orders') {
        const orders = data.orders || [];
        headers = ["Order ID", "Date", "Customer Name", "Customer Phone", "Status", "Total Amount", "Payment ID"];
        rows = orders.map(o => [
          o.order_number || o.id,
          new Date(o.created_at).toLocaleString(),
          o.address?.name || o.user_name || 'Guest',
          o.address?.mobile || o.address?.phone || '',
          o.status,
          o.total,
          o.razorpay_payment_id || ''
        ]);
      } else if (type === 'products') {
        const products = data.products || [];
        headers = ["Product ID", "Name", "Price", "MRP", "Stock", "Category ID"];
        rows = products.map(p => [p.id, p.name, p.price, p.mrp, p.stock || 0, p.category_id || '']);
      } else if (type === 'customers') {
        const users = data.users || [];
        headers = ["User ID", "Email", "Name", "Phone", "Role", "Joined Date"];
        rows = users.map(u => [u.id, u.email, u.name || '', u.phone || '', u.role, new Date(u.created_at).toLocaleString()]);
      } else if (type === 'coupons') {
        const coupons = data.coupons || [];
        headers = ["Coupon ID", "Code", "Discount %", "Usage Type", "Active"];
        rows = coupons.map(c => [c.id, c.code, c.discount_percentage, c.usage_type || '', c.is_active ? 'Yes' : 'No']);
      }
      csvContent += headers.join(",") + "\n";
      rows.forEach(rowArray => {
        const row = rowArray.map(item => `"${String(item || '').replace(/"/g, '""')}"`).join(",");
        csvContent += row + "\n";
      });
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading report", error);
      alert("Failed to download report.");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-white/10 border-t-[#08183A] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">Reports & Analytics</h1>
        <p className="text-white/40 text-xs font-sans mt-0.5">Download data and view store performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#0B192D] rounded-2xl border border-white/10 p-5 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 text-amber-500 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-sans text-white/50 uppercase tracking-wider font-semibold">Total Revenue</p>
              <p className="text-xl font-serif font-bold text-white">${stats?.totalRevenue || 0}</p>
            </div>
          </div>
          <button onClick={() => downloadReport('revenue')} className="w-full mt-2 flex items-center justify-center gap-2 bg-[#D4AF37] text-[#08183A] py-2.5 rounded-xl text-sm font-bold hover:bg-[#F0E0C0] transition-colors shadow-lg">
            <Download className="w-4 h-4" /> Download Sales Report
          </button>
        </div>

        <div className="bg-[#0B192D] rounded-2xl border border-white/10 p-5 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-sans text-white/50 uppercase tracking-wider font-semibold">Total Orders</p>
              <p className="text-xl font-serif font-bold text-white">{stats?.totalOrders || 0}</p>
            </div>
          </div>
          <button onClick={() => downloadReport('orders')} className="w-full mt-2 flex items-center justify-center gap-2 bg-[#D4AF37] text-[#08183A] py-2.5 rounded-xl text-sm font-bold hover:bg-[#F0E0C0] transition-colors shadow-lg">
            <Download className="w-4 h-4" /> Download Orders Report
          </button>
        </div>
      </div>

      <div className="bg-[#0B192D] rounded-2xl border border-white/10 p-5 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
        <h3 className="font-serif font-bold text-white mb-4">Export Data Center</h3>
        <div className="space-y-3">
          {[
            { title: "Products Inventory", desc: "Download full list of products, stock, and pricing", type: "products" },
            { title: "Customer Database", desc: "Download registered users and their details", type: "customers" },
            { title: "Coupon Usage", desc: "Download history of used discount codes", type: "coupons" }
          ].map((report, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.02] border border-brand-green/5">
              <div>
                <p className="font-sans font-bold text-white">{report.title}</p>
                <p className="text-xs text-white/50">{report.desc}</p>
              </div>
              <button onClick={() => downloadReport(report.type)} className="flex items-center justify-center gap-2 bg-[#D4AF37] text-[#08183A] px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#F0E0C0] transition-colors shadow-md">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
