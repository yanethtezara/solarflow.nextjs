import { Suspense } from 'react';
import Link from 'next/link';
import CatalogoList from './CatalogoList';
import ToastFromUrl from '@/components/ToastFromUrl';

export default function CatalogoPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
          Catálogo
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Link
            href="/dashboard/catalogo/nuevo?tipo=mano_de_obra"
            className="btn-secondary text-sm min-h-[44px] flex items-center justify-center"
          >
            + Nuevo servicio
          </Link>
          <Link
            href="/dashboard/catalogo/nuevo?tipo=material"
            className="btn-primary text-sm min-h-[44px] flex items-center justify-center"
          >
            + Nuevo material
          </Link>
        </div>
      </div>

      <CatalogoList />

      <Suspense fallback={null}>
        <ToastFromUrl />
      </Suspense>
    </div>
  );
}
