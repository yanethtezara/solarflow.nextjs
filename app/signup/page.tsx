'use client';

import Link from 'next/link';
import SunLogo from '@/components/SunLogo';
import RegistrationForm from '@/components/auth/RegistrationForm';

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      {/* Background decoration - subtle sun-like glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-3xl" />
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
                Únete a SolarFlow
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Tu oficina de bolsillo para instalaciones solares.
              </p>
            </div>
          </div>

          {/* Form Component */}
          <RegistrationForm />

          {/* Footer Link */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              ¿Ya tienes cuenta?{' '}
              <Link
                href="/login"
                className="font-bold text-amber-600 hover:text-amber-700 transition-colors duration-200 underline-offset-4 hover:underline"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Legal / Trust footer */}
        <p className="mt-8 text-center text-xs text-slate-400">
          Al crear una cuenta, aceptas nuestros términos de servicio y política de privacidad.
        </p>
      </div>
    </main>
  );
}
