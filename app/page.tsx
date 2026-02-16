import Link from 'next/link';
import SunLogo from '@/components/SunLogo';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <SunLogo size={80} className="text-amber-600 mb-4" />
      <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase mb-2">
        SolarFlow
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        Tu oficina de bolsillo para gestionar instalaciones solares.
      </p>
      <div className="flex gap-4">
        <Link href="/login" className="btn-primary">
          Iniciar sesión
        </Link>
        <Link href="/signup" className="btn-secondary">
          Registrarse
        </Link>
      </div>
    </div>
  );
}
