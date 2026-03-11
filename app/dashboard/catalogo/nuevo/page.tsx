'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type Tipo = 'mano_de_obra' | 'material';

export default function NuevoCatalogoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipoParam = searchParams.get('tipo') as Tipo | null;
  const [tipo, setTipo] = useState<Tipo>(tipoParam || 'mano_de_obra');
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tipoParam === 'mano_de_obra' || tipoParam === 'material') {
      setTipo(tipoParam);
    }
  }, [tipoParam]);

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
      nombre: nombre.trim(),
      tipo,
      precio: precioNum,
    });

    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    const toast = tipo === 'mano_de_obra' ? 'servicio_creado' : 'material_creado';
    router.push(`/dashboard/catalogo?toast=${toast}`);
    router.refresh();
  };

  const title = tipo === 'mano_de_obra' ? 'Nuevo servicio' : 'Nuevo material';
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
            placeholder={
              tipo === 'mano_de_obra' ? 'Ej: Instalación Básica' : 'Ej: Panel Solar 400W'
            }
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
            placeholder="0.00"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-4 pt-2">
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <Link href="/dashboard/catalogo" className="btn-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
