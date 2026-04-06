'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

const resetSchema = z
  .object({
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'La confirmación es requerida'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type ResetValues = z.infer<typeof resetSchema>;

export default function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSent] = useState(false);
  const { updatePassword } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetValues) => {
    setError(null);
    const { error: updateError } = await updatePassword(data.password);

    if (updateError) {
      setError(updateError.message);
    } else {
      setIsSent(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-4 animate-fade-in" data-testid="success_message">
        <div className="bg-green-50 text-green-800 p-4 rounded-lg text-sm border border-green-100">
          <p className="font-bold">¡Contraseña actualizada!</p>
          <p className="mt-1">
            Tu clave ha sido cambiada con éxito. Serás redirigido al inicio de sesión en unos
            segundos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="resetPasswordForm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
            Nueva Contraseña
          </label>
          <input
            {...register('password')}
            id="password"
            type="password"
            placeholder="••••••"
            data-testid="password_input"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 ${
              errors.password ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600" data-testid="password_error">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-slate-700 mb-1"
            htmlFor="confirmPassword"
          >
            Confirmar Contraseña
          </label>
          <input
            {...register('confirmPassword')}
            id="confirmPassword"
            type="password"
            placeholder="••••••"
            data-testid="confirm_password_input"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600" data-testid="confirm_password_error">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          data-testid="submit_button"
          className="btn-primary w-full flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Guardando...
            </span>
          ) : (
            'Actualizar contraseña'
          )}
        </button>
      </form>

      {error && (
        <div
          className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 text-center animate-fade-in"
          data-testid="form_error"
        >
          {error}
        </div>
      )}
    </div>
  );
}
