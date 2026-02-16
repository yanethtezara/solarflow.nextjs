'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SunLogo from '@/components/SunLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900/95 backdrop-blur-sm">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl border border-gray-200 shadow-sm animate-fade-in">
        <div className="flex justify-center">
          <SunLogo size={56} className="text-amber-600" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase text-center">
          Iniciar sesión
        </h1>
        <p className="text-slate-500 text-sm text-center">SolarFlow</p>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Entrar
          </button>
        </form>
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        <p className="text-sm text-center text-slate-600">
          ¿No tienes cuenta?{' '}
          <Link href="/signup" className="font-medium text-amber-600 hover:underline">
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  );
}
