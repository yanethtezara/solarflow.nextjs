# API Authentication - SolarFlow

This document explains the authentication and authorization mechanisms for the SolarFlow project.

## Métodos de Autenticación

- **Supabase Auth:** The primary authentication provider, using JWT-based sessions managed via cookies.
- **Flujo de autenticación:**
  1. **Signup:** User registers with email and password. Supabase sends a confirmation email.
  2. **Login:** User logs in with credentials. Supabase returns a session (access and refresh tokens).
  3. **Session Management:** The `@supabase/ssr` library handles storing tokens in cookies and automatically refreshing the session.

## Para Desarrolladores

### Acceder al usuario autenticado

**En Server Components / API Routes:**
Use the server client to get the authenticated user from the session cookie.

```typescript
// Example in a Server Component or API Route
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const cookieStore = await cookies();
const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { /* ... */ } });
const { data: { user } } = await supabase.auth.getUser();

if (user) {
  // User is authenticated
}
```

**En Client Components:**
Use the `useAuth` hook provided by `AuthContext`.

```typescript
// Example in a Client Component
'use client';
import { useAuth } from '@/contexts/auth-context';

const { user, loading } = useAuth();

if (loading) {
  return <p>Loading...</p>;
}

if (user) {
  // User is authenticated
}
```

### Proteger Endpoints

- **Middleware (`proxy.ts`):** The primary mechanism for protecting routes. It checks for a valid session and redirects unauthenticated users from protected pages.
- **Row Level Security (RLS):** The ultimate source of truth for data access. Even if the middleware were bypassed, RLS policies at the database level prevent unauthorized data access. Every query is automatically filtered by `user_id`.

## Para QA/Testing

### Autenticación al Probar

- **Frontend:** To test protected routes, you must first log in through the `/login` page. This will set the necessary session cookies.
- **API (Postman/Insomnia):** Direct API testing is not the primary method since we use the Supabase client library. However, if you need to test a Next.js API route, you must:
  1. Log in via the web application.
  2. Open browser DevTools (Application > Cookies).
  3. Copy the `sb-*` cookies for your site.
  4. Include these cookies in your API requests from Postman.

## Consideraciones de Seguridad

- **RLS is always enforced:** All tables have RLS enabled.
- **NEVER expose `SUPABASE_SERVICE_ROLE_KEY` to the client:** This key bypasses all RLS policies and should only be used in secure server environments for specific admin tasks.
- **Validate data on the server:** Always validate input in API routes and Server Actions, even if it's already validated on the client.
