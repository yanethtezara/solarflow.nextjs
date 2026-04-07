'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import ConfirmDialog from '@/components/ConfirmDialog';

type Cliente = {
  id: string;
  nombre: string;
  direccion: string | null;
  telefono: string | null;
};

export default function ClientesList({ clientes }: { clientes: Cliente[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Cliente | null>(null);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from('clientes').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    if (error) {
      console.error(error);
      return;
    }
    router.push('/dashboard/clientes?toast=cliente_eliminado');
    router.refresh();
  };

  if (clientes.length === 0) {
    return (
      <div className="card p-12 text-center" data-testid="empty_state">
        <p className="text-slate-500 mb-4">Aún no tienes clientes registrados.</p>
        <Link
          href="/dashboard/clientes/nuevo"
          className="text-amber-600 hover:underline font-medium"
          data-testid="add_first_client_link"
        >
          Agregar tu primer cliente →
        </Link>
      </div>
    );
  }

  return (
    <div data-testid="clientesList">
      {/* Desktop table */}
      <div className="card table-desktop">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left table-header">Nombre</th>
              <th className="px-6 py-4 text-left table-header">Dirección</th>
              <th className="px-6 py-4 text-left table-header">Teléfono</th>
              <th className="px-6 py-4 text-right table-header">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200" data-testid="client_table_body">
            {clientes.map(c => (
              <tr
                key={c.id}
                className="hover:bg-gray-50 transition-colors duration-200"
                data-testid="client_row"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/clientes/${c.id}`}
                    className="font-medium text-slate-900 hover:text-amber-600 hover:underline"
                    data-testid="client_name_link"
                  >
                    {c.nombre}
                  </Link>
                </td>
                <td className="px-6 py-4 text-slate-600" data-testid="client_address">
                  {c.direccion || '—'}
                </td>
                <td className="px-6 py-4 text-slate-600" data-testid="client_phone">
                  {c.telefono || '—'}
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <Link
                    href={`/dashboard/clientes/${c.id}`}
                    className="text-amber-600 hover:underline text-sm font-medium"
                    data-testid="view_client_link"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/dashboard/clientes/${c.id}/editar`}
                    className="text-amber-600 hover:underline text-sm font-medium"
                    data-testid="edit_client_link"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(c)}
                    className="text-red-600 hover:underline text-sm font-medium"
                    data-testid="delete_client_button"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="cards-mobile space-y-3" data-testid="client_cards_mobile">
        {clientes.map(c => (
          <div key={c.id} className="card p-4" data-testid="client_card">
            <Link
              href={`/dashboard/clientes/${c.id}`}
              className="block font-medium text-slate-900 hover:text-amber-600 text-lg"
              data-testid="client_name_link_mobile"
            >
              {c.nombre}
            </Link>
            {c.direccion && (
              <p className="text-sm text-slate-600 mt-1" data-testid="client_address_mobile">
                {c.direccion}
              </p>
            )}
            {c.telefono && (
              <p className="text-sm text-slate-600" data-testid="client_phone_mobile">
                {c.telefono}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              <Link
                href={`/dashboard/clientes/${c.id}`}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium min-h-[44px] flex items-center"
                data-testid="view_client_link_mobile"
              >
                Ver
              </Link>
              <Link
                href={`/dashboard/clientes/${c.id}/editar`}
                className="px-4 py-2 rounded-lg border border-gray-200 text-slate-700 text-sm font-medium min-h-[44px] flex items-center"
                data-testid="edit_client_link_mobile"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => setDeleteTarget(c)}
                className="px-4 py-2 rounded-lg text-red-600 border border-red-200 text-sm font-medium min-h-[44px] flex items-center"
                data-testid="delete_client_button_mobile"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar cliente"
        message={`¿Estás seguro de que quieres eliminar a "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
