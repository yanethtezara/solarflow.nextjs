'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function EditarEmpresaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [nombre, setNombre] = useState('');
  const [contactoResponsable, setContactoResponsable] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setNombre(data.nombre);
        setContactoResponsable(data.contacto_responsable || '');
        setTelefono(data.telefono_contacto || '');
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error: err } = await supabase
      .from('empresas')
      .update({
        nombre: nombre.trim(),
        contacto_responsable: contactoResponsable.trim() || null,
        telefono_contacto: telefono.trim() || null,
      })
      .eq('id', id);

    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push('/dashboard/empresas');
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta empresa?')) return;
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error: err } = await supabase.from('empresas').delete().eq('id', id);
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push('/dashboard/empresas');
    router.refresh();
  };

  return (
    <div className="p-8 max-w-xl">
      <div className="mb-6">
        <Link href="/dashboard/empresas" className="text-amber-600 hover:underline text-sm">
          ← Volver a empresas
        </Link>
      </div>
      <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase mb-6">Editar empresa</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contacto responsable</label>
          <input
            type="text"
            value={contactoResponsable}
            onChange={(e) => setContactoResponsable(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
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
            onClick={handleDelete}
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors duration-200 focus:ring-2 focus:ring-amber-500"
          >
            Eliminar
          </button>
          <Link href="/dashboard/empresas" className="btn-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
