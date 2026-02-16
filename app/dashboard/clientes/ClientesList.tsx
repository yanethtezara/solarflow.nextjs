'use client';

import Link from 'next/link';

type Cliente = {
  id: string;
  nombre: string;
  direccion: string | null;
  telefono: string | null;
};

export default function ClientesList({ clientes }: { clientes: Cliente[] }) {
  if (clientes.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-slate-500 mb-4">Aún no tienes clientes registrados.</p>
        <Link href="/dashboard/clientes/nuevo" className="text-amber-600 hover:underline font-medium">
          Agregar tu primer cliente →
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left table-header">Nombre</th>
            <th className="px-6 py-4 text-left table-header">Dirección</th>
            <th className="px-6 py-4 text-left table-header">Teléfono</th>
            <th className="px-6 py-4 text-right table-header">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {clientes.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50 transition-colors duration-200">
              <td className="px-6 py-4 font-medium text-slate-900">{c.nombre}</td>
              <td className="px-6 py-4 text-slate-600">{c.direccion || '—'}</td>
              <td className="px-6 py-4 text-slate-600">{c.telefono || '—'}</td>
              <td className="px-6 py-4 text-right">
                <Link
                  href={`/dashboard/clientes/${c.id}/editar`}
                  className="text-amber-600 hover:underline text-sm font-medium"
                >
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
