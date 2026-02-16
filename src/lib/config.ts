// src/lib/config.ts
// Centralized configuration for Supabase environment variables.

// Ensure NEXT_PUBLIC_SUPABASE_URL is always accessed directly for static analysis in Next.js.
// Do NOT use dynamic access like process.env[variableName] for NEXT_PUBLIC_ variables.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// SUPABASE_SERVICE_ROLE_KEY should ONLY be used on the server side (e.g., in API routes or server components).
// It should NEVER be exposed to the client-side.
export const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const appUrl = process.env.NEXT_PUBLIC_APP_URL;

// --- Validations ---
// Throw an error if essential environment variables are not set.
// This helps prevent runtime errors due to missing configuration.

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Note: supabaseServiceRoleKey is not validated here as it's optional for client-side builds
// and might not be present in all environments (e.g., Vercel's Edge functions might not need it).
// Its presence should be validated explicitly where it's used if it's critical for a specific server-side operation.

// Optional: Log environment variables during development for debugging purposes.
// Be cautious about what you log in production.
if (process.env.NODE_ENV !== 'production') {
  console.log('--- Supabase Config Loaded (Development) ---');
  console.log(`Supabase URL: ${supabaseUrl ? 'Loaded' : 'MISSING'}`);
  console.log(`Supabase Anon Key: ${supabaseAnonKey ? 'Loaded' : 'MISSING'}`);
  console.log(`Supabase Service Role Key: ${supabaseServiceRoleKey ? 'Loaded' : 'MISSING'}`);
  console.log(`App URL: ${appUrl ? 'Loaded' : 'MISSING'}`);
  console.log('-------------------------------------------');
}

