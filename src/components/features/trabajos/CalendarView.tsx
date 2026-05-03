'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Trabajo = {
  id: string;
  fecha: string;
  hora: string;
  fecha_fin: string | null;
  hora_fin: string | null;
  estado: string;
  clientes: { id: string; nombre: string } | null;
};

const ESTADO_COLORS: Record<string, string> = {
  agendado: 'bg-blue-500',
  en_progreso: 'bg-orange-500',
  completado: 'bg-green-500',
  cancelado: 'bg-gray-400',
};

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 to 20:00

export function CalendarView() {
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly'>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [jobs, setJobs] = useState<Trabajo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  // Monthly logic
  const daysInMonth = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    let startDay = firstDay.getDay() - 1;
    if (startDay === -1) startDay = 6;
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  }, [month, year]);

  // Weekly logic
  const daysInWeek = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday
    startOfWeek.setDate(diff);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  }, [currentDate]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      // Fetch a wider range to be safe
      const start = new Date(year, month - 1, 1).toISOString().split('T')[0];
      const end = new Date(year, month + 2, 0).toISOString().split('T')[0];

      try {
        const res = await fetch(`/api/trabajos?startDate=${start}&endDate=${end}`);
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (err) {
        console.error('Failed to fetch jobs for calendar', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [month, year]);

  const jobsByDate = useMemo(() => {
    const map: Record<string, Trabajo[]> = {};
    jobs.forEach(job => {
      const start = new Date(job.fecha + 'T00:00:00');
      const end = new Date((job.fecha_fin || job.fecha) + 'T00:00:00');

      const current = new Date(start);
      while (current <= end) {
        const dateStr = current.toISOString().split('T')[0];
        if (!map[dateStr]) map[dateStr] = [];
        map[dateStr].push(job);
        current.setDate(current.getDate() + 1);
      }
    });
    return map;
  }, [jobs]);

  const next = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'monthly') newDate.setMonth(currentDate.getMonth() + 1);
    else newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const prev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'monthly') newDate.setMonth(currentDate.getMonth() - 1);
    else newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const titleLabel =
    viewMode === 'monthly'
      ? `${currentDate.toLocaleDateString('es-ES', { month: 'long' })} ${currentDate.getFullYear()}`
      : `Semana del ${daysInWeek[0].toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`;

  const selectedDayJobs = selectedDate ? jobsByDate[selectedDate] || [] : [];

  return (
    <div className="space-y-6" data-testid="calendarView">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-slate-900 capitalize" data-testid="calendar_title">
            {titleLabel}
          </h2>
          <div className="flex gap-1 mt-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${viewMode === 'monthly' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500'}`}
              data-testid="monthly_view_button"
            >
              MENSUAL
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${viewMode === 'weekly' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500'}`}
              data-testid="weekly_view_button"
            >
              SEMANAL
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={prev} className="px-3" data-testid="prev_button">
            ←
          </Button>
          <Button
            variant="secondary"
            onClick={() => setCurrentDate(new Date())}
            data-testid="today_button"
          >
            Hoy
          </Button>
          <Button variant="secondary" onClick={next} className="px-3" data-testid="next_button">
            →
          </Button>
        </div>
      </div>

      {/* View Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {viewMode === 'monthly' ? (
          <>
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
              {DAYS.map(day => (
                <div
                  key={day}
                  className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-fr">
              {daysInMonth.map((date, idx) => {
                if (!date)
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="bg-gray-50/50 min-h-[100px] border-r border-b border-gray-50"
                    />
                  );
                const dateStr = date.toISOString().split('T')[0];
                const isToday = new Date().toISOString().split('T')[0] === dateStr;
                const isSelected = selectedDate === dateStr;
                const dayJobs = jobsByDate[dateStr] || [];

                return (
                  <div
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`min-h-[100px] p-2 border-r border-b border-gray-100 cursor-pointer transition-colors hover:bg-amber-50/30 ${isSelected ? 'bg-amber-50' : ''}`}
                    data-testid={`calendar_day_${dateStr}`}
                  >
                    <span
                      className={`text-sm font-medium ${isToday ? 'bg-amber-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-700'}`}
                    >
                      {date.getDate()}
                    </span>
                    <div className="mt-2 space-y-1">
                      {dayJobs.slice(0, 3).map(job => (
                        <div
                          key={job.id}
                          className={`h-1.5 w-full rounded-full ${ESTADO_COLORS[job.estado] || 'bg-gray-200'}`}
                          title={`${job.hora} - ${job.clientes?.nombre}`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Weekly View */
          <div className="overflow-x-auto" data-testid="weeklyGrid">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-[80px_repeat(7,1fr)] bg-gray-50 border-b border-gray-100">
                <div className="py-3 border-r border-gray-100" />
                {daysInWeek.map((date, i) => (
                  <div key={i} className="py-3 text-center border-r border-gray-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{DAYS[i]}</p>
                    <p
                      className={`text-sm font-bold ${new Date().toISOString().split('T')[0] === date.toISOString().split('T')[0] ? 'text-amber-600' : 'text-slate-700'}`}
                    >
                      {date.getDate()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-[80px_repeat(7,1fr)]">
                {HOURS.map(hour => (
                  <div key={hour} className="contents">
                    <div className="py-4 text-center text-[10px] font-bold text-slate-400 border-r border-b border-gray-50">
                      {hour.toString().padStart(2, '0')}:00
                    </div>
                    {daysInWeek.map((date, dayIdx) => {
                      const dateStr = date.toISOString().split('T')[0];
                      const currentSlotStart = new Date(
                        `${dateStr}T${hour.toString().padStart(2, '0')}:00:00`
                      );
                      const currentSlotEnd = new Date(
                        `${dateStr}T${hour.toString().padStart(2, '0')}:59:59`
                      );

                      const hourJobs = (jobsByDate[dateStr] || []).filter(j => {
                        const jobStart = new Date(`${j.fecha}T${j.hora}`);
                        const jobEnd = new Date(
                          `${j.fecha_fin || j.fecha}T${j.hora_fin || j.hora}`
                        );
                        // Overlap logic
                        return jobStart <= currentSlotEnd && jobEnd >= currentSlotStart;
                      });

                      return (
                        <div
                          key={`${dayIdx}-${hour}`}
                          className="relative border-r border-b border-gray-50 p-1 min-h-[60px] hover:bg-gray-50/50"
                        >
                          {hourJobs.map(job => (
                            <Link
                              key={job.id}
                              href={`/dashboard/trabajos/${job.id}`}
                              className={`block p-1 mb-1 rounded text-[9px] font-bold text-white shadow-sm ${ESTADO_COLORS[job.estado]}`}
                              title={`${job.hora.slice(0, 5)} - ${(job.hora_fin || '').slice(0, 5)}: ${job.clientes?.nombre}`}
                            >
                              {job.clientes?.nombre}
                            </Link>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Day Details (Reuse existing logic) */}
      {selectedDate && (
        <div
          className="card p-6 bg-white animate-in fade-in slide-in-from-bottom-2"
          data-testid="selected_day_details"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900">
              Instalaciones para el{' '}
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </h3>
            <Link
              href={`/dashboard/trabajos/nuevo?fecha=${selectedDate}`}
              className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-amber-700 transition-colors"
              data-testid="create_job_from_calendar_button"
            >
              + Nueva Instalación
            </Link>
          </div>
          {selectedDayJobs.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No hay instalaciones para este día.</p>
          ) : (
            <div className="space-y-3">
              {selectedDayJobs.map(job => (
                <Link
                  key={job.id}
                  href={`/dashboard/trabajos/${job.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-amber-200 hover:bg-amber-50/50 transition-all group"
                >
                  <span className={`w-3 h-3 rounded-full shrink-0 ${ESTADO_COLORS[job.estado]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {job.clientes?.nombre || 'Sin cliente'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {job.hora.slice(0, 5)} - {(job.hora_fin || '').slice(0, 5)} ·{' '}
                      <span className="capitalize">{job.estado.replace('_', ' ')}</span>
                    </p>
                  </div>
                  <span className="text-slate-300 group-hover:text-amber-600 transition-colors">
                    →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
