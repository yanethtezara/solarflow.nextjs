'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';

const forgotSchema = z.object({
  email: z.string().email('Ingresa un correo electrónico válido'),
});

type ForgotValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);
  const { resetPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotValues) => {
    setError(null);
    const { error: resetError } = await resetPassword(data.email);

    if (resetError) {
      if (resetError.message.includes('Email rate limit exceeded')) {
        setError(
          'Has solicitado demasiados correos. Por seguridad, espera unos minutos e inténtalo de nuevo.'
        );
      } else {
        setError(resetError.message);
      }
    } else {
      setIsSent(true);
    }
  };

  if (isSent) {
    return (
      <div className="text-center space-y-4 animate-fade-in" data-testid="success_message">
        <div className="bg-amber-50 text-amber-800 p-4 rounded-lg text-sm border border-amber-100">
          <p className="font-bold">¡Email enviado!</p>
          <p className="mt-1">
            Si el correo existe en nuestra base, recibirás un enlace para restablecer tu clave en
            unos minutos.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-block text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors"
        >
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="forgotPasswordForm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
            Email
          </label>
          <input
            {...register('email')}
            id="email"
            type="email"
            placeholder="tu-email@ejemplo.com"
            data-testid="email_input"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 ${
              errors.email ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600" data-testid="email_error">
              {errors.email.message}
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
              Enviando...
            </span>
          ) : (
            'Enviar enlace de recuperación'
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
