import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

export async function GET(request: NextRequest) {
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

  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get('tipo'); // 'mano_de_obra' | 'material' | null (all)

  let query = supabase.from('catalogo_items').select('*').eq('user_id', user.id).order('nombre');

  if (tipo === 'mano_de_obra' || tipo === 'material') {
    query = query.eq('tipo', tipo);
  }

  const { data, error } = await query;

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

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 });
  }

  const body = await request.json();
  const nombre = body.nombre?.trim();
  const tipo = body.tipo;
  const precio = parseFloat(body.precio);

  if (!nombre) {
    return NextResponse.json({ error: { message: 'El nombre es obligatorio' } }, { status: 400 });
  }
  if (tipo !== 'mano_de_obra' && tipo !== 'material') {
    return NextResponse.json(
      { error: { message: 'El tipo debe ser mano_de_obra o material' } },
      { status: 400 }
    );
  }
  if (isNaN(precio) || precio < 0) {
    return NextResponse.json(
      { error: { message: 'El precio debe ser un número positivo' } },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('catalogo_items')
    .insert({
      user_id: user.id,
      nombre,
      tipo,
      precio,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
