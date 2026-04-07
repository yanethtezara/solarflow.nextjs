'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { CatalogoForm } from '@/components/features/catalogo/CatalogoForm';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function EditarCatalogoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialData, setInitialData] = useState<{
    nombre: string;
    tipo: 'mano_de_obra' | 'material';
    precio: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data, error: err } = await supabase
        .from('catalogo_items')
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
          tipo: data.tipo as 'mano_de_obra' | 'material',
          precio: Number(data.precio),
        });
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (formData: {
    nombre: string;
    tipo: 'mano_de_obra' | 'material';
    precio: number;
  }) => {
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error: err } = await supabase
      .from('catalogo_items')
      .update({
        nombre: formData.nombre.trim(),
        tipo: formData.tipo,
        precio: formData.precio,
      })
      .eq('id', id);

    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push('/dashboard/catalogo?toast=item_actualizado');
    router.refresh();
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteConfirm(false);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error: err } = await supabase.from('catalogo_items').delete().eq('id', id);

    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push('/dashboard/catalogo?toast=item_eliminado');
    router.refresh();
  };

  if (!initialData && !error) {
    return (
      <div className="p-8 text-center" data-testid="loading_state">
        Cargando ítem...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-xl mx-auto" data-testid="editarCatalogoPage">
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
        Editar ítem
      </h1>

      {initialData && (
        <CatalogoForm
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
        title="Eliminar ítem del catálogo"
        message={`¿Estás seguro de que quieres eliminar "${initialData?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
