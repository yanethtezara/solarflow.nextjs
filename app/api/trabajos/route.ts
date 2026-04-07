import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

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

export async function GET(request: NextRequest) {
  const supabase = await getSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const estado = searchParams.get('estado'); // agendado | en_progreso | completado | cancelado | null (all)
  const startDate = searchParams.get('startDate'); // YYYY-MM-DD
  const endDate = searchParams.get('endDate'); // YYYY-MM-DD

  let query = supabase
    .from('trabajos')
    .select(
      `
      *,
      clientes(id, nombre),
      empresas(id, nombre)
    `
    )
    .eq('user_id', user.id)
    .order('fecha', { ascending: true })
    .order('hora', { ascending: true });

  if (estado && ['agendado', 'en_progreso', 'completado', 'cancelado'].includes(estado)) {
    query = query.eq('estado', estado);
  }

  if (startDate) {
    query = query.gte('fecha', startDate);
  }

  if (endDate) {
    query = query.lte('fecha', endDate);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const supabase = await getSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 });
  }

  const body = await request.json();
  const clienteId = body.cliente_id?.trim();
  const empresaId = body.empresa_id?.trim() || null;
  const fecha = body.fecha?.trim();
  const hora = body.hora?.trim();
  const ubicacion = body.ubicacion?.trim() || null;

  if (!clienteId) {
    return NextResponse.json({ error: { message: 'El cliente es obligatorio.' } }, { status: 400 });
  }
  if (!fecha) {
    return NextResponse.json({ error: { message: 'La fecha es obligatoria.' } }, { status: 400 });
  }
  if (!hora) {
    return NextResponse.json({ error: { message: 'La hora es obligatoria.' } }, { status: 400 });
  }

  // Verify cliente belongs to user
  const { data: cliente } = await supabase
    .from('clientes')
    .select('id')
    .eq('id', clienteId)
    .eq('user_id', user.id)
    .single();

  if (!cliente) {
    return NextResponse.json(
      { error: { message: 'Cliente no encontrado o no te pertenece.' } },
      { status: 400 }
    );
  }

  if (empresaId) {
    const { data: empresa } = await supabase
      .from('empresas')
      .select('id')
      .eq('id', empresaId)
      .eq('user_id', user.id)
      .single();

    if (!empresa) {
      return NextResponse.json(
        { error: { message: 'Empresa no encontrada o no te pertenece.' } },
        { status: 400 }
      );
    }
  }

  const { data, error } = await supabase
    .from('trabajos')
    .insert({
      user_id: user.id,
      cliente_id: clienteId,
      empresa_id: empresaId,
      fecha,
      hora,
      ubicacion,
      estado: 'agendado',
    })
    .select(
      `
      *,
      clientes(id, nombre),
      empresas(id, nombre)
    `
    )
    .single();

  if (error) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
