'use client';

import { useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

export default function ErrorToast({ message, onClose }: ErrorToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] rounded-xl shadow-xl max-w-sm w-full mx-6">
      <AlertCircle className="w-4 h-4 text-white/60 flex-shrink-0" />
      <span className="text-sm text-white flex-1">{message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
      >
        <X className="w-3.5 h-3.5 text-white/50" />
      </button>
    </div>
  );
}
