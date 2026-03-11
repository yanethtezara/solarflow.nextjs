import { Suspense } from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Database } from '@/types/supabase';
import CatalogoList from './CatalogoList';
import ToastFromUrl from '@/components/ToastFromUrl';

export default async function CatalogoPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: items, error } = await supabase
    .from('catalogo_items')
    .select('*')
    .eq('user_id', user.id)
    .order('nombre');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Catálogo</h1>
        <div className="flex gap-3">
          <Link
            href="/dashboard/catalogo/nuevo?tipo=mano_de_obra"
            className="btn-secondary text-sm"
          >
            + Nuevo servicio
          </Link>
          <Link href="/dashboard/catalogo/nuevo?tipo=material" className="btn-primary text-sm">
            + Nuevo material
          </Link>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          <p className="font-medium">Error al cargar el catálogo</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      ) : (
        <CatalogoList items={items || []} />
      )}

      <Suspense fallback={null}>
        <ToastFromUrl />
      </Suspense>
    </div>
  );
}
