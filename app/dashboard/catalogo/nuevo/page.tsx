'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { CatalogoForm } from '@/components/features/catalogo/CatalogoForm';

export default function NuevoCatalogoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipoParam = searchParams.get('tipo') as 'mano_de_obra' | 'material' | null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: {
    nombre: string;
    tipo: 'mano_de_obra' | 'material';
    precio: number;
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

    const { error: err } = await supabase.from('catalogo_items').insert({
      user_id: user.id,
      nombre: formData.nombre.trim(),
      tipo: formData.tipo,
      precio: formData.precio,
    });

    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }

    const toast = formData.tipo === 'mano_de_obra' ? 'servicio_creado' : 'material_creado';
    router.push(`/dashboard/catalogo?toast=${toast}`);
    router.refresh();
  };

  const title = tipoParam === 'material' ? 'Nuevo material' : 'Nuevo servicio';

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-xl mx-auto" data-testid="nuevoCatalogoPage">
      <div className="mb-6">
        <Link
          href="/dashboard/catalogo"
          className="text-amber-600 hover:underline text-sm"
          data-testid="back_to_catalogo_link"
        >
          ← Volver al catálogo
        </Link>
      </div>
      <h1
        className="text-2xl font-black tracking-tight text-slate-900 uppercase mb-6"
        data-testid="page_title"
      >
        {title}
      </h1>

      <CatalogoForm
        initialData={{ tipo: tipoParam || 'mano_de_obra' }}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </div>
  );
}
