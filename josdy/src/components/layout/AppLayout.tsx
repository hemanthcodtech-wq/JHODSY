import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';

import { AnnouncementBar } from './AnnouncementBar';

interface AppLayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, hideFooter = false }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#05080D] text-[#F5F5F5] flex flex-col antialiased selection:bg-white/20 selection:text-white font-sans w-full overflow-x-clip">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 w-full">
        {children}
      </main>
      {!hideFooter && <Footer />}
      <BottomNav />
    </div>
  );
};
