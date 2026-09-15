import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Package, BarChart3, LogOut, Shield, Users, Menu, X, ImageIcon, Tag, Truck, Settings, Store, MessageSquare, PalmtreeIcon } from "lucide-react";

const JHODSY_LOGO = '/jhodsy-skincare/assets/jhodsy-logo-symbol.png';

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: "/admin/orders", label: "Orders", icon: <ShoppingBag className="w-4 h-4" /> },
  { href: "/admin/customers", label: "Customers", icon: <Users className="w-4 h-4" /> },
  { href: "/admin/products", label: "Products", icon: <Package className="w-4 h-4" /> },
  { href: "/admin/offers", label: "Offers", icon: <Shield className="w-4 h-4" /> },
  { href: "/admin/banners", label: "Banners", icon: <ImageIcon className="w-4 h-4" /> },
  { href: "/admin/coupons", label: "Coupons", icon: <Tag className="w-4 h-4" /> },
  { href: "/admin/reviews", label: "Reviews", icon: <MessageSquare className="w-4 h-4" /> },
  { href: "/admin/reports", label: "Reports", icon: <BarChart3 className="w-4 h-4" /> },
  { href: "/admin/vacation", label: "Vacation", icon: <PalmtreeIcon className="w-4 h-4" /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
];

export function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [admin, setAdmin] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // For now, mock admin data if no actual auth is setup to avoid blocking
    const token = localStorage.getItem("token");
    if (!token) {
      // Mocking admin login for demo purposes based on requirements
      setAdmin({ name: "JHODSY Admin", email: "admin@jhodsy.com" });
      return;
    }

    fetch(`${BACKEND_URL}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (!d.user || d.user.role !== "admin") { navigate("/"); return; }
        setAdmin(d.user);
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!admin) return (
    <div className="min-h-screen bg-[#071426] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#071426] text-white flex font-sans select-none">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#0B192D] border-b border-white/10 px-4 py-3 flex items-center justify-between z-50 backdrop-blur-md bg-opacity-90">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative">
            <img src={JHODSY_LOGO} alt="JHODSY" className="w-full h-full object-contain" />
          </div>
          <span className="font-serif font-bold text-white tracking-widest uppercase">Admin</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white hover:text-gray-300 transition-colors">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`w-72 bg-[#0B192D] border-r border-white/10 flex flex-col fixed h-full z-50 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[4px_0_24px_rgba(0,0,0,0.5)] ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}>
        <div className="p-6 border-b border-white/10 flex items-center gap-4">
          <div className="w-10 h-10 relative flex-shrink-0 bg-white/5 rounded-xl flex items-center justify-center p-2">
            <img src={JHODSY_LOGO} alt="JHODSY" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="font-serif font-bold text-white tracking-widest text-lg uppercase">JHODSY</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <p className="text-[#AEB6C2] text-xs font-semibold uppercase tracking-wider">Admin Panel</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-b border-white/10 bg-white/[0.02]">
          <p className="font-sans font-bold text-white text-sm truncate">{admin.name || "JHODSY Admin"}</p>
          <p className="text-[#AEB6C2] text-xs font-sans truncate mt-1">{admin.email}</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto min-h-0 custom-scrollbar">
          {NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-sans font-medium transition-all duration-200 ${isActive
                    ? "bg-white/10 text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)] border border-white/5"
                    : "text-[#8994A3] hover:text-white hover:bg-white/5"
                  }`}>
                <div className={`${isActive ? "text-blue-400" : "text-[#8994A3]"}`}>
                  {item.icon}
                </div>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10 bg-[#0B192D]">
          <button onClick={handleLogout}
            className="flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl text-sm font-sans font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full border border-red-500/20">
            <LogOut className="w-4 h-4" /> Secure Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-72 p-4 sm:p-8 pt-20 md:pt-8 min-w-0 bg-[#071426] text-white">
        {/* We wrap children so any embedded components inherit dark mode styling implicitly if they use generic text colors. 
            Note: Further refinements to individual admin pages (Orders, Products) may be needed to ensure they don't hardcode light-mode colors. */}
        {children}
      </main>
    </div>
  );
}
