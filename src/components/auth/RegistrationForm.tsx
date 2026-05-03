'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Toast from '@/components/Toast';

const signupSchema = z.object({
  nombre_completo: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre es demasiado largo'),
  telefono: z
    .string()
    .min(6, 'El teléfono debe tener al menos 6 caracteres')
    .max(20, 'El teléfono es demasiado largo'),
  email: z
    .string()
    .email('Ingresa un correo electrónico válido')
    .max(254, 'El email es demasiado largo'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type SignupValues = z.infer<typeof signupSchema>;

export default function RegistrationForm() {
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: SignupValues) => {
    setError(null);
    const { error: signUpError } = await signUp(data.email, data.password, {
      nombre_completo: data.nombre_completo,
      telefono: data.telefono,
    });

    if (signUpError) {
      if (signUpError.message.includes('rate limit') || signUpError.status === 429) {
        setError(
          'Has realizado demasiados intentos. Por favor, espera unos minutos antes de intentar de nuevo por seguridad.'
        );
      } else {
        setError(signUpError.message);
      }
    } else {
      setShowToast(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    }
  };

  return (
    <div className="space-y-6" data-testid="registrationForm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-slate-700 mb-1"
            htmlFor="nombre_completo"
          >
            Nombre Completo
          </label>
          <input
            {...register('nombre_completo')}
            id="nombre_completo"
            type="text"
            placeholder="Juan Pérez"
            data-testid="name_input"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 ${
              errors.nombre_completo ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {errors.nombre_completo && (
            <p className="mt-1 text-xs text-red-600" data-testid="name_error">
              {errors.nombre_completo.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="telefono">
            Teléfono de Contacto
          </label>
          <input
            {...register('telefono')}
            id="telefono"
            type="tel"
            placeholder="+1 234 567 890"
            data-testid="phone_input"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 ${
              errors.telefono ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {errors.telefono && (
            <p className="mt-1 text-xs text-red-600" data-testid="phone_error">
              {errors.telefono.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
            Email
          </label>
          <input
            {...register('email')}
            id="email"
            type="email"
            placeholder="ejemplo@solarflow.com"
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

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
            Contraseña
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
              Creando cuenta...
            </span>
          ) : (
            'Crear mi cuenta'
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

      <Toast
        message="¡Bienvenido a SolarFlow! Tu cuenta ha sido creada."
        visible={showToast}
        onHide={() => setShowToast(false)}
      />
    </div>
  );
}
