'use client';

import { useState, useEffect, useCallback } from 'react';
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

const ITEMS_PER_PAGE = 15;

export default function CatalogoList() {
  const router = useRouter();
  const [items, setItems] = useState<CatalogoItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<FilterType>('todos');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<CatalogoItem | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const tipoParam = filter === 'todos' ? '' : `&tipo=${filter}`;
    try {
      const res = await fetch(
        `/api/catalogo-items?page=${currentPage}&limit=${ITEMS_PER_PAGE}${tipoParam}`
      );
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
        setTotalCount(data.totalCount);
      }
    } catch (err) {
      console.error('Error fetching catalog items:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from('catalogo_items').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    if (error) {
      console.error(error);
      return;
    }
    // Refresh current page
    fetchItems();
  };

  const tipoLabel = (t: string) => (t === 'mano_de_obra' ? 'Mano de obra' : 'Material');
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (!loading && items.length === 0 && currentPage === 1 && filter === 'todos') {
    return (
      <div className="card p-12 text-center" data-testid="empty_state">
        <p className="text-slate-500 mb-4">Aún no tienes ítems en el catálogo.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/dashboard/catalogo/nuevo?tipo=mano_de_obra"
            className="text-amber-600 hover:underline font-medium"
            data-testid="add_labor_link"
          >
            + Nuevo servicio
          </Link>
          <span className="text-slate-400">|</span>
          <Link
            href="/dashboard/catalogo/nuevo?tipo=material"
            className="text-amber-600 hover:underline font-medium"
            data-testid="add_material_link"
          >
            + Nuevo material
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="catalogoList" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" data-testid="filter_buttons">
          <button
            type="button"
            onClick={() => {
              setFilter('todos');
              setCurrentPage(1);
            }}
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
            onClick={() => {
              setFilter('mano_de_obra');
              setCurrentPage(1);
            }}
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
            onClick={() => {
              setFilter('material');
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
              filter === 'material'
                ? 'bg-amber-600 text-white'
                : 'bg-white border border-gray-200 text-slate-600 hover:bg-gray-50'
            }`}
          >
            Materiales
          </button>
        </div>

        <div className="text-sm text-slate-500 font-medium">
          Total: <span className="text-slate-900">{totalCount}</span> ítems
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      ) : (
        <>
          <div className="card table-desktop overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left table-header">Nombre</th>
                  <th className="px-6 py-4 text-left table-header">Tipo</th>
                  <th className="px-6 py-4 text-right table-header">Precio</th>
                  <th className="px-6 py-4 text-right table-header">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200" data-testid="catalogo_table_body">
                {items.map(item => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                    data-testid="catalogo_row"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/catalogo/${item.id}`}
                        className="font-medium text-slate-900 hover:text-amber-600 hover:underline"
                        data-testid="item_name_link"
                      >
                        {item.nombre}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-600" data-testid="item_type">
                      {tipoLabel(item.tipo)}
                    </td>
                    <td
                      className="px-6 py-4 text-right font-medium text-slate-900"
                      data-testid="item_price"
                    >
                      ${Number(item.precio).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
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
            {items.map(item => (
              <div key={item.id} className="card p-4">
                <Link
                  href={`/dashboard/catalogo/${item.id}`}
                  className="block font-medium text-slate-900 hover:text-amber-600 text-lg"
                >
                  {item.nombre}
                </Link>
                <p className="text-sm text-slate-600 mt-1">{tipoLabel(item.tipo)}</p>
                <p className="font-medium text-slate-900 mt-1">${Number(item.precio).toFixed(2)}</p>
                <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
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
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando{' '}
                    <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> a{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}
                    </span>{' '}
                    de <span className="font-medium">{totalCount}</span> resultados
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Anterior</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-gray-300 flex items-center">
                      Página {currentPage} de {totalPages}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Siguiente</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar ítem del catálogo"
        message={`¿Estás seguro de que quieres eliminar "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
