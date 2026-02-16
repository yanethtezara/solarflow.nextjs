// src/lib/supabase/admin.ts
// Supabase client for admin actions that require bypassing RLS.

import { createServerClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';
import { supabaseUrl, supabaseServiceRoleKey } from '../config';

export function createSupabaseServiceRoleClient() {
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY');
  }

  // This client bypasses RLS policies and should ONLY be used in secure server environments.
  return createServerClient<Database>(
    supabaseUrl!,
    supabaseServiceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      // The service role client does not interact with cookies, but the method requires a cookies object.
      cookies: {
        get: () => undefined,
        set: () => {},
        remove: () => {},
      },
    }
  );
}
