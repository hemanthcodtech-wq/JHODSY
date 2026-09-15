import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-full bg-[#0B192D]/95 border border-white/20 text-white shadow-card-dark text-xs backdrop-blur-md animate-fade-in pointer-events-none">
      {type === 'success' ? (
        <CheckCircle2 className="w-4 h-4 text-white" />
      ) : (
        <AlertCircle className="w-4 h-4 text-[#AEB6C2]" />
      )}
      <span className="font-medium tracking-wide">{message}</span>
    </div>
  );
};
