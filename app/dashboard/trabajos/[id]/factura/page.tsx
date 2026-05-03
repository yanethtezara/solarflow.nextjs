'use client';

import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import SunLogo from '@/components/SunLogo';

export default function FacturaPage() {
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: trabajo } = await supabase
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

      const { data: profile } = await supabase
        .from('profiles')
        .select('nombre_completo, telefono')
        .eq('id', user.id)
        .single();

      const { data: items } = await supabase
        .from('trabajos_items')
        .select(
          `
          cantidad,
          catalogo_items(nombre, precio)
        `
        )
        .eq('trabajo_id', id);

      if (trabajo) {
        setData({ trabajo, profile, items: items || [], userEmail: user.email });
      }
      setLoading(false);
    }
    loadData();
  }, [id, supabase]);

  const handlePrint = () => {
    window.print();
  };

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500 uppercase font-black animate-pulse">
        Cargando Factura...
      </div>
    );
  if (!data) return notFound();

  const { trabajo, profile, items, userEmail } = data;
  const subtotal = items.reduce((acc: number, item: any) => {
    const precio = item.catalogo_items?.precio || 0;
    return acc + precio * item.cantidad;
  }, 0);
  const total = subtotal;
  const cliente = trabajo.clientes;
  const empresa = trabajo.empresas;

  const itemsPerPage = 15;
  const totalPages = Math.ceil(items.length / itemsPerPage) || 1;
  const pages = [];
  for (let i = 0; i < totalPages; i++) {
    pages.push(items.slice(i * itemsPerPage, (i + 1) * itemsPerPage));
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center print:hidden">
          <Link
            href={`/dashboard/trabajos/${id}`}
            className="text-amber-600 hover:underline text-sm font-medium"
          >
            ← Volver a la instalación
          </Link>
          <button
            onClick={handlePrint}
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

        {pages.map((pageItems, pageIdx) => (
          <div
            key={pageIdx}
            className="relative bg-white border border-gray-200 shadow-sm p-8 sm:p-12 print:border-none print:shadow-none min-h-[1056px] flex flex-col page-break overflow-hidden mb-8"
          >
            {/* Watermark */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-[0.04] rotate-[-35deg] scale-150 select-none print:opacity-[0.05]">
              <SunLogo size={400} className="text-amber-600 mb-4" />
              <h1 className="text-8xl font-black uppercase tracking-tighter text-slate-900">
                SolarFlow
              </h1>
            </div>

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

            {pageIdx === 0 && (
              <div className="relative z-10 grid grid-cols-2 gap-12 mb-12">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    De
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {profile?.nombre_completo ?? 'Emisor'}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">{profile?.telefono}</p>
                  <p className="text-sm text-slate-600">{userEmail}</p>
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
                  {pageItems.map((item: any, idx: number) => {
                    const catalogo = item.catalogo_items;
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

            <div className="relative z-10 mt-auto pt-8 flex justify-center border-t border-gray-50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Página {pageIdx + 1} de {totalPages}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          /* Ocultar TODO el layout del dashboard */
          aside, nav, header, footer, .print-hidden { 
            display: none !important; 
          }
          
          /* Forzar que el contenido de la factura ocupe todo el ancho */
          body, main { 
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }

          .max-w-4xl {
            max-width: none !important;
            width: 100% !important;
          }

          .min-h-screen {
            min-height: 0 !important;
          }

          .page-break { 
            page-break-after: always; 
            border: none !important; 
            box-shadow: none !important; 
            padding: 0 !important; 
            margin: 0 !important; 
          }
          
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
