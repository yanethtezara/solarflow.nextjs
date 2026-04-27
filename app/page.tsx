import Link from 'next/link';
import SunLogo from '@/components/SunLogo';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-4">
      <SunLogo
        size={80}
        className="text-amber-500 mb-6 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]"
      />
      <h1 className="text-5xl font-black tracking-tight text-white uppercase mb-3 text-center">
        SolarFlow
      </h1>
      <p className="text-xl text-slate-300 mb-10 text-center max-w-md leading-relaxed">
        Tu oficina de bolsillo para gestionar instalaciones solares de forma profesional.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none justify-center">
        <Link href="/login" className="btn-primary text-center">
          Iniciar sesión
        </Link>
        <Link
          href="/signup"
          className="btn-secondary text-center !bg-transparent !text-white !border-slate-700 hover:!bg-slate-800"
        >
          Registrarse
        </Link>
      </div>
    </div>
  );
}
