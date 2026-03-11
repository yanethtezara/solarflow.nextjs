import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

export async function GET() {
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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('user_id', user.id)
    .order('nombre');

  if (error) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 });
  }

  const body = await request.json();
  const nombre = body.nombre?.trim();
  if (!nombre) {
    return NextResponse.json({ error: { message: 'El nombre es obligatorio' } }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('clientes')
    .insert({
      user_id: user.id,
      nombre,
      direccion: body.direccion?.trim() || null,
      telefono: body.telefono?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
