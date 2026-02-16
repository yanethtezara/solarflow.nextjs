// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { supabaseUrl, supabaseAnonKey } from './src/lib/config';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl!, // Using ! because config.ts validates its presence
    supabaseAnonKey!, // Using ! because config.ts validates its presence
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Refresh session if expired - this will update the cookie and suppress the warning
  // from Next.js about cookies being read after a write.
  await supabase.auth.getSession();

  // Route protection logic
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define protected routes (adjust as needed for your application)
  // For now, let's assume '/dashboard' is a protected route.
  const protectedRoutes = ['/dashboard', '/clientes', '/empresas', '/trabajos', '/catalogo'];

  if (!user && protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    // Redirect unauthenticated users from protected routes to login
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname); // Optional: add redirect param
    return NextResponse.redirect(redirectUrl);
  }

  // If a user is logged in and tries to access /login or /signup, redirect them to a main page
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/'; // Or a specific authenticated home page
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /api/auth/callback (Supabase auth callback route)
     * - any other public routes you might have (e.g., '/', '/about', '/contact')
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth/callback|login|signup).*)',
  ],
};
