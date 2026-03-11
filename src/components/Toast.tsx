'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export default function Toast({ message, visible, onHide, duration = 3000 }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible && message) {
      setShow(true);
      const t = setTimeout(() => {
        setShow(false);
        setTimeout(onHide, 200);
      }, duration);
      return () => clearTimeout(t);
    }
  }, [visible, message, duration, onHide]);

  if (!show) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-medium shadow-lg animate-fade-in"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
