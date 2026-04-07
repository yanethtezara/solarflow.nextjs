import { Suspense } from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Database } from '@/types/supabase';
import JobStatusSelector from '../JobStatusSelector';
import JobItemsList from '../JobItemsList';
import AddItemToJobForm from '../AddItemToJobForm';
import ToastFromUrl from '@/components/ToastFromUrl';

export default async function TrabajoDetailPage({ params }: { params: Promise<{ id: string }> }) {
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

  const { data: trabajo, error } = await supabase
    .from('trabajos')
    .select(
      `
      *,
      clientes(id, nombre, direccion, telefono),
      empresas(id, nombre, contacto_responsable, telefono_contacto)
    `
    )
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !trabajo) notFound();

  const { data: itemsData } = await supabase
    .from('trabajos_items')
    .select(
      `
      item_id,
      cantidad,
      catalogo_items(id, nombre, tipo, precio)
    `
    )
    .eq('trabajo_id', id);

  const items = (itemsData || []) as Array<{
    item_id: string;
    cantidad: number;
    catalogo_items: { id: string; nombre: string; tipo: string; precio: number } | null;
  }>;
  const existingItemIds = items.map(i => i.item_id);

  const cliente = trabajo.clientes as {
    id: string;
    nombre: string;
    direccion?: string;
    telefono?: string;
  } | null;
  const empresa = trabajo.empresas as {
    id: string;
    nombre: string;
    contacto_responsable?: string;
    telefono_contacto?: string;
  } | null;
  const ubicacion = (trabajo as { ubicacion?: string | null }).ubicacion;

  const formatFecha = (f: string) =>
    new Date(f + 'T00:00:00').toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  const formatHora = (h: string) => {
    const parts = (h || '09:00').split(':');
    return `${parts[0]}:${parts[1] || '00'}`;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/trabajos" className="text-amber-600 hover:underline text-sm">
          ← Volver a trabajos
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
            {cliente?.nombre ?? 'Trabajo'}
          </h1>
          <p className="text-slate-600 mt-1">
            {formatFecha(trabajo.fecha)} · {formatHora(trabajo.hora)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <JobStatusSelector trabajoId={id} currentEstado={trabajo.estado} />
          {trabajo.estado === 'completado' && (
            <Link
              href={`/dashboard/trabajos/${id}/factura`}
              className="bg-amber-100 text-amber-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-200 transition-colors"
              data-testid="generate_invoice_button"
            >
              Generar Factura
            </Link>
          )}
          <Link
            href={`/dashboard/trabajos/${id}/editar`}
            className="btn-primary text-sm"
            data-testid="edit_job_button"
          >
            Editar
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card p-6 space-y-4">
          <div>
            <p className="text-xs font-bold uppercase text-slate-500 tracking-tight mb-1">
              Cliente
            </p>
            <p className="text-slate-900">{cliente?.nombre ?? '—'}</p>
            {cliente?.direccion && (
              <p className="text-slate-600 text-sm mt-1">{cliente.direccion}</p>
            )}
            {cliente?.telefono && <p className="text-slate-600 text-sm">{cliente.telefono}</p>}
          </div>
          {empresa && (
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 tracking-tight mb-1">
                Empresa
              </p>
              <p className="text-slate-900">{empresa.nombre}</p>
              {empresa.contacto_responsable && (
                <p className="text-slate-600 text-sm">Contacto: {empresa.contacto_responsable}</p>
              )}
              {empresa.telefono_contacto && (
                <p className="text-slate-600 text-sm">{empresa.telefono_contacto}</p>
              )}
            </div>
          )}
          {ubicacion ? (
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 tracking-tight mb-1">
                Ubicación
              </p>
              <p className="text-slate-900">{ubicacion}</p>
            </div>
          ) : null}
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Materiales y mano de obra</h2>
          <AddItemToJobForm trabajoId={id} existingItemIds={existingItemIds} />
          <div className="mt-4">
            <JobItemsList trabajoId={id} items={items} />
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <ToastFromUrl />
      </Suspense>
    </div>
  );
}
