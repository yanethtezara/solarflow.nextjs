'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import ConfirmDialog from '@/components/ConfirmDialog';

type Empresa = {
  id: string;
  nombre: string;
  contacto_responsable: string | null;
  telefono_contacto: string | null;
};

export default function EmpresasList({ empresas }: { empresas: Empresa[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Empresa | null>(null);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from('empresas').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    if (error) {
      console.error(error);
      return;
    }
    router.push('/dashboard/empresas?toast=empresa_eliminada');
    router.refresh();
  };

  if (empresas.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-slate-500 mb-4">Aún no tienes empresas registradas.</p>
        <Link
          href="/dashboard/empresas/nuevo"
          className="text-amber-600 hover:underline font-medium"
        >
          Agregar tu primera empresa →
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="card table-desktop">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left table-header">Nombre</th>
              <th className="px-6 py-4 text-left table-header">Contacto</th>
              <th className="px-6 py-4 text-left table-header">Teléfono</th>
              <th className="px-6 py-4 text-right table-header">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {empresas.map(e => (
              <tr key={e.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/empresas/${e.id}`}
                    className="font-medium text-slate-900 hover:text-amber-600 hover:underline"
                  >
                    {e.nombre}
                  </Link>
                </td>
                <td className="px-6 py-4 text-slate-600">{e.contacto_responsable || '—'}</td>
                <td className="px-6 py-4 text-slate-600">{e.telefono_contacto || '—'}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <Link
                    href={`/dashboard/empresas/${e.id}`}
                    className="text-amber-600 hover:underline text-sm font-medium"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/dashboard/empresas/${e.id}/editar`}
                    className="text-amber-600 hover:underline text-sm font-medium"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(e)}
                    className="text-red-600 hover:underline text-sm font-medium"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cards-mobile space-y-3">
        {empresas.map(e => (
          <div key={e.id} className="card p-4">
            <Link
              href={`/dashboard/empresas/${e.id}`}
              className="block font-medium text-slate-900 hover:text-amber-600 text-lg"
            >
              {e.nombre}
            </Link>
            {e.contacto_responsable && (
              <p className="text-sm text-slate-600 mt-1">{e.contacto_responsable}</p>
            )}
            {e.telefono_contacto && <p className="text-sm text-slate-600">{e.telefono_contacto}</p>}
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              <Link
                href={`/dashboard/empresas/${e.id}`}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium min-h-[44px] flex items-center"
              >
                Ver
              </Link>
              <Link
                href={`/dashboard/empresas/${e.id}/editar`}
                className="px-4 py-2 rounded-lg border border-gray-200 text-slate-700 text-sm font-medium min-h-[44px] flex items-center"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => setDeleteTarget(e)}
                className="px-4 py-2 rounded-lg text-red-600 border border-red-200 text-sm font-medium min-h-[44px] flex items-center"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar empresa"
        message={`¿Estás seguro de que quieres eliminar "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
