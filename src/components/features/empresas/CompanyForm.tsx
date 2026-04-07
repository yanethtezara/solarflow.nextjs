'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

// Schema de Zod según implementation-plan.md
const companySchema = z.object({
  nombre: z.string().min(1, 'El nombre de la empresa es obligatorio'),
  contacto_responsable: z.string().optional().nullable(),
  telefono_contacto: z.string().min(1, 'El teléfono de contacto es obligatorio'),
  direccion: z.string().optional().nullable(),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyFormProps {
  initialData?: Partial<CompanyFormData>;
  onSubmit: (data: CompanyFormData) => Promise<void>;
  onDelete?: () => void;
  loading?: boolean;
  error?: string | null;
}

export function CompanyForm({
  initialData,
  onSubmit,
  onDelete,
  loading = false,
  error = null,
}: CompanyFormProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    nombre: initialData?.nombre || '',
    contacto_responsable: initialData?.contacto_responsable || '',
    telefono_contacto: initialData?.telefono_contacto || '',
    direccion: initialData?.direccion || '',
  });
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof CompanyFormData, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error de validación cuando el usuario escribe
    if (validationErrors[name as keyof CompanyFormData]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    const result = companySchema.safeParse(formData);
    if (!result.success) {
      const errors: Partial<Record<keyof CompanyFormData, string>> = {};
      result.error.issues.forEach(err => {
        if (err.path[0]) {
          errors[err.path[0] as keyof CompanyFormData] = err.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    await onSubmit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4" data-testid="companyForm">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Empresa *</label>
        <Input
          name="nombre"
          value={formData.nombre || ''}
          onChange={handleChange}
          data-testid="nombre_input"
          placeholder="Ej: Empresa Solar S.A."
          className={validationErrors.nombre ? 'border-red-500' : ''}
        />
        {validationErrors.nombre && (
          <p className="text-red-600 text-xs mt-1" data-testid="nombre_error">
            {validationErrors.nombre}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contacto Responsable</label>
        <Input
          name="contacto_responsable"
          value={formData.contacto_responsable || ''}
          onChange={handleChange}
          data-testid="contacto_responsable_input"
          placeholder="Ej: David Rojas"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono de Contacto *
        </label>
        <Input
          name="telefono_contacto"
          type="tel"
          value={formData.telefono_contacto || ''}
          onChange={handleChange}
          data-testid="telefono_contacto_input"
          placeholder="Ej: +34 600 123 456"
          className={validationErrors.telefono_contacto ? 'border-red-500' : ''}
        />
        {validationErrors.telefono_contacto && (
          <p className="text-red-600 text-xs mt-1" data-testid="telefono_contacto_error">
            {validationErrors.telefono_contacto}
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
          placeholder="Ej: Polígono Industrial Norte, Nave 4"
        />
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
            variant="danger"
            className="flex-1 sm:flex-none"
          >
            Eliminar
          </Button>
        )}

        <Link
          href="/dashboard/empresas"
          className="btn-secondary flex-1 sm:flex-none flex items-center justify-center"
          data-testid="cancel_link"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
