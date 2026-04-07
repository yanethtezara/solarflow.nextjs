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
      <div className="card p-12 text-center" data-testid="empty_state">
        <p className="text-slate-500 mb-4">Aún no tienes trabajos registrados.</p>
        <Link
          href="/dashboard/trabajos/nuevo"
          className="text-amber-600 hover:underline font-medium"
          data-testid="create_first_job_link"
        >
          Crear tu primer trabajo →
        </Link>
      </div>
    );
  }

  const estadoBadge = (estado: string) =>
    `inline-flex px-2 py-1 text-xs font-medium rounded-full ${
      estado === 'completado'
        ? 'bg-green-100 text-green-800'
        : estado === 'cancelado'
          ? 'bg-red-100 text-red-800'
          : estado === 'en_progreso'
            ? 'bg-amber-100 text-amber-800'
            : 'bg-slate-100 text-slate-800'
    }`;

  return (
    <div data-testid="trabajosList">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <label className="text-sm font-medium text-gray-700">Filtrar por estado:</label>
        <select
          value={estadoFilter}
          onChange={e => setEstadoFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 min-h-[44px]"
          data-testid="estado_filter_select"
        >
          {ESTADOS.map(e => (
            <option key={e.value || 'all'} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop table */}
      <div className="card table-desktop">
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
          <tbody className="divide-y divide-gray-200" data-testid="job_table_body">
            {filtered.map(t => (
              <tr
                key={t.id}
                className="hover:bg-gray-50 transition-colors duration-200"
                data-testid="job_row"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/trabajos/${t.id}`}
                    className="font-medium text-slate-900 hover:text-amber-600 hover:underline"
                    data-testid="job_client_link"
                  >
                    {clienteNombre(t)}
                  </Link>
                </td>
                <td className="px-6 py-4 text-slate-600" data-testid="job_date">
                  {formatFecha(t.fecha)}
                </td>
                <td className="px-6 py-4 text-slate-600" data-testid="job_time">
                  {formatHora(t.hora)}
                </td>
                <td className="px-6 py-4">
                  <span className={estadoBadge(t.estado)} data-testid="job_status_badge">
                    {ESTADO_LABELS[t.estado] ?? t.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <Link
                    href={`/dashboard/trabajos/${t.id}`}
                    className="text-amber-600 hover:underline text-sm font-medium"
                    data-testid="view_job_link"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/dashboard/trabajos/${t.id}/editar`}
                    className="text-amber-600 hover:underline text-sm font-medium"
                    data-testid="edit_job_link"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(t)}
                    className="text-red-600 hover:underline text-sm font-medium"
                    data-testid="delete_job_button"
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
      <div className="cards-mobile space-y-3" data-testid="job_cards_mobile">
        {filtered.map(t => (
          <div key={t.id} className="card p-4" data-testid="job_card">
            <Link
              href={`/dashboard/trabajos/${t.id}`}
              className="block font-medium text-slate-900 hover:text-amber-600 text-lg"
              data-testid="job_client_link_mobile"
            >
              {clienteNombre(t)}
            </Link>
            <p className="text-sm text-slate-600 mt-1" data-testid="job_datetime_mobile">
              {formatFecha(t.fecha)} · {formatHora(t.hora)}
            </p>
            <span
              className={`inline-block mt-2 ${estadoBadge(t.estado)}`}
              data-testid="job_status_badge_mobile"
            >
              {ESTADO_LABELS[t.estado] ?? t.estado}
            </span>
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              <Link
                href={`/dashboard/trabajos/${t.id}`}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium min-h-[44px] flex items-center"
                data-testid="view_job_link_mobile"
              >
                Ver
              </Link>
              <Link
                href={`/dashboard/trabajos/${t.id}/editar`}
                className="px-4 py-2 rounded-lg border border-gray-200 text-slate-700 text-sm font-medium min-h-[44px] flex items-center"
                data-testid="edit_job_link_mobile"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => setDeleteTarget(t)}
                className="px-4 py-2 rounded-lg text-red-600 border border-red-200 text-sm font-medium min-h-[44px] flex items-center"
                data-testid="delete_job_button_mobile"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
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
    </div>
  );
}
