'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { ClientForm } from '@/components/features/clientes/ClientForm';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function EditarClientePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialData, setInitialData] = useState<{
    nombre: string;
    direccion: string;
    telefono: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data, error: err } = await supabase
        .from('clientes')
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
          direccion: data.direccion || '',
          telefono: data.telefono || '',
        });
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (formData: {
    nombre: string;
    direccion?: string | null;
    telefono: string;
  }) => {
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error: err } = await supabase
      .from('clientes')
      .update({
        nombre: formData.nombre.trim(),
        direccion: formData.direccion?.trim() || null,
        telefono: formData.telefono.trim() || null,
      })
      .eq('id', id);

    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push('/dashboard/clientes?toast=cliente_actualizado');
    router.refresh();
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteConfirm(false);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error: err } = await supabase.from('clientes').delete().eq('id', id);

    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push('/dashboard/clientes?toast=cliente_eliminado');
    router.refresh();
  };

  if (!initialData && !error) {
    return (
      <div className="p-8 text-center" data-testid="loading_state">
        Cargando cliente...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-xl mx-auto" data-testid="editarClientePage">
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
        Editar cliente
      </h1>

      {initialData && (
        <ClientForm
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
        title="Eliminar cliente"
        message={`¿Estás seguro de que quieres eliminar a "${initialData?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
