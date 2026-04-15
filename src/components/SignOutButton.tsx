'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import Toast from './Toast';

export default function SignOutButton() {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await signOut();

    if (!error) {
      setShowToast(true);
      // La redirección ocurre en el AuthContext o Middleware,
      // pero el Toast da feedback antes del desmontaje total.
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={handleSignOut}
        disabled={loading}
        data-testid="signout_button"
        className="w-full px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-red-400 transition-colors duration-200 text-left min-h-[44px] flex items-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4 text-slate-400" viewBox="0 0 24 24">
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
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        )}
        {loading ? 'Saliendo...' : 'Cerrar sesión'}
      </button>

      <Toast
        message="Sesión cerrada con éxito. ¡Vuelve pronto!"
        visible={showToast}
        onHide={() => setShowToast(false)}
      />
    </>
  );
}
