'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import TrabajosList from './TrabajosList';
import { CalendarView } from '@/components/features/trabajos/CalendarView';
import ToastFromUrl from '@/components/ToastFromUrl';
import { Button } from '@/components/ui/button';

type Trabajo = any; // Simplificado para el cliente

export default function TrabajosPage() {
  const [view, setView] = useState<'lista' | 'calendario'>('lista');
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar preferencia del usuario
  useEffect(() => {
    const savedView = localStorage.getItem('trabajos_view_preference');
    if (savedView === 'lista' || savedView === 'calendario') {
      setView(savedView);
    }
  }, []);

  // Fetch de trabajos (para la lista)
  useEffect(() => {
    const fetchTrabajos = async () => {
      try {
        const res = await fetch('/api/trabajos');
        if (!res.ok) throw new Error('Error al cargar trabajos');
        const data = await res.json();
        setTrabajos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrabajos();
  }, []);

  const toggleView = (newView: 'lista' | 'calendario') => {
    setView(newView);
    localStorage.setItem('trabajos_view_preference', newView);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8" data-testid="trabajosPage">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
            Mis Instalaciones
          </h1>
          <div className="flex gap-1 mt-2 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => toggleView('lista')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                view === 'lista'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              data-testid="view_list_button"
            >
              LISTA
            </button>
            <button
              onClick={() => toggleView('calendario')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                view === 'calendario'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              data-testid="view_calendar_button"
            >
              CALENDARIO
            </button>
          </div>
        </div>

        <Link
          href="/dashboard/trabajos/nuevo"
          className="btn-primary w-full sm:w-auto text-center min-h-[44px] flex items-center justify-center"
          data-testid="new_job_button"
        >
          + Nueva instalación
        </Link>
      </div>

      {error ? (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
          data-testid="load_error"
        >
          <p className="font-medium">Error al cargar trabajos</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : loading ? (
        <div className="p-12 text-center text-slate-500" data-testid="loading_state">
          Cargando...
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
          {view === 'lista' ? <TrabajosList trabajos={trabajos} /> : <CalendarView />}
        </div>
      )}

      <Suspense fallback={null}>
        <ToastFromUrl />
      </Suspense>
    </div>
  );
}
