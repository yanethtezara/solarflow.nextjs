import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

const ALLOWED_ESTADOS = ['agendado', 'en_progreso', 'completado', 'cancelado'] as const;

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
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
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 });
  }

  const body = await request.json();
  const estado = body.estado?.trim();

  if (!estado || !ALLOWED_ESTADOS.includes(estado as (typeof ALLOWED_ESTADOS)[number])) {
    return NextResponse.json(
      {
        error: {
          message: `El estado debe ser uno de: ${ALLOWED_ESTADOS.join(', ')}`,
        },
      },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('trabajos')
    .update({ estado })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { error: { message: 'No tienes acceso a este recurso.' } },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
