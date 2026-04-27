'use client';

import Link from 'next/link';
import SunLogo from '@/components/SunLogo';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-[400px] relative z-10">
        <div className="card p-8 space-y-8 animate-fade-in shadow-2xl bg-white">
          {/* Brand Header */}
          <div className="flex flex-col items-center space-y-4">
            <Link href="/" className="transition-transform duration-300 hover:scale-105">
              <SunLogo size={64} className="text-amber-600" />
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                ¿Olvidaste tu clave?
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Ingresa tu correo y te enviaremos las instrucciones.
              </p>
            </div>
          </div>

          {/* Form Component */}
          <ForgotPasswordForm />

          {/* Footer Link */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              ¿Recordaste tu contraseña?{' '}
              <Link
                href="/login"
                className="font-bold text-amber-600 hover:text-amber-700 transition-colors duration-200 underline-offset-4 hover:underline"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
