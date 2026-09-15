import React, { useState } from 'react';
import { PhoneCall, MessageCircle, Mail, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import { BRAND_INFO } from '../data/product';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${BACKEND_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'Thank you! Redirecting you to WhatsApp...' });
        
        // Open WhatsApp with pre-filled details
        const waNumber = '918074193553';
        const waText = `*New Inquiry from JHODSY Website*%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Subject:* ${formData.subject}%0A*Message:* ${formData.message}`;
        window.open(`https://wa.me/${waNumber}?text=${waText}`, '_blank');

        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to send message.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs font-bold tracking-[0.25em] text-[#BFC3C8] uppercase font-sans">
          LUXURY CONCIERGE CARE
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-white font-serif">
          Contact JHODSY
        </h1>
        <p className="text-sm sm:text-base text-[#AEB6C2]">
          Our client support team is ready to assist you with order inquiries, product recommendations, and skincare consultations.
        </p>
      </div>

      {/* Main Contact Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Toll-Free Call */}
        <a
          href={`tel:${BRAND_INFO.customerCare}`}
          className="bg-[#0B192D] border border-white/10 hover:border-white/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition group shadow-card-dark"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-4 group-hover:scale-105 transition">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-[#8994A3] font-medium">Toll-Free Customer Care</span>
            <h3 className="text-xl font-bold text-white group-hover:underline">{BRAND_INFO.customerCare}</h3>
            <p className="text-xs text-[#AEB6C2] pt-1">Direct telephonic customer support</p>
          </div>
        </a>

        {/* WhatsApp Direct Concierge */}
        <a
          href={BRAND_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#0B192D] border border-white/10 hover:border-white/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition group shadow-card-dark"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center text-white mb-4 group-hover:scale-105 transition shadow-md">
            <MessageCircle className="w-6 h-6 fill-white" />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-[#8994A3] font-medium">WhatsApp Skincare Help</span>
            <h3 className="text-xl font-bold text-white group-hover:underline">{BRAND_INFO.whatsapp}</h3>
            <p className="text-xs text-[#AEB6C2] pt-1">Instant messaging & order assistance</p>
          </div>
        </a>

        {/* Official Email */}
        <a
          href={`mailto:${BRAND_INFO.email}`}
          className="bg-[#0B192D] border border-white/10 hover:border-white/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition group shadow-card-dark"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-4 group-hover:scale-105 transition">
            <Mail className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-[#8994A3] font-medium">Official Email Support</span>
            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:underline">{BRAND_INFO.email}</h3>
            <p className="text-xs text-[#AEB6C2] pt-1">Inquiries answered within 24 hours</p>
          </div>
        </a>

        {/* Operating Hours */}
        <div className="bg-[#0B192D] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-card-dark">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-[#8994A3] font-medium">Concierge Timings</span>
            <h3 className="text-lg sm:text-xl font-bold text-white">{BRAND_INFO.timings}</h3>
            <p className="text-xs text-[#AEB6C2] pt-1">Closed on Sundays and National Holidays</p>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="bg-[#0B192D] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-card-dark">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Send us a Message</h2>
          <p className="text-sm text-[#AEB6C2]">We typically reply within 24 hours.</p>
        </div>

        {status && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#8994A3] uppercase tracking-wider">Full Name</label>
              <input
                required
                type="text"
                className="w-full bg-[#05080D] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green/50 transition-colors"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#8994A3] uppercase tracking-wider">Email Address</label>
              <input
                required
                type="email"
                className="w-full bg-[#05080D] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green/50 transition-colors"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="jane@example.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8994A3] uppercase tracking-wider">Subject</label>
            <input
              required
              type="text"
              className="w-full bg-[#05080D] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green/50 transition-colors"
              value={formData.subject}
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Order Inquiry / Product Question"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8994A3] uppercase tracking-wider">Message</label>
            <textarea
              required
              rows={4}
              className="w-full bg-[#05080D] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green/50 transition-colors resize-none"
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              placeholder="How can we help you today?"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green hover:bg-white text-white hover:text-[#071426] py-4 rounded-xl font-bold tracking-wide transition-colors flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> <span>Send Message</span></>}
          </button>
        </form>
      </div>

      {/* Registered Business Address & Tax Details */}
      <div className="bg-[#071426] border border-white/10 rounded-3xl p-8 space-y-4 shadow-card-dark">
        <div className="flex items-center space-x-3 text-white">
          <MapPin className="w-5 h-5 text-white" />
          <h3 className="text-lg font-bold">Registered Business Address</h3>
        </div>
        <p className="text-sm text-[#AEB6C2] leading-relaxed pl-8">
          JHODSY<br />
          1-328, Kothapeta,<br />
          VSMD 011, Rambilli, Anakapalli,<br />
          Andhra Pradesh - 531061, India
        </p>
        <div className="pt-4 border-t border-white/10 flex flex-wrap gap-6 text-xs text-[#8994A3] pl-8">
          <span>GSTIN: <strong className="text-white">{BRAND_INFO.gst}</strong></span>
          <span>Category: <strong className="text-white">Skincare Retail</strong></span>
          <span>Target Customers: <strong className="text-white">Men & Women</strong></span>
        </div>
      </div>
    </div>
  );
};
