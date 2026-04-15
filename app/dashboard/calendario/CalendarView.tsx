'use client';

import { useState } from 'react';
import Link from 'next/link';

type Trabajo = {
  id: string;
  fecha: string;
  hora: string;
  estado: string;
  clienteNombre: string;
};

type CalendarViewProps = {
  initialTrabajos: Trabajo[];
};

export default function CalendarView({ initialTrabajos }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Ajustar para que lunes sea 0 (0: Lunes, 1: Martes, ..., 6: Domingo)
  const startingDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const getTrabajosForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return initialTrabajos.filter(t => t.fecha === dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const renderDays = () => {
    const totalSlots = [];
    // Espacios vacíos para el inicio del mes
    for (let i = 0; i < startingDayIndex; i++) {
      totalSlots.push(
        <div key={`empty-${i}`} className="h-24 sm:h-32 bg-gray-50/50 border border-gray-100" />
      );
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const trabajosDelDia = getTrabajosForDay(day);
      totalSlots.push(
        <div
          key={day}
          className={`h-24 sm:h-32 border border-gray-100 p-1 sm:p-2 overflow-y-auto transition-colors ${
            isToday(day) ? 'bg-amber-50/30' : 'bg-white'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span
              className={`text-xs sm:text-sm font-bold ${
                isToday(day)
                  ? 'text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded'
                  : 'text-slate-500'
              }`}
            >
              {day}
            </span>
            <Link
              href={`/dashboard/trabajos/nuevo?fecha=${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`}
              className="text-[10px] text-slate-300 hover:text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Añadir trabajo"
            >
              +
            </Link>
          </div>
          <div className="space-y-1">
            {trabajosDelDia.map(t => (
              <Link
                key={t.id}
                href={`/dashboard/trabajos/${t.id}`}
                className={`block text-[10px] sm:text-[11px] p-1 rounded border leading-tight truncate ${
                  t.estado === 'completado'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : t.estado === 'cancelado'
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : t.estado === 'en_progreso'
                        ? 'bg-amber-50 border-amber-200 text-amber-700'
                        : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}
                title={`${t.hora.slice(0, 5)} - ${t.clienteNombre}`}
              >
                <span className="font-bold mr-1">{t.hora.slice(0, 5)}</span>
                {t.clienteNombre}
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return totalSlots;
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-slate-900">
          {monthNames[month]} {year}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg text-slate-600 transition-colors"
            aria-label="Mes anterior"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-xs font-medium text-amber-600 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors"
          >
            Hoy
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg text-slate-600 transition-colors"
            aria-label="Siguiente mes"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
        {daysOfWeek.map(day => (
          <div
            key={day}
            className="py-2 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 group">{renderDays()}</div>

      <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-4">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Agendado
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> En Progreso
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Completado
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Cancelado
        </div>
      </div>
    </div>
  );
}
