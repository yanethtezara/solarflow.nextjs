import { Suspense } from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Database } from '@/types/supabase';
import EmpresasList from './EmpresasList';
import ToastFromUrl from '@/components/ToastFromUrl';

export default async function EmpresasPage() {
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

  const { data: empresas, error } = await supabase
    .from('empresas')
    .select('*')
    .eq('user_id', user.id)
    .order('nombre');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Empresas</h1>
        <Link href="/dashboard/empresas/nuevo" className="btn-primary">
          + Nueva empresa
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          <p className="font-medium">Error al cargar empresas</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      ) : (
        <EmpresasList empresas={empresas || []} />
      )}
      <Suspense fallback={null}>
        <ToastFromUrl />
      </Suspense>
    </div>
  );
}
