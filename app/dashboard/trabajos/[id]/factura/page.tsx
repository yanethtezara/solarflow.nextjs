import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Database } from '@/types/supabase';
import SunLogo from '@/components/SunLogo';

export default async function FacturaPage({ params }: { params: Promise<{ id: string }> }) {
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
      clientes(nombre, direccion, telefono),
      empresas(nombre, contacto_responsable, telefono_contacto)
    `
    )
    .eq('id', id)
    .single();

  if (error || !trabajo) notFound();

  const { data: items } = await supabase
    .from('trabajos_items')
    .select(
      `
      cantidad,
      catalogo_items(nombre, precio)
    `
    )
    .eq('trabajo_id', id);

  const subtotal = (items || []).reduce((acc, item) => {
    const precio = (item.catalogo_items as any)?.precio || 0;
    return acc + precio * item.cantidad;
  }, 0);

  const total = subtotal;

  const cliente = trabajo.clientes as any;
  const empresa = trabajo.empresas as any;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Actions - hidden on print */}
        <div className="flex justify-between items-center print:hidden">
          <Link
            href={`/dashboard/trabajos/${id}`}
            className="text-amber-600 hover:underline text-sm font-medium"
          >
            ← Volver al trabajo
          </Link>
          <button
            onClick={() => window.print()}
            className="btn-primary text-sm px-6 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Imprimir o Guardar PDF
          </button>
        </div>

        {/* Invoice Container */}
        <div className="bg-white border border-gray-200 shadow-sm p-8 sm:p-12 print:border-none print:shadow-none min-h-[1056px] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-gray-100 pb-8 mb-8">
            <div className="flex items-center gap-3">
              <SunLogo size={48} className="text-amber-600" />
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                  SolarFlow
                </h2>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">
                  Factura de Servicio
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-1">
                Factura #
              </p>
              <p className="text-xl font-medium text-slate-600 truncate">
                {id.slice(0, 8).toUpperCase()}
              </p>
              <p className="text-sm text-slate-500 mt-2">
                {new Date(trabajo.fecha).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Info Blocks */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">De</p>
              <p className="text-lg font-bold text-slate-900">{empresa?.nombre ?? 'Mi Empresa'}</p>
              {empresa?.contacto_responsable && (
                <p className="text-sm text-slate-600 mt-1">{empresa.contacto_responsable}</p>
              )}
              {empresa?.telefono_contacto && (
                <p className="text-sm text-slate-600">{empresa.telefono_contacto}</p>
              )}
              <p className="text-sm text-slate-600 mt-2">{user.email}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Para</p>
              <p className="text-lg font-bold text-slate-900">{cliente?.nombre}</p>
              {cliente?.direccion && (
                <p className="text-sm text-slate-600 mt-1">{cliente.direccion}</p>
              )}
              {cliente?.telefono && <p className="text-sm text-slate-600">{cliente.telefono}</p>}
            </div>
          </div>

          {/* Items Table */}
          <div className="flex-1">
            <table className="w-full text-left">
              <thead className="border-b-2 border-slate-900">
                <tr>
                  <th className="py-3 text-xs font-black uppercase tracking-widest text-slate-900">
                    Descripción
                  </th>
                  <th className="py-3 text-xs font-black uppercase tracking-widest text-slate-900 text-center">
                    Cant.
                  </th>
                  <th className="py-3 text-xs font-black uppercase tracking-widest text-slate-900 text-right">
                    Precio
                  </th>
                  <th className="py-3 text-xs font-black uppercase tracking-widest text-slate-900 text-right">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(items || []).map((item, idx) => {
                  const catalogo = item.catalogo_items as any;
                  const precio = catalogo?.precio || 0;
                  return (
                    <tr key={idx}>
                      <td className="py-4 text-sm font-medium text-slate-900">
                        {catalogo?.nombre}
                      </td>
                      <td className="py-4 text-sm text-slate-600 text-center">{item.cantidad}</td>
                      <td className="py-4 text-sm text-slate-600 text-right">
                        {precio.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </td>
                      <td className="py-4 text-sm font-bold text-slate-900 text-right">
                        {(precio * item.cantidad).toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t-2 border-slate-900 pt-8 mt-12 flex justify-end">
            <div className="w-full sm:w-64 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 uppercase font-bold">Subtotal</span>
                <span className="text-slate-900 font-medium">
                  {subtotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </span>
              </div>
              <div className="flex justify-between text-xl font-black pt-3 border-t border-gray-100">
                <span className="text-slate-900 uppercase">Total</span>
                <span className="text-amber-600">
                  {total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-20 text-center">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">
              Gracias por su confianza
            </p>
            <p className="text-[10px] text-slate-300">
              Esta es una factura generada automáticamente por SolarFlow.
            </p>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body {
            background: white !important;
          }
          .print-hidden {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `,
        }}
      />
    </div>
  );
}
