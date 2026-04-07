'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { ClientForm } from '@/components/features/clientes/ClientForm';

export default function NuevoClientePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: {
    nombre: string;
    direccion?: string | null;
    telefono: string;
  }) => {
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('Debes iniciar sesión');
      setLoading(false);
      return;
    }

    const { error: err } = await supabase.from('clientes').insert({
      user_id: user.id,
      nombre: formData.nombre.trim(),
      direccion: formData.direccion?.trim() || null,
      telefono: formData.telefono.trim() || null,
    });

    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }

    router.push('/dashboard/clientes?toast=cliente_creado');
    router.refresh();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-xl mx-auto" data-testid="nuevoClientePage">
      <div className="mb-6">
        <Link
          href="/dashboard/clientes"
          className="text-amber-600 hover:underline text-sm"
          data-testid="back_to_clientes_link"
        >
          ← Volver a clientes
        </Link>
      </div>
      <h1
        className="text-2xl font-black tracking-tight text-slate-900 uppercase mb-6"
        data-testid="page_title"
      >
        Nuevo cliente
      </h1>

      <ClientForm onSubmit={handleSubmit} loading={loading} error={error} />
    </div>
  );
}
