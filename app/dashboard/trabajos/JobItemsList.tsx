'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/ConfirmDialog';

type JobItem = {
  trabajo_id?: string;
  item_id: string;
  cantidad: number;
  catalogo_items: {
    nombre: string;
    tipo: string;
    precio: number;
  } | null;
};

type JobItemsListProps = {
  trabajoId: string;
  items: JobItem[];
};

export default function JobItemsList({ trabajoId, items }: JobItemsListProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<JobItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const total = items.reduce((acc, i) => acc + i.cantidad * (i.catalogo_items?.precio || 0), 0);
  const totalItemsCount = items.length;

  // Pagination logic
  const totalPages = Math.ceil(totalItemsCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/trabajos/${trabajoId}/items/${deleteTarget.item_id}`, {
      method: 'DELETE',
    });
    setDeleteTarget(null);
    if (res.ok) {
      router.refresh();
    }
  };

  if (items.length === 0) {
    return (
      <div
        className="card p-8 text-center bg-gray-50 border-dashed"
        data-testid="empty_items_state"
      >
        <p className="text-slate-500 text-sm">No se han agregado materiales o servicios aún.</p>
      </div>
    );
  }

  return (
    <div data-testid="jobItemsList" className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <p className="text-sm text-slate-600 font-medium">
          Total: <span className="text-amber-600 font-bold">{totalItemsCount}</span>{' '}
          {totalItemsCount === 1 ? 'ítem' : 'ítems'} agregados
        </p>
        {totalPages > 1 && (
          <p className="text-xs text-slate-500">
            Página {currentPage} de {totalPages}
          </p>
        )}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Ítem</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-700">Cant.</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Precio</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Subtotal</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-700">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100" data-testid="items_table_body">
            {paginatedItems.map(i => (
              <tr
                key={i.item_id}
                className="hover:bg-gray-50 transition-colors"
                data-testid="item_row"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900" data-testid="item_name">
                    {i.catalogo_items?.nombre || 'Ítem no encontrado'}
                  </p>
                  <p
                    className="text-xs text-slate-500 uppercase tracking-wider"
                    data-testid="item_type"
                  >
                    {i.catalogo_items?.tipo === 'mano_de_obra' ? 'Servicio' : 'Material'}
                  </p>
                </td>
                <td className="px-4 py-3 text-center text-slate-600" data-testid="item_quantity">
                  {i.cantidad}
                </td>
                <td className="px-4 py-3 text-right text-slate-600" data-testid="item_price">
                  ${Number(i.catalogo_items?.precio || 0).toFixed(2)}
                </td>
                <td
                  className="px-4 py-3 text-right font-medium text-slate-900"
                  data-testid="item_subtotal"
                >
                  ${(i.cantidad * (i.catalogo_items?.precio || 0)).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => setDeleteTarget(i)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors inline-flex items-center justify-center"
                    title="Eliminar ítem"
                    data-testid="delete_item_button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-amber-50/50">
            <tr>
              <td
                colSpan={3}
                className="px-4 py-4 text-right font-bold text-slate-700 uppercase tracking-wider"
              >
                Total Estimado
              </td>
              <td
                className="px-4 py-4 text-right font-black text-lg text-amber-700"
                data-testid="job_total"
              >
                ${total.toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-bold rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            ← Anterior
          </button>
          <span className="text-sm font-bold text-slate-700">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-bold rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Siguiente →
          </button>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Quitar ítem"
        message={`¿Deseas quitar "${deleteTarget?.catalogo_items?.nombre || 'este ítem'}" de este trabajo?`}
        confirmLabel="Quitar"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
