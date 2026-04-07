'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ESTADOS = [
  { value: 'agendado', label: 'Agendado' },
  { value: 'en_progreso', label: 'En Progreso' },
  { value: 'completado', label: 'Completado' },
  { value: 'cancelado', label: 'Cancelado' },
] as const;

type JobStatusSelectorProps = {
  trabajoId: string;
  currentEstado: string;
};

export default function JobStatusSelector({ trabajoId, currentEstado }: JobStatusSelectorProps) {
  const router = useRouter();
  const [estado, setEstado] = useState(currentEstado);
  const [loading, setLoading] = useState(false);

  const handleChange = async (newEstado: string) => {
    if (newEstado === estado) return;
    setLoading(true);
    const res = await fetch(`/api/trabajos/${trabajoId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: newEstado }),
    });
    setLoading(false);
    if (res.ok) {
      setEstado(newEstado);
      router.refresh();
    }
  };

  return (
    <select
      value={estado}
      onChange={e => handleChange(e.target.value)}
      disabled={loading}
      className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-medium disabled:opacity-50"
      data-testid="job_status_selector"
    >
      {ESTADOS.map(e => (
        <option key={e.value} value={e.value} data-testid={`status_option_${e.value}`}>
          {e.label}
        </option>
      ))}
    </select>
  );
}
