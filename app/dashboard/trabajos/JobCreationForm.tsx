'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Cliente = { id: string; nombre: string };
type Empresa = { id: string; nombre: string };

type JobCreationFormProps = {
  initialData?: {
    cliente_id: string;
    empresa_id: string | null;
    fecha: string;
    hora: string;
    ubicacion: string | null;
  };
  trabajoId?: string;
};

export default function JobCreationForm({ initialData, trabajoId }: JobCreationFormProps) {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [clienteId, setClienteId] = useState(initialData?.cliente_id || '');
  const [empresaId, setEmpresaId] = useState(initialData?.empresa_id || '');
  const [fecha, setFecha] = useState(initialData?.fecha || '');
  const [hora, setHora] = useState(initialData?.hora || '09:00');
  const [ubicacion, setUbicacion] = useState(initialData?.ubicacion || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!trabajoId;

  useEffect(() => {
    const load = async () => {
      const [clientsRes, empsRes] = await Promise.all([
        fetch('/api/clientes'),
        fetch('/api/empresas'),
      ]);
      if (clientsRes.ok) {
        const c = await clientsRes.json();
        setClientes(c);
      }
      if (empsRes.ok) {
        const e = await empsRes.json();
        setEmpresas(e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (initialData) {
      setClienteId(initialData.cliente_id);
      setEmpresaId(initialData.empresa_id || '');
      setFecha(initialData.fecha);
      setHora(initialData.hora.slice(0, 5));
      setUbicacion(initialData.ubicacion || '');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const url = isEdit ? `/api/trabajos/${trabajoId}` : '/api/trabajos';
    const method = isEdit ? 'PUT' : 'POST';
    const body = {
      cliente_id: clienteId,
      empresa_id: empresaId || null,
      fecha,
      hora: hora.length === 5 ? hora : `${hora}:00`,
      ubicacion: ubicacion.trim() || null,
    };

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    setLoading(false);
    if (!res.ok) {
      setError(data?.error?.message || 'Error al guardar');
      return;
    }

    if (isEdit) {
      router.push(`/dashboard/trabajos/${trabajoId}?toast=trabajo_actualizado`);
    } else {
      router.push('/dashboard/trabajos?toast=trabajo_creado');
    }
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 sm:p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
        <select
          value={clienteId}
          onChange={e => setClienteId(e.target.value)}
          required
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 min-h-[44px]"
        >
          <option value="">Seleccionar cliente</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Empresa (opcional)</label>
        <select
          value={empresaId}
          onChange={e => setEmpresaId(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 min-h-[44px]"
        >
          <option value="">Sin empresa</option>
          {empresas.map(e => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
          <input
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 min-h-[44px]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hora *</label>
          <input
            type="time"
            value={hora}
            onChange={e => setHora(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 min-h-[44px]"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
        <input
          type="text"
          value={ubicacion}
          onChange={e => setUbicacion(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 min-h-[44px]"
          placeholder="Ej: Calle Solar 123"
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-50 min-h-[44px]"
        >
          {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Guardar trabajo'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary min-h-[44px]">
          Cancelar
        </button>
      </div>
    </form>
  );
}
