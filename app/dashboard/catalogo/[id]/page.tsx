import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Database } from '@/types/supabase';

export default async function CatalogoItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  const { data: item, error } = await supabase
    .from('catalogo_items')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !item) notFound();

  const tipoLabel = item.tipo === 'mano_de_obra' ? 'Mano de obra' : 'Material';

  return (
    <div className="p-8 max-w-xl">
      <div className="mb-6">
        <Link href="/dashboard/catalogo" className="text-amber-600 hover:underline text-sm">
          ← Volver al catálogo
        </Link>
      </div>
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
          {item.nombre}
        </h1>
        <Link href={`/dashboard/catalogo/${id}/editar`} className="btn-primary text-sm">
          Editar
        </Link>
      </div>
      <div className="card p-6 space-y-4">
        <div>
          <p className="text-xs font-bold uppercase text-slate-500 tracking-tight mb-1">Tipo</p>
          <p className="text-slate-900">{tipoLabel}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-slate-500 tracking-tight mb-1">Precio</p>
          <p className="text-slate-900 font-medium">€{Number(item.precio).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
