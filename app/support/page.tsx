import Link from 'next/link';
import SunLogo from '@/components/SunLogo';

export default function SupportPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center mb-8">
          <SunLogo
            size={80}
            className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse"
          />
        </div>

        <h1 className="text-3xl font-black tracking-tight text-white uppercase">Soporte Técnico</h1>

        <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl shadow-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">Página en Construcción</h2>
          <p className="text-slate-400 leading-relaxed">
            Estamos trabajando para ofrecerte el mejor soporte técnico para SolarFlow. Esta
            funcionalidad estará disponible próximamente.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center text-amber-500 hover:text-amber-400 font-medium transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
