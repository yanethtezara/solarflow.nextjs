# Backend Setup - SolarFlow

This document outlines the backend infrastructure for the SolarFlow project, powered by Supabase and Next.js.

## Database Schema

The database is hosted on Supabase (PostgreSQL). The schema is managed via migrations.

**Tables:**
- **`profiles`**: Stores public user data, linked to `auth.users`.
- **`clientes`**: Manages client information for each user.
- **`empresas`**: Manages contracting company information for each user.
- **`trabajos`**: The core table, representing installation jobs. Links clients, companies, and users.
- **`catalogo_items`**: A catalog of materials and labor services for each user.
- **`trabajos_items`**: A junction table linking `trabajos` and `catalogo_items`.

**Row Level Security (RLS):**
- RLS is enabled on all tables.
- Policies are configured to ensure users can only access and modify their own data, based on `user_id = auth.uid()`.

## Authentication

- **Provider:** Supabase Auth handles user registration, login, and session management.
- **Method:** Email/Password authentication is enabled.
- **Session Management:** The `@supabase/ssr` library is used to manage sessions via cookies, with automatic refresh handled by the `proxy.ts` (middleware).
- **Key Files:**
  - `src/contexts/auth-context.tsx`: React context for managing auth state in client components.
  - `proxy.ts`: Middleware for route protection and session refresh.
  - `app/auth/callback/route.ts`: Handles the OAuth callback from Supabase.

## API Layer

- **Framework:** Next.js API Routes are not used for the core database access. Instead, Supabase's auto-generated REST API is used via the client libraries.
- **Supabase Clients:**
  - `src/lib/supabase/client.ts`: Client for browser-side usage.
  - `src/lib/supabase/admin.ts`: Client for server-side admin tasks (bypasses RLS). Used with caution.
- **Configuration:**
  - `src/lib/config.ts`: Centralized configuration for environment variables.
  - `.env`: Stores the actual Supabase credentials.

## Variables de Entorno

- **Strategy:** Environment variables are managed using a `.env` file in the root of the project.
- **How to get them:** Credentials can be found in your Supabase project dashboard under `Settings > API`.
- **Variables:**
  - `NEXT_PUBLIC_SUPABASE_URL`: The URL of your Supabase project.
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The public, anonymous API key.
  - `SUPABASE_SERVICE_ROLE_KEY`: The secret service role key for admin tasks.
  - `NEXT_PUBLIC_APP_URL`: The base URL of your application (e.g., `http://localhost:3000`).

## Comandos Útiles

- **Regenerar tipos de Supabase:**
  ```bash
  npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
  ```
- **Iniciar servidor de desarrollo:**
  ```bash
  npm run dev
  ```
- **Validar build de producción:**
  ```bash
  npm run build
  ```
- **Chequeo de tipos de TypeScript:**
  ```bash
  npx tsc --noEmit
  ```

## Troubleshooting

- **Error: "Cannot find module '@/...'":** Ensure your `tsconfig.json` has the correct `baseUrl` and `paths` configuration for path aliases.
- **Error: "Environment variables missing":** Make sure you have a `.env` file with the correct variables, and that you have restarted the development server after creating/modifying it.
- **Build Fails due to CommonJS/ESM conflict:** Rename `.js` config files (like `postcss.config.js`) to `.cjs`.

## Próximos Pasos

- Implement the UI for managing clients, companies, jobs, and the catalog.
- Connect the frontend components to the database using the Supabase client.
- Implement the "intelligent seed data" once a user can be created.
