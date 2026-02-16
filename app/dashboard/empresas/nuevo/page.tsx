'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function NuevaEmpresaPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [contactoResponsable, setContactoResponsable] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Debes iniciar sesión');
      setLoading(false);
      return;
    }

    const { error: err } = await supabase.from('empresas').insert({
      user_id: user.id,
      nombre: nombre.trim(),
      contacto_responsable: contactoResponsable.trim() || null,
      telefono_contacto: telefono.trim() || null,
    });

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
      <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase mb-6">Nueva empresa</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
            placeholder="Ej: SolarEnergy SA"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contacto responsable</label>
          <input
            type="text"
            value={contactoResponsable}
            onChange={(e) => setContactoResponsable(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
            placeholder="Ej: María López"
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
          <Link href="/dashboard/empresas" className="btn-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
