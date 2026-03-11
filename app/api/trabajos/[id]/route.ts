import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
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

const selectWithRelations = `
  *,
  clientes(id, nombre, direccion, telefono),
  empresas(id, nombre, contacto_responsable, telefono_contacto)
`;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('trabajos')
    .select(selectWithRelations)
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: { message: 'No tienes acceso a este recurso.' } },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
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
  const clienteId = body.cliente_id?.trim();
  const empresaId =
    body.empresa_id === null || body.empresa_id === '' ? null : body.empresa_id?.trim();
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
    .update({
      cliente_id: clienteId,
      empresa_id: empresaId,
      fecha,
      hora,
      ubicacion,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select(selectWithRelations)
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

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 });
  }

  const { error } = await supabase.from('trabajos').delete().eq('id', id).eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
