'use client';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  const confirmClass =
    variant === 'danger'
      ? 'bg-red-500 hover:bg-red-600 text-white'
      : 'btn-primary';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 max-w-sm w-full mx-4 animate-fade-in">
        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
