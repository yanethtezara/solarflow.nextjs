import Link from 'next/link';

export default function DashboardHomePage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase mb-2">
        Bienvenido a SolarFlow
      </h1>
      <p className="text-slate-600 mb-6 sm:mb-8">
        Tu oficina de bolsillo para gestionar instalaciones solares.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Link
          href="/dashboard/empresas"
          className="block p-4 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 min-h-[88px] sm:min-h-0 flex flex-col justify-center"
        >
          <h2 className="text-lg font-bold text-amber-600 mb-2">Empresas</h2>
          <p className="text-slate-600 text-sm">
            Administra las empresas que te contratan para asociarlas a trabajos.
          </p>
        </Link>
        <Link
          href="/dashboard/clientes"
          className="block p-4 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 min-h-[88px] sm:min-h-0 flex flex-col justify-center"
        >
          <h2 className="text-lg font-bold text-amber-600 mb-2">Clientes</h2>
          <p className="text-slate-600 text-sm">
            Gestiona la información de tus clientes: nombre, dirección y teléfono.
          </p>
        </Link>
        <Link
          href="/dashboard/trabajos"
          className="block p-4 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 min-h-[88px] sm:min-h-0 flex flex-col justify-center"
        >
          <h2 className="text-lg font-bold text-amber-600 mb-2">Trabajos</h2>
          <p className="text-slate-600 text-sm">
            Crea y gestiona tus trabajos de instalación con calendario.
          </p>
        </Link>
        <Link
          href="/dashboard/catalogo"
          className="block p-4 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 min-h-[88px] sm:min-h-0 flex flex-col justify-center"
        >
          <h2 className="text-lg font-bold text-amber-600 mb-2">Catálogo</h2>
          <p className="text-slate-600 text-sm">
            Materiales y servicios con precios para facturación rápida.
          </p>
        </Link>
      </div>
    </div>
  );
}
