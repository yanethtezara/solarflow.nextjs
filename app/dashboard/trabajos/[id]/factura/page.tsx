'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SunLogo from '@/components/SunLogo';

type InvoiceData = {
  trabajo: any;
  items: any[];
  perfil: any;
  metadata: {
    generated_at: string;
    invoice_number: string;
  };
};

export default function FacturaPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [data, setData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/facturas/${id}`);
        if (!res.ok) throw new Error('No se pudo obtener los datos de la factura');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading)
    return (
      <div className="p-12 text-center" data-testid="loading_state">
        Cargando factura...
      </div>
    );
  if (error || !data)
    return (
      <div className="p-12 text-center" data-testid="error_state">
        <p className="text-red-600 mb-4">{error || 'Error desconocido'}</p>
        <Link href={`/dashboard/trabajos/${id}`} className="text-amber-600 underline">
          Volver al trabajo
        </Link>
      </div>
    );

  const total = data.items.reduce(
    (acc, i) => acc + i.cantidad * (i.catalogo_items?.precio || 0),
    0
  );
  const { trabajo, perfil, metadata } = data;

  return (
    <div
      className="min-h-screen bg-slate-50 p-4 sm:p-8 print:bg-white print:p-0"
      data-testid="invoicePage"
    >
      {/* Navbar de controles (oculto en impresión) */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link
          href={`/dashboard/trabajos/${id}`}
          className="text-slate-600 hover:text-slate-900 flex items-center gap-2 text-sm font-medium"
          data-testid="back_link"
        >
          ← Volver al trabajo
        </Link>
        <Button onClick={handlePrint} className="gap-2" data-testid="print_button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Descargar PDF
        </Button>
      </div>

      {/* Papel de Factura */}
      <div
        className="max-w-4xl mx-auto bg-white shadow-xl rounded-none sm:rounded-xl overflow-hidden print:shadow-none print:rounded-none"
        data-testid="invoice_paper"
      >
        <div className="p-8 sm:p-12">
          {/* Cabecera: Logo y Título */}
          <div className="flex flex-col sm:flex-row justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <SunLogo className="h-10 w-10 text-amber-600" />
                <span className="text-2xl font-black tracking-tighter text-slate-900">
                  SOLARFLOW
                </span>
              </div>
              <div className="text-sm text-slate-500 space-y-1">
                <p className="font-bold text-slate-900">
                  {perfil.email.split('@')[0].toUpperCase()} SOLUTIONS
                </p>
                <p>NIF: B-87654321 (Provisional)</p>
                <p>{perfil.email}</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-4xl font-black text-slate-900 mb-2">FACTURA</h1>
              <p className="text-amber-600 font-bold tracking-widest">{metadata.invoice_number}</p>
              <div className="mt-4 text-sm text-slate-500">
                <p>Fecha: {new Date(metadata.generated_at).toLocaleDateString('es-ES')}</p>
                <p>Trabajo ID: #{trabajo.id.slice(0, 5)}</p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100 mb-12" />

          {/* Emisor vs Receptor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-12">
            <div>
              <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-3">
                Emitido por
              </p>
              <div className="text-sm text-slate-700 space-y-1">
                <p className="font-bold">{perfil.email.split('@')[0]}</p>
                <p>Instalador Autorizado</p>
                <p>España</p>
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-3">
                Facturar a
              </p>
              <div className="text-sm text-slate-700 space-y-1">
                <p className="font-bold">{trabajo.clientes?.nombre || '—'}</p>
                <p>{trabajo.clientes?.direccion || 'Sin dirección registrada'}</p>
                <p>{trabajo.clientes?.telefono || 'Sin teléfono'}</p>
                {trabajo.empresas && (
                  <p className="mt-2 pt-2 border-t border-slate-50 italic text-slate-500">
                    Vía: {trabajo.empresas.nombre}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tabla de Conceptos */}
          <div className="mb-12">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="py-4 text-xs font-black uppercase text-slate-900 tracking-widest">
                    Concepto
                  </th>
                  <th className="py-4 text-center text-xs font-black uppercase text-slate-900 tracking-widest">
                    Cant.
                  </th>
                  <th className="py-4 text-right text-xs font-black uppercase text-slate-900 tracking-widest">
                    Precio
                  </th>
                  <th className="py-4 text-right text-xs font-black uppercase text-slate-900 tracking-widest">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.map((item, idx) => (
                  <tr key={idx} className="group">
                    <td className="py-6">
                      <p className="font-bold text-slate-900">
                        {item.catalogo_items?.nombre || 'Ítem de catálogo'}
                      </p>
                      <p className="text-xs text-slate-500 uppercase tracking-tighter">
                        {item.catalogo_items?.tipo === 'mano_de_obra'
                          ? 'Servicio / Mano de Obra'
                          : 'Material / Componente'}
                      </p>
                    </td>
                    <td className="py-6 text-center text-slate-700">{item.cantidad}</td>
                    <td className="py-6 text-right text-slate-700">
                      €{Number(item.catalogo_items?.precio || 0).toFixed(2)}
                    </td>
                    <td className="py-6 text-right font-bold text-slate-900">
                      €{(item.cantidad * (item.catalogo_items?.precio || 0)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="flex justify-end">
            <div className="w-full sm:w-64 space-y-3">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal (Base Imponible)</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>IVA (Incluido)</span>
                <span>€0.00</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2 border-slate-900">
                <span className="font-black text-slate-900 uppercase tracking-wider">Total</span>
                <span className="text-2xl font-black text-amber-600">€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Pie de Página */}
          <div className="mt-20 pt-8 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 font-medium">
              Gracias por confiar en SolarFlow para su transición energética.
            </p>
            <p className="text-[10px] text-slate-300 mt-2">
              Este documento es una previsualización generada automáticamente por SolarFlow Next.js
              MVP.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
