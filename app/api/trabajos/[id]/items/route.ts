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

async function ensureTrabajoOwnership(
  supabase: Awaited<ReturnType<typeof getSupabase>>,
  trabajoId: string,
  userId: string
) {
  const { data, error } = await supabase
    .from('trabajos')
    .select('id')
    .eq('id', trabajoId)
    .eq('user_id', userId)
    .single();
  return !error && !!data;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: trabajoId } = await params;
  const supabase = await getSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 });
  }

  const owns = await ensureTrabajoOwnership(supabase, trabajoId, user.id);
  if (!owns) {
    return NextResponse.json(
      { error: { message: 'No tienes acceso a este recurso.' } },
      { status: 404 }
    );
  }

  const { data, error } = await supabase
    .from('trabajos_items')
    .select(
      `
      item_id,
      cantidad,
      catalogo_items(id, nombre, tipo, precio)
    `
    )
    .eq('trabajo_id', trabajoId);

  if (error) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: trabajoId } = await params;
  const supabase = await getSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 });
  }

  const owns = await ensureTrabajoOwnership(supabase, trabajoId, user.id);
  if (!owns) {
    return NextResponse.json(
      { error: { message: 'No tienes acceso a este recurso.' } },
      { status: 404 }
    );
  }

  const body = await request.json();
  const itemId = body.item_id?.trim();
  const cantidad =
    typeof body.cantidad === 'number' ? Math.floor(body.cantidad) : parseInt(body.cantidad, 10);

  if (!itemId) {
    return NextResponse.json({ error: { message: 'El ítem es obligatorio.' } }, { status: 400 });
  }
  if (isNaN(cantidad) || cantidad < 1) {
    return NextResponse.json(
      { error: { message: 'La cantidad debe ser un número entero positivo.' } },
      { status: 400 }
    );
  }

  // Verify catalogo item belongs to user
  const { data: item } = await supabase
    .from('catalogo_items')
    .select('id')
    .eq('id', itemId)
    .eq('user_id', user.id)
    .single();

  if (!item) {
    return NextResponse.json(
      { error: { message: 'Ítem del catálogo no encontrado o no te pertenece.' } },
      { status: 400 }
    );
  }

  // Check if item already exists in job
  const { data: existingEntry } = await supabase
    .from('trabajos_items')
    .select('cantidad')
    .eq('trabajo_id', trabajoId)
    .eq('item_id', itemId)
    .single();

  let result;
  if (existingEntry) {
    // Update summing the quantity
    result = await supabase
      .from('trabajos_items')
      .update({ cantidad: existingEntry.cantidad + cantidad })
      .eq('trabajo_id', trabajoId)
      .eq('item_id', itemId)
      .select()
      .single();
  } else {
    // Insert new entry
    result = await supabase
      .from('trabajos_items')
      .insert({ trabajo_id: trabajoId, item_id: itemId, cantidad })
      .select()
      .single();
  }

  if (result.error) {
    return NextResponse.json({ error: { message: result.error.message } }, { status: 500 });
  }

  return NextResponse.json(result.data, { status: 201 });
}
