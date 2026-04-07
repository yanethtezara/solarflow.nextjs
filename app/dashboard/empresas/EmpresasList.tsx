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
      <div className="card p-12 text-center" data-testid="empty_state">
        <p className="text-slate-500 mb-4">Aún no tienes empresas registradas.</p>
        <Link
          href="/dashboard/empresas/nuevo"
          className="text-amber-600 hover:underline font-medium"
          data-testid="add_first_company_link"
        >
          Agregar tu primera empresa →
        </Link>
      </div>
    );
  }

  return (
    <div data-testid="empresasList">
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
          <tbody className="divide-y divide-gray-200" data-testid="company_table_body">
            {empresas.map(e => (
              <tr
                key={e.id}
                className="hover:bg-gray-50 transition-colors duration-200"
                data-testid="company_row"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/empresas/${e.id}`}
                    className="font-medium text-slate-900 hover:text-amber-600 hover:underline"
                    data-testid="company_name_link"
                  >
                    {e.nombre}
                  </Link>
                </td>
                <td className="px-6 py-4 text-slate-600" data-testid="company_contact">
                  {e.contacto_responsable || '—'}
                </td>
                <td className="px-6 py-4 text-slate-600" data-testid="company_phone">
                  {e.telefono_contacto || '—'}
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <Link
                    href={`/dashboard/empresas/${e.id}`}
                    className="text-amber-600 hover:underline text-sm font-medium"
                    data-testid="view_company_link"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/dashboard/empresas/${e.id}/editar`}
                    className="text-amber-600 hover:underline text-sm font-medium"
                    data-testid="edit_company_link"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(e)}
                    className="text-red-600 hover:underline text-sm font-medium"
                    data-testid="delete_company_button"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cards-mobile space-y-3" data-testid="company_cards_mobile">
        {empresas.map(e => (
          <div key={e.id} className="card p-4" data-testid="company_card">
            <Link
              href={`/dashboard/empresas/${e.id}`}
              className="block font-medium text-slate-900 hover:text-amber-600 text-lg"
              data-testid="company_name_link_mobile"
            >
              {e.nombre}
            </Link>
            {e.contacto_responsable && (
              <p className="text-sm text-slate-600 mt-1" data-testid="company_contact_mobile">
                {e.contacto_responsable}
              </p>
            )}
            {e.telefono_contacto && (
              <p className="text-sm text-slate-600" data-testid="company_phone_mobile">
                {e.telefono_contacto}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              <Link
                href={`/dashboard/empresas/${e.id}`}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium min-h-[44px] flex items-center"
                data-testid="view_company_link_mobile"
              >
                Ver
              </Link>
              <Link
                href={`/dashboard/empresas/${e.id}/editar`}
                className="px-4 py-2 rounded-lg border border-gray-200 text-slate-700 text-sm font-medium min-h-[44px] flex items-center"
                data-testid="edit_company_link_mobile"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => setDeleteTarget(e)}
                className="px-4 py-2 rounded-lg text-red-600 border border-red-200 text-sm font-medium min-h-[44px] flex items-center"
                data-testid="delete_company_button_mobile"
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
    </div>
  );
}
