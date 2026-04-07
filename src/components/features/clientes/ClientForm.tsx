'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

// Schema de Zod según implementation-plan.md
const clientSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  telefono: z.string().min(1, 'El teléfono es obligatorio'),
  direccion: z.string().optional().nullable(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  initialData?: Partial<ClientFormData>;
  onSubmit: (data: ClientFormData) => Promise<void>;
  onDelete?: () => void;
  loading?: boolean;
  error?: string | null;
}

export function ClientForm({
  initialData,
  onSubmit,
  onDelete,
  loading = false,
  error = null,
}: ClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    nombre: initialData?.nombre || '',
    telefono: initialData?.telefono || '',
    direccion: initialData?.direccion || '',
  });
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof ClientFormData, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error de validación cuando el usuario escribe
    if (validationErrors[name as keyof ClientFormData]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    const result = clientSchema.safeParse(formData);
    if (!result.success) {
      const errors: Partial<Record<keyof ClientFormData, string>> = {};
      result.error.issues.forEach(err => {
        if (err.path[0]) {
          errors[err.path[0] as keyof ClientFormData] = err.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    await onSubmit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4" data-testid="clientForm">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <Input
          name="nombre"
          value={formData.nombre || ''}
          onChange={handleChange}
          data-testid="nombre_input"
          placeholder="Ej: Juan Pérez"
          className={validationErrors.nombre ? 'border-red-500' : ''}
        />
        {validationErrors.nombre && (
          <p className="text-red-600 text-xs mt-1" data-testid="nombre_error">
            {validationErrors.nombre}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
        <Input
          name="direccion"
          value={formData.direccion || ''}
          onChange={handleChange}
          data-testid="direccion_input"
          placeholder="Ej: Calle Principal 123"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
        <Input
          name="telefono"
          type="tel"
          value={formData.telefono || ''}
          onChange={handleChange}
          data-testid="telefono_input"
          placeholder="Ej: +34 600 123 456"
          className={validationErrors.telefono ? 'border-red-500' : ''}
        />
        {validationErrors.telefono && (
          <p className="text-red-600 text-xs mt-1" data-testid="telefono_error">
            {validationErrors.telefono}
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
          data-testid="submit_button"
          className="btn-primary flex-1 sm:flex-none"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>

        {onDelete && (
          <Button
            type="button"
            onClick={onDelete}
            disabled={loading}
            data-testid="delete_button"
            className="bg-red-500 text-white hover:bg-red-600 flex-1 sm:flex-none"
          >
            Eliminar
          </Button>
        )}

        <Link
          href="/dashboard/clientes"
          className="btn-secondary flex-1 sm:flex-none flex items-center justify-center"
          data-testid="cancel_link"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
