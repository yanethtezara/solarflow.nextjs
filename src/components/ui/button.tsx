'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const baseStyles =
    'px-6 py-2 rounded-lg font-medium transition-colors duration-200 min-h-[44px] flex items-center justify-center disabled:opacity-50';

  const variants = {
    primary: 'bg-amber-600 text-white hover:bg-amber-700',
    secondary: 'border border-gray-200 text-slate-700 hover:bg-gray-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'text-slate-600 hover:bg-gray-100',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
