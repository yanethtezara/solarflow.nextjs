import { Suspense } from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Database } from '@/types/supabase';
import TrabajosList from './TrabajosList';
import ToastFromUrl from '@/components/ToastFromUrl';

export default async function TrabajosPage() {
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

  const { data: trabajos, error } = await supabase
    .from('trabajos')
    .select(
      `
      id,
      fecha,
      hora,
      estado,
      ubicacion,
      clientes(id, nombre),
      empresas(id, nombre)
    `
    )
    .eq('user_id', user.id)
    .order('fecha', { ascending: true })
    .order('hora', { ascending: true });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
          Mis Trabajos
        </h1>
        <Link href="/dashboard/trabajos/nuevo" className="btn-primary">
          + Nuevo trabajo
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          <p className="font-medium">Error al cargar trabajos</p>
          <p className="text-sm mt-1">
            {error.message.includes('relation')
              ? '¿Ejecutaste el SQL en Supabase? Ver .context/supabase-initial-schema.sql'
              : error.message}
          </p>
        </div>
      ) : (
        <TrabajosList trabajos={(trabajos as any) || []} />
      )}
      <Suspense fallback={null}>
        <ToastFromUrl />
      </Suspense>
    </div>
  );
}
