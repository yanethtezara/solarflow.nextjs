'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type CatalogoItem = {
  id: string;
  nombre: string;
  tipo: string;
  precio: number;
};

type AddItemToJobFormProps = {
  trabajoId: string;
  existingItemIds: string[];
};

export default function AddItemToJobForm({ trabajoId, existingItemIds }: AddItemToJobFormProps) {
  const router = useRouter();
  const [items, setItems] = useState<CatalogoItem[]>([]);
  const [itemId, setItemId] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/catalogo-items')
      .then(res => (res.ok ? res.json() : []))
      .then((data: CatalogoItem[]) => {
        setItems(data);
        if (data.length && !itemId) setItemId(data[0].id);
      });
  }, []); // Cargar una vez al inicio

  const availableItems = items; // Mostrar todos los ítems del catálogo

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/trabajos/${trabajoId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id: itemId, cantidad }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data?.error?.message || 'Error al agregar');
      return;
    }

    setCantidad(1);
    if (availableItems.length > 1) {
      setItemId(availableItems.find(i => i.id !== itemId)?.id || '');
    }
    router.refresh();
  };

  if (availableItems.length === 0) {
    return (
      <div
        className="card p-4 bg-amber-50 border border-amber-200"
        data-testid="no_available_items"
      >
        <p className="text-amber-800 text-sm">
          No hay ítems disponibles en el catálogo o ya agregaste todos. Crea materiales o servicios
          en{' '}
          <a href="/dashboard/catalogo/nuevo" className="underline font-medium">
            Catálogo
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card p-4 flex flex-col sm:flex-row flex-wrap sm:items-end gap-4"
      data-testid="addItemToJobForm"
    >
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-medium text-gray-600 mb-1">Ítem</label>
        <select
          value={itemId}
          onChange={e => setItemId(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 min-h-[44px]"
          data-testid="item_select"
        >
          <optgroup label="Mano de obra">
            {availableItems
              .filter(i => i.tipo === 'mano_de_obra')
              .map(i => (
                <option key={i.id} value={i.id}>
                  {i.nombre} — ${Number(i.precio).toFixed(2)}
                </option>
              ))}
          </optgroup>
          <optgroup label="Materiales">
            {availableItems
              .filter(i => i.tipo === 'material')
              .map(i => (
                <option key={i.id} value={i.id}>
                  {i.nombre} — ${Number(i.precio).toFixed(2)}
                </option>
              ))}
          </optgroup>
        </select>
      </div>
      <div className="w-24">
        <label className="block text-xs font-medium text-gray-600 mb-1">Cantidad</label>
        <input
          type="number"
          min={1}
          value={cantidad}
          onChange={e => setCantidad(Math.max(1, parseInt(e.target.value, 10) || 1))}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 min-h-[44px]"
          data-testid="item_quantity_input"
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="min-h-[44px] flex-1 sm:flex-none"
        data-testid="add_item_button"
      >
        {loading ? 'Agregando...' : 'Agregar ítem'}
      </Button>
      {error && (
        <p className="text-red-600 text-sm w-full" data-testid="add_item_error">
          {error}
        </p>
      )}
    </form>
  );
}
