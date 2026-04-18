import 'dotenv/config';
import { createServerClient } from '@supabase/ssr';
import { supabaseUrl, supabaseAnonKey } from '../src/lib/config';

async function verifyLogin() {
  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: { get: () => undefined, set: () => {}, remove: () => {} },
  });

  const email = 'javi.test.1776226007869@solarflow.com';
  const password = 'FixedPassword123!';

  console.log(`--- Final Happy Path: Login for SOL-12 ---`);
  console.log(`Attempting login with ${email}...`);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('\x1b[31m%s\x1b[0m', '--- Login FAILED ---');
    console.error('Error Details:', error.message);
  } else if (data.session) {
    console.log('\x1b[32m%s\x1b[0m', '--- Login PASSED ---');
    console.log('Session access_token exists:', !!data.session.access_token);
    console.log('User ID:', data.user.id);
  }

  console.log('-------------------------------------------');
}

verifyLogin();
