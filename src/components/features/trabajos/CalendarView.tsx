'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Trabajo = {
  id: string;
  fecha: string;
  hora: string;
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

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [jobs, setJobs] = useState<Trabajo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const daysInMonth = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    // Adjust for Monday start (0=Sun, 1=Mon... -> 0=Mon, 6=Sun)
    let startDay = firstDay.getDay() - 1;
    if (startDay === -1) startDay = 6;

    // Days from prev month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }, [month, year]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const start = new Date(year, month, 1).toISOString().split('T')[0];
      const end = new Date(year, month + 1, 0).toISOString().split('T')[0];

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
      if (!map[job.fecha]) map[job.fecha] = [];
      map[job.fecha].push(job);
    });
    return map;
  }, [jobs]);

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

  const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(currentDate);

  const selectedDayJobs = selectedDate ? jobsByDate[selectedDate] || [] : [];

  return (
    <div className="space-y-6" data-testid="calendarView">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2
          className="text-lg font-bold text-slate-900 capitalize"
          data-testid="calendar_month_year"
        >
          {monthName} {year}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={prevMonth}
            className="px-3"
            data-testid="prev_month_button"
          >
            ←
          </Button>
          <Button
            variant="secondary"
            onClick={() => setCurrentDate(new Date())}
            data-testid="today_button"
          >
            Hoy
          </Button>
          <Button
            variant="secondary"
            onClick={nextMonth}
            className="px-3"
            data-testid="next_month_button"
          >
            →
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                className={`min-h-[100px] p-2 border-r border-b border-gray-100 cursor-pointer transition-colors hover:bg-amber-50/30 ${
                  isSelected ? 'bg-amber-50' : ''
                }`}
                data-testid={`calendar_day_${dateStr}`}
              >
                <div className="flex justify-between items-start">
                  <span
                    className={`text-sm font-medium ${isToday ? 'bg-amber-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-700'}`}
                  >
                    {date.getDate()}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  {dayJobs.slice(0, 3).map(job => (
                    <div
                      key={job.id}
                      className={`h-1.5 w-full rounded-full ${ESTADO_COLORS[job.estado] || 'bg-gray-200'}`}
                      title={`${job.hora} - ${job.clientes?.nombre}`}
                    />
                  ))}
                  {dayJobs.length > 3 && (
                    <p className="text-[10px] text-slate-400 font-bold text-center">
                      +{dayJobs.length - 3} más
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div
          className="card p-6 bg-white animate-in fade-in slide-in-from-bottom-2"
          data-testid="selected_day_details"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900">
              Trabajos para el{' '}
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
              + Nuevo Trabajo
            </Link>
          </div>

          {selectedDayJobs.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No hay trabajos para este día.</p>
          ) : (
            <div className="space-y-3">
              {selectedDayJobs.map(job => (
                <Link
                  key={job.id}
                  href={`/dashboard/trabajos/${job.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-amber-200 hover:bg-amber-50/50 transition-all group"
                  data-testid="calendar_job_item"
                >
                  <span className={`w-3 h-3 rounded-full shrink-0 ${ESTADO_COLORS[job.estado]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {job.clientes?.nombre || 'Sin cliente'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {job.hora.slice(0, 5)} ·{' '}
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
