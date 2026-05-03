'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Schema de Zod según implementation-plan.md
const jobSchema = z
  .object({
    cliente_id: z.string().uuid('Selecciona un cliente'),
    empresa_id: z.string().uuid().optional().nullable(),
    fecha: z.string().min(1, 'La fecha es obligatoria'),
    hora: z.string().min(1, 'La hora es obligatoria'),
    fecha_fin: z.string().min(1, 'La fecha de fin es obligatoria'),
    hora_fin: z.string().min(1, 'La hora de fin es obligatoria'),
    ubicacion: z.string().min(1, 'La ubicación es obligatoria'),
  })
  .refine(
    data => {
      const start = new Date(`${data.fecha}T${data.hora}`);
      const end = new Date(`${data.fecha_fin}T${data.hora_fin}`);
      return end > start;
    },
    {
      message: 'La fecha y hora de fin deben ser posteriores al inicio',
      path: ['fecha_fin'],
    }
  );

type JobFormData = z.infer<typeof jobSchema>;

type Cliente = { id: string; nombre: string; direccion: string | null };
type Empresa = { id: string; nombre: string };

type JobCreationFormProps = {
  initialData?: {
    cliente_id: string;
    empresa_id: string | null;
    fecha: string;
    hora: string;
    fecha_fin: string | null;
    hora_fin: string | null;
    ubicacion: string | null;
  };
  trabajoId?: string;
};

export default function JobCreationForm({ initialData, trabajoId }: JobCreationFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fechaParam = searchParams.get('fecha');

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  const [formData, setFormData] = useState({
    cliente_id: initialData?.cliente_id || '',
    empresa_id: initialData?.empresa_id || '',
    fecha: initialData?.fecha || fechaParam || '',
    hora: initialData?.hora ? initialData.hora.slice(0, 5) : '09:00',
    fecha_fin: initialData?.fecha_fin || initialData?.fecha || fechaParam || '',
    hora_fin: initialData?.hora_fin ? initialData.hora_fin.slice(0, 5) : '11:00',
    ubicacion: initialData?.ubicacion || '',
  });
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof JobFormData, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!trabajoId;

  useEffect(() => {
    const load = async () => {
      const [clientsRes, empsRes] = await Promise.all([
        fetch('/api/clientes'),
        fetch('/api/empresas'),
      ]);
      if (clientsRes.ok) {
        const c = await clientsRes.json();
        setClientes(c);
      }
      if (empsRes.ok) {
        const e = await empsRes.json();
        setEmpresas(e);
      }
    };
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Lógica de sugerencia de ubicación
    if (name === 'cliente_id' && value && !isEdit) {
      const selectedClient = clientes.find(c => c.id === value);
      if (selectedClient?.direccion) {
        setFormData(prev => ({ ...prev, ubicacion: selectedClient.direccion || '' }));
      }
    }

    if (validationErrors[name as keyof JobFormData]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setError(null);

    const result = jobSchema.safeParse({
      ...formData,
      empresa_id: formData.empresa_id || null,
    });

    if (!result.success) {
      const errors: Partial<Record<keyof JobFormData, string>> = {};
      result.error.issues.forEach(err => {
        if (err.path[0]) {
          errors[err.path[0] as keyof JobFormData] = err.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    setLoading(true);

    const url = isEdit ? `/api/trabajos/${trabajoId}` : '/api/trabajos';
    const method = isEdit ? 'PUT' : 'POST';
    const body = {
      ...result.data,
      hora: result.data.hora.length === 5 ? result.data.hora : `${result.data.hora}:00`,
      hora_fin:
        result.data.hora_fin.length === 5 ? result.data.hora_fin : `${result.data.hora_fin}:00`,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error?.message || 'Error al guardar la instalación');
      }

      const toast = isEdit ? 'trabajo_actualizado' : 'trabajo_creado';
      router.push(
        isEdit
          ? `/dashboard/trabajos/${trabajoId}?toast=${toast}`
          : `/dashboard/trabajos?toast=${toast}`
      );
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card p-4 sm:p-6 space-y-4"
      data-testid="jobCreationForm"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
        <select
          name="cliente_id"
          value={formData.cliente_id}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 min-h-[44px] ${
            validationErrors.cliente_id ? 'border-red-500' : ''
          }`}
          data-testid="cliente_select"
        >
          <option value="">Seleccionar cliente</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        {validationErrors.cliente_id && (
          <p className="text-red-600 text-xs mt-1" data-testid="cliente_error">
            {validationErrors.cliente_id}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Empresa (opcional)</label>
        <select
          name="empresa_id"
          value={formData.empresa_id}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 min-h-[44px]"
          data-testid="empresa_select"
        >
          <option value="">Sin empresa</option>
          {empresas.map(e => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Inicio *</label>
          <Input
            name="fecha"
            type="date"
            value={formData.fecha}
            onChange={handleChange}
            className={validationErrors.fecha ? 'border-red-500' : ''}
            data-testid="fecha_input"
          />
          {validationErrors.fecha && (
            <p className="text-red-600 text-xs mt-1" data-testid="fecha_error">
              {validationErrors.fecha}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Hora Inicio *</label>
          <Input
            name="hora"
            type="time"
            value={formData.hora}
            onChange={handleChange}
            className={validationErrors.hora ? 'border-red-500' : ''}
            data-testid="hora_input"
          />
          {validationErrors.hora && (
            <p className="text-red-600 text-xs mt-1" data-testid="hora_error">
              {validationErrors.hora}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Fin *</label>
          <Input
            name="fecha_fin"
            type="date"
            value={formData.fecha_fin}
            onChange={handleChange}
            className={validationErrors.fecha_fin ? 'border-red-500' : ''}
            data-testid="fecha_fin_input"
          />
          {validationErrors.fecha_fin && (
            <p className="text-red-600 text-xs mt-1" data-testid="fecha_fin_error">
              {validationErrors.fecha_fin}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Hora Fin *</label>
          <Input
            name="hora_fin"
            type="time"
            value={formData.hora_fin}
            onChange={handleChange}
            className={validationErrors.hora_fin ? 'border-red-500' : ''}
            data-testid="hora_fin_input"
          />
          {validationErrors.hora_fin && (
            <p className="text-red-600 text-xs mt-1" data-testid="hora_fin_error">
              {validationErrors.hora_fin}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación *</label>
        <Input
          name="ubicacion"
          type="text"
          value={formData.ubicacion}
          onChange={handleChange}
          placeholder="Dirección exacta de la obra..."
          className={validationErrors.ubicacion ? 'border-red-500' : ''}
          data-testid="ubicacion_input"
        />
        {validationErrors.ubicacion && (
          <p className="text-red-600 text-xs mt-1" data-testid="ubicacion_error">
            {validationErrors.ubicacion}
          </p>
        )}
      </div>

      {error && (
        <p className="text-red-600 text-sm" data-testid="form_error">
          {error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1 sm:flex-none"
          data-testid="submit_button"
        >
          {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear instalación'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          className="flex-1 sm:flex-none"
          data-testid="cancel_button"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
