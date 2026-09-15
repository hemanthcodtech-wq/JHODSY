import React, { useEffect, useState } from "react";
import { ShoppingBag, Users, TrendingUp, MessageCircle, Package, Clock } from "lucide-react";
import { motion } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const WA_NUMBER = "919505550051";

export function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [productsCount, setProductsCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const h = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${BACKEND_URL}/admin/orders`, { headers: h }).then((r) => r.json()),
      fetch(`${BACKEND_URL}/admin/users`, { headers: h }).then((r) => r.json()),
      fetch(`${BACKEND_URL}/admin/products`, { headers: h }).then((r) => r.json()),
    ]).then(([od, ud, pd]) => {
      if (od.orders) setOrders(od.orders);
      if (ud.users) setUsers(ud.users);
      if (pd.products) setProductsCount(pd.products.length);
    }).catch(() => {});
  }, []);

  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + Number(o.total), 0);
  const pending = orders.filter((o) => o.status === "paid" || o.status === "processing" || o.status === "pending").length;

  const stats = [
    { label: "Total Orders", value: orders.length, icon: <ShoppingBag className="w-6 h-6 text-white" />, color: "bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)] border border-red-500/30" },
    { label: "Total Revenue", value: `₹${revenue.toLocaleString()}`, icon: <TrendingUp className="w-6 h-6 text-white" />, color: "bg-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.3)] border border-green-500/30" },
    { label: "Customers", value: users.length, icon: <Users className="w-6 h-6 text-white" />, color: "bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)] border border-blue-500/30" },
    { label: "Pending Orders", value: pending, icon: <Clock className="w-6 h-6 text-white" />, color: "bg-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.3)] border border-orange-500/30" },
    { label: "Products", value: productsCount, icon: <Package className="w-6 h-6 text-white" />, color: "bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.3)] border border-purple-500/30" },
  ];

  const notifyWhatsApp = (order) => {
    const phone = order.address?.phone || order.address?.mobile || WA_NUMBER;
    const items = (order.items || []).map((i) => `${i.qty}x ${i.name}`).join(", ");
    const msg = encodeURIComponent(`Hi ${order.address?.name || "Customer"}! 🙏 Your order #${order.id} (${items}) is being prepared and will be delivered soon. Thank you for ordering!`);
    window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${msg}`, "_blank");
  };

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 tracking-wide">Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 mb-8 sm:mb-10">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-[#0B192D] rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">{s.value}</p>
              <p className="text-[#8994A3] text-xs font-sans mt-0.5 uppercase tracking-wider">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders with WhatsApp Notify */}
      <div className="bg-[#0B192D] rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <h2 className="font-serif text-lg sm:text-xl font-bold text-white mb-4 sm:mb-5 tracking-wide">Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="text-[#8994A3] font-sans text-sm text-center py-8 bg-white/[0.02] rounded-xl border border-white/5">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-3 sm:px-0">
              <table className="w-full text-sm font-sans min-w-[480px]">
                <thead>
                  <tr className="text-[#8994A3] text-xs uppercase tracking-wider border-b border-white/10">
                    <th className="text-left py-3 pr-2 sm:pr-4">Order</th>
                    <th className="text-left py-3 pr-2 sm:pr-4">Customer</th>
                    <th className="text-left py-3 pr-2 sm:pr-4">Total</th>
                    <th className="text-left py-3 pr-2 sm:pr-4">Status</th>
                    <th className="text-left py-3">Notify</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.slice(0, 8).map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 pr-2 sm:pr-4 font-semibold text-white text-xs sm:text-sm">#{order.id}</td>
                      <td className="py-4 pr-2 sm:pr-4 text-[#AEB6C2] text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">{order.address?.name || "—"}</td>
                      <td className="py-4 pr-2 sm:pr-4 font-serif font-bold text-white text-xs sm:text-sm">₹{order.total}</td>
                      <td className="py-4 pr-2 sm:pr-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${
                          order.status === "delivered" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                          order.status === "paid" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                          order.status === "shipped" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                        }`}>{order.status}</span>
                      </td>
                      <td className="py-4">
                        <button onClick={() => notifyWhatsApp(order)}
                          className="flex items-center gap-1.5 text-[10px] sm:text-xs bg-green-500 hover:bg-green-400 text-black px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                          <MessageCircle className="w-3.5 h-3.5" /> <span className="hidden sm:inline">WhatsApp</span><span className="sm:hidden">WA</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
