'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { CompanyForm } from '@/components/features/empresas/CompanyForm';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function EditarEmpresaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialData, setInitialData] = useState<{
    nombre: string;
    contacto_responsable: string;
    telefono_contacto: string;
    direccion: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data, error: err } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', id)
        .single();

      if (err) {
        setError(err.message);
        return;
      }
      if (data) {
        setInitialData({
          nombre: data.nombre,
          contacto_responsable: data.contacto_responsable || '',
          telefono_contacto: data.telefono_contacto || '',
          direccion: data.direccion || '',
        });
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (formData: {
    nombre: string;
    contacto_responsable?: string | null;
    telefono_contacto: string;
    direccion?: string | null;
  }) => {
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error: err } = await supabase
      .from('empresas')
      .update({
        nombre: formData.nombre.trim(),
        contacto_responsable: formData.contacto_responsable?.trim() || null,
        telefono_contacto: formData.telefono_contacto.trim(),
        direccion: formData.direccion?.trim() || null,
      })
      .eq('id', id);

    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push('/dashboard/empresas?toast=empresa_actualizada');
    router.refresh();
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteConfirm(false);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error: err } = await supabase.from('empresas').delete().eq('id', id);

    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push('/dashboard/empresas?toast=empresa_eliminada');
    router.refresh();
  };

  if (!initialData && !error) {
    return (
      <div className="p-8 text-center" data-testid="loading_state">
        Cargando empresa...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-xl mx-auto" data-testid="editarEmpresaPage">
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
        Editar empresa
      </h1>

      {initialData && (
        <CompanyForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onDelete={() => setShowDeleteConfirm(true)}
          loading={loading}
          error={error}
        />
      )}

      {error && !initialData && (
        <div className="card p-6 border-red-200 bg-red-50 text-red-700" data-testid="load_error">
          {error}
        </div>
      )}

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Eliminar empresa"
        message={`¿Estás seguro de que quieres eliminar "${initialData?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
