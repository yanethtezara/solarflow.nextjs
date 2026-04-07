'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { CompanyForm } from '@/components/features/empresas/CompanyForm';

export default function NuevaEmpresaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: {
    nombre: string;
    contacto_responsable?: string | null;
    telefono_contacto: string;
    direccion?: string | null;
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

    const { error: err } = await supabase.from('empresas').insert({
      user_id: user.id,
      nombre: formData.nombre.trim(),
      contacto_responsable: formData.contacto_responsable?.trim() || null,
      telefono_contacto: formData.telefono_contacto.trim(),
      direccion: formData.direccion?.trim() || null,
    });

    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }

    router.push('/dashboard/empresas?toast=empresa_creada');
    router.refresh();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-xl mx-auto" data-testid="nuevaEmpresaPage">
      <div className="mb-6">
        <Link
          href="/dashboard/empresas"
          className="text-amber-600 hover:underline text-sm"
          data-testid="back_to_empresas_link"
        >
          ← Volver a empresas
        </Link>
      </div>
      <h1
        className="text-2xl font-black tracking-tight text-slate-900 uppercase mb-6"
        data-testid="page_title"
      >
        Nueva empresa
      </h1>

      <CompanyForm onSubmit={handleSubmit} loading={loading} error={error} />
    </div>
  );
}
