import Link from 'next/link';
import JobCreationForm from '../JobCreationForm';

export default function NuevoTrabajoPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/trabajos" className="text-amber-600 hover:underline text-sm">
          ← Volver a trabajos
        </Link>
      </div>
      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase mb-6">
        Crear trabajo
      </h1>
      <JobCreationForm />
    </div>
  );
}
