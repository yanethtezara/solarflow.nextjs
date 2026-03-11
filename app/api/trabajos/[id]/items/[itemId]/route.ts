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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const { id: trabajoId, itemId } = await params;
  const supabase = await getSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 });
  }

  const { data: trabajo } = await supabase
    .from('trabajos')
    .select('id')
    .eq('id', trabajoId)
    .eq('user_id', user.id)
    .single();

  if (!trabajo) {
    return NextResponse.json(
      { error: { message: 'No tienes acceso a este recurso.' } },
      { status: 404 }
    );
  }

  const { error } = await supabase
    .from('trabajos_items')
    .delete()
    .eq('trabajo_id', trabajoId)
    .eq('item_id', itemId);

  if (error) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
