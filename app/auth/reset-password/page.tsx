'use client';

import Link from 'next/link';
import SunLogo from '@/components/SunLogo';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-[400px] relative z-10">
        <div className="card p-8 space-y-8 animate-fade-in shadow-2xl bg-slate-800/50 backdrop-blur-md border border-slate-700">
          {/* Brand Header */}
          <div className="flex flex-col items-center space-y-4">
            <Link href="/" className="transition-transform duration-300 hover:scale-105">
              <SunLogo
                size={64}
                className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              />
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-tight text-white uppercase">
                Nueva Contraseña
              </h1>
              <p className="text-slate-400 text-sm mt-1">Ingresa tu nueva clave de acceso.</p>
            </div>
          </div>

          {/* Form Component */}
          <ResetPasswordForm />
        </div>
      </div>
    </main>
  );
}
