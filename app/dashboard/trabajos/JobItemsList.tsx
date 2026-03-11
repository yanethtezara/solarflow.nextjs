'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/ConfirmDialog';

type ItemRow = {
  item_id: string;
  cantidad: number;
  catalogo_items: {
    id: string;
    nombre: string;
    tipo: string;
    precio: number;
  } | null;
};

type JobItemsListProps = {
  trabajoId: string;
  items: ItemRow[];
};

export default function JobItemsList({ trabajoId, items }: JobItemsListProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<ItemRow | null>(null);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget?.catalogo_items?.id) return;
    const res = await fetch(`/api/trabajos/${trabajoId}/items/${deleteTarget.item_id}`, {
      method: 'DELETE',
    });
    setDeleteTarget(null);
    if (res.ok) {
      router.refresh();
    }
  };

  let total = 0;
  const rows = items.map(row => {
    const item = row.catalogo_items;
    const precio = item ? Number(item.precio) : 0;
    const subtotal = row.cantidad * precio;
    total += subtotal;
    return { ...row, item, subtotal };
  });

  const formatPrecio = (n: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);

  return (
    <>
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left table-header">Ítem</th>
              <th className="px-6 py-4 text-left table-header">Tipo</th>
              <th className="px-6 py-4 text-right table-header">Cantidad</th>
              <th className="px-6 py-4 text-right table-header">Precio unit.</th>
              <th className="px-6 py-4 text-right table-header">Subtotal</th>
              <th className="px-6 py-4 text-right table-header">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map(r => (
              <tr key={r.item_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-slate-900">{r.item?.nombre ?? '—'}</td>
                <td className="px-6 py-4 text-slate-600">
                  {r.item?.tipo === 'mano_de_obra' ? 'Mano de obra' : 'Material'}
                </td>
                <td className="px-6 py-4 text-right text-slate-600">{r.cantidad}</td>
                <td className="px-6 py-4 text-right text-slate-600">
                  {formatPrecio(r.item ? Number(r.item.precio) : 0)}
                </td>
                <td className="px-6 py-4 text-right font-medium">{formatPrecio(r.subtotal)}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(r)}
                    className="text-red-600 hover:underline text-sm font-medium"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <p className="text-lg font-bold text-slate-900">Total: {formatPrecio(total)}</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar ítem"
        message={`¿Eliminar "${deleteTarget?.catalogo_items?.nombre}" del trabajo?`}
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
