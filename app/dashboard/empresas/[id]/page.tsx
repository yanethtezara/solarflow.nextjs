import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Database } from '@/types/supabase';

export default async function EmpresaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  const { data: empresa, error } = await supabase
    .from('empresas')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !empresa) notFound();

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/empresas" className="text-amber-600 hover:underline text-sm">
          ← Volver a empresas
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
          {empresa.nombre}
        </h1>
        <Link
          href={`/dashboard/empresas/${id}/editar`}
          className="btn-primary text-sm min-h-[44px] flex items-center justify-center"
        >
          Editar
        </Link>
      </div>
      <div className="card p-6 space-y-4">
        <div>
          <p className="text-xs font-bold uppercase text-slate-500 tracking-tight mb-1">
            Contacto responsable
          </p>
          <p className="text-slate-900">{empresa.contacto_responsable || '—'}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-slate-500 tracking-tight mb-1">Teléfono</p>
          <p className="text-slate-900">{empresa.telefono_contacto || '—'}</p>
        </div>
      </div>
    </div>
  );
}
