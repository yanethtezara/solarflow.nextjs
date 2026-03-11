// src/components/SignOutButton.tsx
'use client';

import { useAuth } from '@/contexts/auth-context';

export default function SignOutButton() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <button
      onClick={handleSignOut}
      className="w-full px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-red-400 transition-colors duration-200 text-left min-h-[44px] flex items-center"
    >
      Cerrar sesión
    </button>
  );
}
