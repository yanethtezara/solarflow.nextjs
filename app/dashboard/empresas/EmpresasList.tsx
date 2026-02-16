'use client';

import Link from 'next/link';

type Empresa = {
  id: string;
  nombre: string;
  contacto_responsable: string | null;
  telefono_contacto: string | null;
};

export default function EmpresasList({ empresas }: { empresas: Empresa[] }) {
  if (empresas.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-slate-500 mb-4">Aún no tienes empresas registradas.</p>
        <Link
          href="/dashboard/empresas/nuevo"
          className="text-amber-600 hover:underline font-medium"
        >
          Agregar tu primera empresa →
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
            <th className="px-6 py-4 text-left table-header">Contacto</th>
            <th className="px-6 py-4 text-left table-header">Teléfono</th>
            <th className="px-6 py-4 text-right table-header">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {empresas.map((e) => (
            <tr key={e.id} className="hover:bg-gray-50 transition-colors duration-200">
              <td className="px-6 py-4 font-medium text-slate-900">{e.nombre}</td>
              <td className="px-6 py-4 text-slate-600">{e.contacto_responsable || '—'}</td>
              <td className="px-6 py-4 text-slate-600">{e.telefono_contacto || '—'}</td>
              <td className="px-6 py-4 text-right">
                <Link
                  href={`/dashboard/empresas/${e.id}/editar`}
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
