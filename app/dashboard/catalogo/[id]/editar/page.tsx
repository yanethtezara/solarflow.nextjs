'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import ConfirmDialog from '@/components/ConfirmDialog';

type Tipo = 'mano_de_obra' | 'material';

export default function EditarCatalogoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [tipo, setTipo] = useState<Tipo>('mano_de_obra');
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data, error: fetchError } = await supabase
        .from('catalogo_items')
        .select('*')
        .eq('id', id)
        .single();
      if (fetchError) {
        setError(fetchError.message);
        return;
      }
      if (data) {
        setTipo(data.tipo as Tipo);
        setNombre(data.nombre);
        setPrecio(String(data.precio));
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const precioNum = parseFloat(precio.replace(',', '.'));
    if (isNaN(precioNum) || precioNum < 0) {
      setError('El precio debe ser un número positivo.');
      return;
    }
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error: err } = await supabase
      .from('catalogo_items')
      .update({ nombre: nombre.trim(), tipo, precio: precioNum })
      .eq('id', id);

    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push('/dashboard/catalogo?toast=item_actualizado');
    router.refresh();
  };

  const handleDelete = async () => {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error: err } = await supabase.from('catalogo_items').delete().eq('id', id);
    setLoading(false);
    setDeleteConfirm(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push('/dashboard/catalogo?toast=item_eliminado');
    router.refresh();
  };

  const title = tipo === 'mano_de_obra' ? 'Editar servicio' : 'Editar material';
  const labelPrecio = tipo === 'mano_de_obra' ? 'Precio (€)' : 'Costo (€)';

  return (
    <div className="p-8 max-w-xl">
      <div className="mb-6">
        <Link href="/dashboard/catalogo" className="text-amber-600 hover:underline text-sm">
          ← Volver al catálogo
        </Link>
      </div>
      <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase mb-6">{title}</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            value={tipo}
            onChange={e => setTipo(e.target.value as Tipo)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
          >
            <option value="mano_de_obra">Mano de obra</option>
            <option value="material">Material</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{labelPrecio} *</label>
          <input
            type="text"
            inputMode="decimal"
            value={precio}
            onChange={e => setPrecio(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-4 pt-2">
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={() => setDeleteConfirm(true)}
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors duration-200 focus:ring-2 focus:ring-amber-500"
          >
            Eliminar
          </button>
          <Link href="/dashboard/catalogo" className="btn-secondary">
            Cancelar
          </Link>
        </div>
      </form>

      <ConfirmDialog
        open={deleteConfirm}
        title="Eliminar ítem del catálogo"
        message={`¿Estás seguro de que quieres eliminar "${nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
      />
    </div>
  );
}
