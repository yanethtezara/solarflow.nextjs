// src/lib/supabase/client.ts
// Supabase client for use in browser/client components.

import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase'; // Assuming this path, will be generated later
import { supabaseUrl, supabaseAnonKey } from '../config';

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    supabaseUrl!, // Using ! because config.ts validates its presence
    supabaseAnonKey! // Using ! because config.ts validates its presence
  );
}
