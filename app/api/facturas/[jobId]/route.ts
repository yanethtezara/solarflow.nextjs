import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

export async function GET(request: NextRequest, { params }: { params: { jobId: string } }) {
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
  if (!user) {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 });
  }

  const { jobId } = params;

  // Obtener trabajo con relaciones
  const { data: trabajo, error: jobError } = await supabase
    .from('trabajos')
    .select(
      `
      *,
      clientes(*),
      empresas(*)
    `
    )
    .eq('id', jobId)
    .eq('user_id', user.id)
    .single();

  if (jobError || !trabajo) {
    return NextResponse.json({ error: { message: 'Trabajo no encontrado' } }, { status: 404 });
  }

  // Obtener ítems del trabajo con datos del catálogo
  const { data: items, error: itemsError } = await supabase
    .from('trabajos_items')
    .select(
      `
      cantidad,
      catalogo_items(nombre, tipo, precio)
    `
    )
    .eq('trabajo_id', jobId);

  if (itemsError) {
    return NextResponse.json({ error: { message: itemsError.message } }, { status: 500 });
  }

  // Obtener perfil del usuario (emisor)
  const { data: perfil } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return NextResponse.json({
    trabajo,
    items: items || [],
    perfil: perfil || { email: user.email },
    metadata: {
      generated_at: new Date().toISOString(),
      invoice_number: `INV-${trabajo.id.slice(0, 8).toUpperCase()}`,
    },
  });
}
