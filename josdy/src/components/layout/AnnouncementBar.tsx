import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const AnnouncementBar: React.FC = () => {
  const [announcement, setAnnouncement] = useState<any>(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/settings/announcement`)
      .then(res => res.json())
      .then(data => {
        if (data.announcement && data.announcement.is_active) {
          setAnnouncement(data.announcement);
        }
      })
      .catch(console.error);
  }, []);

  if (!announcement || !announcement.items || announcement.items.length === 0) return null;

  return (
    <div className="w-full bg-[#071426] border-b border-white/10 overflow-hidden relative z-[60] py-2 flex items-center">
      <div className="flex w-max animate-marquee space-x-12 px-4">
        {/* Triplicate items to ensure a seamless infinite scroll effect regardless of screen size */}
        {[...announcement.items, ...announcement.items, ...announcement.items, ...announcement.items].map((item: any, idx: number) => (
          <span key={idx} className="text-[10px] sm:text-[11px] font-bold text-white uppercase tracking-[0.2em] whitespace-nowrap">
            {item.link ? (
              <a href={item.link} className="hover:text-emerald-400 hover:underline transition-colors">{item.text}</a>
            ) : (
              <span>{item.text}</span>
            )}
            <span className="mx-6 text-white/30">•</span>
          </span>
        ))}
      </div>
    </div>
  );
};
