import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import CalendarView from './CalendarView';

export default async function CalendarioPage() {
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

  const { data: trabajos } = await supabase
    .from('trabajos')
    .select(
      `
      id,
      fecha,
      hora,
      estado,
      clientes(nombre)
    `
    )
    .eq('user_id', user.id);

  const formattedTrabajos = (trabajos || []).map(t => ({
    id: t.id,
    fecha: t.fecha,
    hora: t.hora,
    estado: t.estado,
    clienteNombre: (t.clientes as any)?.nombre || 'Sin nombre',
  }));

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase mb-6">
        Calendario de Trabajos
      </h1>
      <CalendarView initialTrabajos={formattedTrabajos} />
    </div>
  );
}
