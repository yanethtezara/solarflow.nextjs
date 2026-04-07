'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

// Schema de Zod según implementation-plan.md
const catalogoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  tipo: z.enum(['mano_de_obra', 'material']),
  precio: z.number().min(0, 'El precio/costo debe ser mayor o igual a 0'),
});

type CatalogoFormData = z.infer<typeof catalogoSchema>;

interface CatalogoFormProps {
  initialData?: Partial<CatalogoFormData>;
  onSubmit: (data: CatalogoFormData) => Promise<void>;
  onDelete?: () => void;
  loading?: boolean;
  error?: string | null;
}

export function CatalogoForm({
  initialData,
  onSubmit,
  onDelete,
  loading = false,
  error = null,
}: CatalogoFormProps) {
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    tipo: initialData?.tipo || 'mano_de_obra',
    precio: initialData?.precio !== undefined ? String(initialData.precio) : '',
  });
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof CatalogoFormData, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name as keyof CatalogoFormData]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    const precioNum = parseFloat(formData.precio.replace(',', '.'));

    const result = catalogoSchema.safeParse({
      ...formData,
      precio: precioNum,
    });

    if (!result.success) {
      const errors: Partial<Record<keyof CatalogoFormData, string>> = {};
      result.error.issues.forEach(err => {
        if (err.path[0]) {
          errors[err.path[0] as keyof CatalogoFormData] = err.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    await onSubmit(result.data);
  };

  const labelPrecio = formData.tipo === 'mano_de_obra' ? 'Precio (€)' : 'Costo (€)';

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4" data-testid="catalogoForm">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
        <select
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
          data-testid="tipo_select"
        >
          <option value="mano_de_obra">Mano de obra</option>
          <option value="material">Material</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <Input
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          data-testid="nombre_input"
          placeholder={formData.tipo === 'mano_de_obra' ? 'Ej: Instalación' : 'Ej: Panel Solar'}
          className={validationErrors.nombre ? 'border-red-500' : ''}
        />
        {validationErrors.nombre && (
          <p className="text-red-600 text-xs mt-1" data-testid="nombre_error">
            {validationErrors.nombre}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{labelPrecio} *</label>
        <Input
          name="precio"
          value={formData.precio}
          onChange={handleChange}
          data-testid="precio_input"
          inputMode="decimal"
          placeholder="0.00"
          className={validationErrors.precio ? 'border-red-500' : ''}
        />
        {validationErrors.precio && (
          <p className="text-red-600 text-xs mt-1" data-testid="precio_error">
            {validationErrors.precio}
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
            variant="danger"
            className="flex-1 sm:flex-none"
          >
            Eliminar
          </Button>
        )}

        <Link
          href="/dashboard/catalogo"
          className="btn-secondary flex-1 sm:flex-none flex items-center justify-center"
          data-testid="cancel_link"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
