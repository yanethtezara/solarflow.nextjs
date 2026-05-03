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

  // Obtener datos del perfil del usuario (emisor)
  const { data: profile } = await supabase
    .from('profiles')
    .select('nombre_completo, telefono')
    .eq('id', user.id)
    .single();

  const { data: itemsData } = await supabase
    .from('trabajos_items')
    .select(
      `
      cantidad,
      catalogo_items(nombre, precio)
    `
    )
    .eq('trabajo_id', id);

  const items = itemsData || [];
  const subtotal = items.reduce((acc, item) => {
    const precio = (item.catalogo_items as any)?.precio || 0;
    return acc + precio * item.cantidad;
  }, 0);

  const total = subtotal;
  const cliente = trabajo.clientes as any;
  const empresa = trabajo.empresas as any;

  // Lógica de Paginación (15 ítems por página)
  const itemsPerPage = 15;
  const totalPages = Math.ceil(items.length / itemsPerPage) || 1;
  const pages = [];

  for (let i = 0; i < totalPages; i++) {
    pages.push(items.slice(i * itemsPerPage, (i + 1) * itemsPerPage));
  }

  return (
    <div
      className="min-h-screen bg-gray-50 p-4 sm:p-8 print:bg-white print:p-0"
      data-testid="invoicePage"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Actions - hidden on print */}
        <div className="flex justify-between items-center print:hidden">
          <Link
            href={`/dashboard/trabajos/${id}`}
            className="text-amber-600 hover:underline text-sm font-medium"
            data-testid="back_link"
          >
            ← Volver a la instalación
          </Link>
          <button
            id="print-btn"
            className="btn-primary text-sm px-6 flex items-center gap-2"
            data-testid="print_button"
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

        {/* Invoice Pages Loop */}
        {pages.map((pageItems, pageIdx) => (
          <div
            key={pageIdx}
            className="relative bg-white border border-gray-200 shadow-sm p-8 sm:p-12 print:border-none print:shadow-none min-h-[1056px] flex flex-col page-break overflow-hidden"
            data-testid={`invoice_page_${pageIdx + 1}`}
          >
            {/* Watermark */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-[0.04] rotate-[-35deg] scale-150 select-none print:opacity-[0.05]">
              <SunLogo size={400} className="text-amber-600 mb-4" />
              <h1 className="text-8xl font-black uppercase tracking-tighter text-slate-900">
                SolarFlow
              </h1>
            </div>

            {/* Header - Repeated on every page */}
            <div className="relative z-10 flex justify-between items-start border-b border-gray-100 pb-8 mb-8">
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

            {/* Info Blocks - Only on first page */}
            {pageIdx === 0 && (
              <div className="relative z-10 grid grid-cols-2 gap-12 mb-12">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    De
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {profile?.nombre_completo ?? empresa?.nombre ?? 'Mi Empresa'}
                  </p>
                  {empresa?.nombre && profile?.nombre_completo && (
                    <p className="text-sm text-slate-600">{empresa.nombre}</p>
                  )}
                  <p className="text-sm text-slate-600 mt-1">
                    {profile?.telefono ?? empresa?.telefono_contacto}
                  </p>
                  <p className="text-sm text-slate-600">{user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Para
                  </p>
                  <p className="text-lg font-bold text-slate-900">{cliente?.nombre}</p>
                  {cliente?.direccion && (
                    <p className="text-sm text-slate-600 mt-1">{cliente.direccion}</p>
                  )}
                  {cliente?.telefono && (
                    <p className="text-sm text-slate-600">{cliente.telefono}</p>
                  )}
                </div>
              </div>
            )}

            {/* Items Table */}
            <div className="relative z-10 flex-1">
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
                <tbody className="divide-y divide-gray-100 font-medium">
                  {pageItems.map((item, idx) => {
                    const catalogo = item.catalogo_items as any;
                    const precio = catalogo?.precio || 0;
                    return (
                      <tr key={idx}>
                        <td className="py-4 text-sm text-slate-900">{catalogo?.nombre}</td>
                        <td className="py-4 text-sm text-slate-600 text-center">{item.cantidad}</td>
                        <td className="py-4 text-sm text-slate-600 text-right">
                          {precio.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </td>
                        <td className="py-4 text-sm font-bold text-slate-900 text-right">
                          {(precio * item.cantidad).toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Totals & Footer - Only on LAST page */}
            {pageIdx === totalPages - 1 && (
              <div className="relative z-10">
                <div className="border-t-2 border-slate-900 pt-8 mt-12 flex justify-end">
                  <div className="w-full sm:w-64 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 uppercase font-bold">Subtotal</span>
                      <span className="text-slate-900 font-bold">
                        {subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </span>
                    </div>
                    <div className="flex justify-between text-xl font-black pt-3 border-t border-gray-100">
                      <span className="text-slate-900 uppercase">Total</span>
                      <span className="text-amber-600">
                        {total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-20 text-center">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">
                    Gracias por su confianza
                  </p>
                  <p className="text-[10px] text-slate-300">
                    Esta es una factura generada automáticamente por SolarFlow.
                  </p>
                </div>
              </div>
            )}

            {pageIdx !== totalPages - 1 && (
              <div className="relative z-10 mt-8 text-right italic text-slate-400 text-xs">
                Continúa en la siguiente página...
              </div>
            )}

            {/* Page Counter */}
            <div className="relative z-10 mt-auto pt-8 flex justify-center border-t border-gray-50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Página {pageIdx + 1} de {totalPages}
              </p>
            </div>
          </div>
        ))}
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('print-btn')?.addEventListener('click', () => {
              window.print();
            });
          `,
        }}
      />

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
          .page-break {
            page-break-after: always;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /* Asegurar que la marca de agua se imprima correctamente */
          .relative {
             -webkit-print-color-adjust: exact;
             print-color-adjust: exact;
          }
        }
      `,
        }}
      />
    </div>
  );
}
