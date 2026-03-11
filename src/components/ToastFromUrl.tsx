'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Toast from './Toast';

const MESSAGES: Record<string, string> = {
  cliente_creado: 'Cliente creado correctamente.',
  cliente_actualizado: 'Cliente actualizado correctamente.',
  cliente_eliminado: 'Cliente eliminado correctamente.',
  empresa_creada: 'Empresa creada correctamente.',
  empresa_actualizada: 'Empresa actualizada correctamente.',
  empresa_eliminada: 'Empresa eliminada correctamente.',
  item_creado: 'Ítem del catálogo creado correctamente.',
  item_actualizado: 'Ítem del catálogo actualizado correctamente.',
  item_eliminado: 'Ítem del catálogo eliminado correctamente.',
  servicio_creado: 'Servicio creado correctamente.',
  material_creado: 'Material creado correctamente.',
};

export default function ToastFromUrl() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = searchParams.get('toast');
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const clearToast = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete('toast');
    router.replace(url.pathname, { scroll: false });
    setMessage(null);
    setVisible(false);
  }, [router]);

  useEffect(() => {
    if (toast && MESSAGES[toast]) {
      setMessage(MESSAGES[toast]);
      setVisible(true);
    }
  }, [toast]);

  if (!message) return null;

  return <Toast message={message} visible={visible} onHide={clearToast} duration={3000} />;
}
