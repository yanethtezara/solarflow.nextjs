'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/ConfirmDialog';

const ESTADOS = [
  { value: '', label: 'Todos' },
  { value: 'agendado', label: 'Agendado' },
  { value: 'en_progreso', label: 'En Progreso' },
  { value: 'completado', label: 'Completado' },
  { value: 'cancelado', label: 'Cancelado' },
] as const;

const ESTADO_LABELS: Record<string, string> = {
  agendado: 'Agendado',
  en_progreso: 'En Progreso',
  completado: 'Completado',
  cancelado: 'Cancelado',
};

type Trabajo = {
  id: string;
  fecha: string;
  hora: string;
  estado: string;
  ubicacion?: string | null;
  clientes: { id: string; nombre: string } | null;
  empresas: { id: string; nombre: string } | null;
};

type TrabajosListProps = {
  trabajos: Trabajo[];
};

export default function TrabajosList({ trabajos }: TrabajosListProps) {
  const router = useRouter();
  const [estadoFilter, setEstadoFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Trabajo | null>(null);

  const filtered = estadoFilter ? trabajos.filter(t => t.estado === estadoFilter) : trabajos;

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/trabajos/${deleteTarget.id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    if (res.ok) {
      router.push('/dashboard/trabajos?toast=trabajo_eliminado');
      router.refresh();
    }
  };

  const clienteNombre = (t: Trabajo) =>
    (t.clientes && !Array.isArray(t.clientes) ? t.clientes.nombre : null) ||
    (Array.isArray(t.clientes) ? t.clientes[0]?.nombre : null) ||
    '—';

  const formatFecha = (f: string) =>
    new Date(f + 'T00:00:00').toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  const formatHora = (h: string) => {
    const parts = h.split(':');
    return `${parts[0]}:${parts[1]}`;
  };

  if (trabajos.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-slate-500 mb-4">Aún no tienes trabajos registrados.</p>
        <Link
          href="/dashboard/trabajos/nuevo"
          className="text-amber-600 hover:underline font-medium"
        >
          Crear tu primer trabajo →
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Filtrar por estado:</label>
        <select
          value={estadoFilter}
          onChange={e => setEstadoFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        >
          {ESTADOS.map(e => (
            <option key={e.value || 'all'} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </div>
      <div className="card">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left table-header">Cliente</th>
              <th className="px-6 py-4 text-left table-header">Fecha</th>
              <th className="px-6 py-4 text-left table-header">Hora</th>
              <th className="px-6 py-4 text-left table-header">Estado</th>
              <th className="px-6 py-4 text-right table-header">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map(t => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/trabajos/${t.id}`}
                    className="font-medium text-slate-900 hover:text-amber-600 hover:underline"
                  >
                    {clienteNombre(t)}
                  </Link>
                </td>
                <td className="px-6 py-4 text-slate-600">{formatFecha(t.fecha)}</td>
                <td className="px-6 py-4 text-slate-600">{formatHora(t.hora)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      t.estado === 'completado'
                        ? 'bg-green-100 text-green-800'
                        : t.estado === 'cancelado'
                          ? 'bg-red-100 text-red-800'
                          : t.estado === 'en_progreso'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {ESTADO_LABELS[t.estado] ?? t.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <Link
                    href={`/dashboard/trabajos/${t.id}`}
                    className="text-amber-600 hover:underline text-sm font-medium"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/dashboard/trabajos/${t.id}/editar`}
                    className="text-amber-600 hover:underline text-sm font-medium"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(t)}
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

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar trabajo"
        message={`¿Estás seguro de que quieres eliminar el trabajo de "${deleteTarget ? clienteNombre(deleteTarget) : ''}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
