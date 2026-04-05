'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SignOutButton from './SignOutButton';
import SunLogo from './SunLogo';

const navLinks = [
  { href: '/dashboard', label: 'Inicio' },
  { href: '/dashboard/clientes', label: 'Clientes' },
  { href: '/dashboard/empresas', label: 'Empresas' },
  { href: '/dashboard/trabajos', label: 'Trabajos' },
  { href: '/dashboard/calendario', label: 'Calendario' },
  { href: '/dashboard/catalogo', label: 'Catálogo' },
];

export default function DashboardShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700">
        <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
          <SunLogo size={28} className="text-amber-500 flex-shrink-0" />
          <span className="text-lg font-black tracking-tight text-amber-500 uppercase truncate">
            SolarFlow
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="p-2 -mr-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Abrir menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </header>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - hidden on mobile, drawer when open */}
      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-50 w-64 bg-slate-900 flex flex-col shadow-xl
          transform transition-transform duration-200 ease-out
          md:transform-none md:shadow-lg
          ${menuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
            <SunLogo size={36} className="text-amber-500 flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-xl font-black tracking-tight text-amber-500 uppercase">
                SolarFlow
              </h1>
              <p className="text-xs text-slate-400 truncate mt-1">{userEmail}</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="md:hidden p-2 -mr-2 text-slate-400 hover:text-white rounded-lg"
            aria-label="Cerrar menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-lg transition-colors duration-200 min-h-[44px] flex items-center ${
                pathname === link.href
                  ? 'bg-slate-800 text-amber-400'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-amber-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <SignOutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gray-50 min-h-[100dvh] md:min-h-0">{children}</main>
    </div>
  );
}
