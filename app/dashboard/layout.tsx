import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import SunLogo from '@/components/SunLogo';
import { Database } from '@/types/supabase';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const navLinks = [
    { href: '/dashboard', label: 'Inicio' },
    { href: '/dashboard/clientes', label: 'Clientes' },
    { href: '/dashboard/empresas', label: 'Empresas' },
    { href: '/dashboard/trabajos', label: 'Trabajos' },
    { href: '/dashboard/catalogo', label: 'Catálogo' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar - Industrial (slate-900) */}
      <aside className="w-64 bg-slate-900 flex flex-col shadow-lg">
        <div className="p-4 border-b border-slate-700">
          <Link href="/dashboard" className="flex items-center gap-3">
            <SunLogo size={36} className="text-amber-500 flex-shrink-0" />
            <div>
              <h1 className="text-xl font-black tracking-tight text-amber-500 uppercase">SolarFlow</h1>
              <p className="text-xs text-slate-400 truncate mt-1">{user.email}</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-amber-400 transition-colors duration-200"
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
      <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
    </div>
  );
}
