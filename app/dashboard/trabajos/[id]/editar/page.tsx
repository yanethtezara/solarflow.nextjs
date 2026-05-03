'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import JobCreationForm from '../../JobCreationForm';

export default function EditarTrabajoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [initialData, setInitialData] = useState<{
    cliente_id: string;
    empresa_id: string | null;
    fecha: string;
    hora: string;
    ubicacion: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/trabajos/${id}`);
      if (!res.ok) {
        setError('No tienes acceso a este recurso.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setInitialData({
        cliente_id: data.cliente_id,
        empresa_id: data.empresa_id,
        fecha: data.fecha,
        hora: (data.hora || '09:00').slice(0, 5),
        ubicacion: data.ubicacion,
      });
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-xl mx-auto">
        <p className="text-slate-600">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-600">{error}</p>
        <Link
          href="/dashboard/trabajos"
          className="text-amber-600 hover:underline mt-4 inline-block"
        >
          Volver a instalaciones
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-xl mx-auto">
      <div className="mb-6">
        <Link href={`/dashboard/trabajos/${id}`} className="text-amber-600 hover:underline text-sm">
          ← Volver a la instalación
        </Link>
      </div>
      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase mb-6">
        Editar instalación
      </h1>
      {initialData && <JobCreationForm initialData={initialData} trabajoId={id} />}
    </div>
  );
}
