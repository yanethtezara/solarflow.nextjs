'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import ConfirmDialog from '@/components/ConfirmDialog';

type CatalogoItem = {
  id: string;
  nombre: string;
  tipo: string;
  precio: number;
};

type FilterType = 'todos' | 'mano_de_obra' | 'material';

export default function CatalogoList({ items }: { items: CatalogoItem[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('todos');
  const [deleteTarget, setDeleteTarget] = useState<CatalogoItem | null>(null);

  const filtered = filter === 'todos' ? items : items.filter(i => i.tipo === filter);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from('catalogo_items').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    if (error) {
      console.error(error);
      return;
    }
    router.push('/dashboard/catalogo?toast=item_eliminado');
    router.refresh();
  };

  const tipoLabel = (t: string) => (t === 'mano_de_obra' ? 'Mano de obra' : 'Material');

  if (items.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-slate-500 mb-4">Aún no tienes ítems en el catálogo.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/dashboard/catalogo/nuevo?tipo=mano_de_obra"
            className="text-amber-600 hover:underline font-medium"
          >
            + Nuevo servicio
          </Link>
          <span className="text-slate-400">|</span>
          <Link
            href="/dashboard/catalogo/nuevo?tipo=material"
            className="text-amber-600 hover:underline font-medium"
          >
            + Nuevo material
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setFilter('todos')}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
            filter === 'todos'
              ? 'bg-amber-600 text-white'
              : 'bg-white border border-gray-200 text-slate-600 hover:bg-gray-50'
          }`}
        >
          Todos
        </button>
        <button
          type="button"
          onClick={() => setFilter('mano_de_obra')}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
            filter === 'mano_de_obra'
              ? 'bg-amber-600 text-white'
              : 'bg-white border border-gray-200 text-slate-600 hover:bg-gray-50'
          }`}
        >
          Mano de obra
        </button>
        <button
          type="button"
          onClick={() => setFilter('material')}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
            filter === 'material'
              ? 'bg-amber-600 text-white'
              : 'bg-white border border-gray-200 text-slate-600 hover:bg-gray-50'
          }`}
        >
          Materiales
        </button>
      </div>

      <div className="card table-desktop">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left table-header">Nombre</th>
              <th className="px-6 py-4 text-left table-header">Tipo</th>
              <th className="px-6 py-4 text-right table-header">Precio</th>
              <th className="px-6 py-4 text-right table-header">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/catalogo/${item.id}`}
                    className="font-medium text-slate-900 hover:text-amber-600 hover:underline"
                  >
                    {item.nombre}
                  </Link>
                </td>
                <td className="px-6 py-4 text-slate-600">{tipoLabel(item.tipo)}</td>
                <td className="px-6 py-4 text-right font-medium text-slate-900">
                  €{Number(item.precio).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <Link
                    href={`/dashboard/catalogo/${item.id}`}
                    className="text-amber-600 hover:underline text-sm font-medium"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/dashboard/catalogo/${item.id}/editar`}
                    className="text-amber-600 hover:underline text-sm font-medium"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
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
        {filtered.map(item => (
          <div key={item.id} className="card p-4">
            <Link
              href={`/dashboard/catalogo/${item.id}`}
              className="block font-medium text-slate-900 hover:text-amber-600 text-lg"
            >
              {item.nombre}
            </Link>
            <p className="text-sm text-slate-600 mt-1">{tipoLabel(item.tipo)}</p>
            <p className="font-medium text-slate-900 mt-1">€{Number(item.precio).toFixed(2)}</p>
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              <Link
                href={`/dashboard/catalogo/${item.id}`}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium min-h-[44px] flex items-center"
              >
                Ver
              </Link>
              <Link
                href={`/dashboard/catalogo/${item.id}/editar`}
                className="px-4 py-2 rounded-lg border border-gray-200 text-slate-700 text-sm font-medium min-h-[44px] flex items-center"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => setDeleteTarget(item)}
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
        title="Eliminar ítem del catálogo"
        message={`¿Estás seguro de que quieres eliminar "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
