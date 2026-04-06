'use client';

import Link from 'next/link';
import SunLogo from '@/components/SunLogo';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-amber-100/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[30%] h-[30%] bg-slate-200/50 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-[400px] relative z-10">
        <div className="card p-8 space-y-8 animate-fade-in shadow-xl bg-white/80 backdrop-blur-sm">
          {/* Brand Header */}
          <div className="flex flex-col items-center space-y-4">
            <Link href="/" className="transition-transform duration-300 hover:scale-105">
              <SunLogo size={64} className="text-amber-600" />
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                Nueva Contraseña
              </h1>
              <p className="text-slate-500 text-sm mt-1">Ingresa tu nueva clave de acceso.</p>
            </div>
          </div>

          {/* Form Component */}
          <ResetPasswordForm />
        </div>
      </div>
    </main>
  );
}
