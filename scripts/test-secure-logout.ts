import 'dotenv/config';
import { createServerClient } from '@supabase/ssr';
import { supabaseUrl, supabaseAnonKey } from '../src/lib/config';

async function testSecureLogout() {
  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: { get: () => undefined, set: () => {}, remove: () => {} },
  });

  const email = 'javi.test.1776226007869@solarflow.com';
  const password = 'FixedPassword123!';

  console.log('--- Running Secure Logout API Tests for SOL-14 ---');

  // 1. Authenticate
  console.log(`Step 1: Logging in as ${email}...`);
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    console.error('Login failed:', loginError.message);
    return;
  }
  console.log('Login successful. Session obtained.');

  // 2. Logout
  console.log('Step 2: Performing secure logout (signOut)...');
  const { error: logoutError } = await supabase.auth.signOut();

  if (logoutError) {
    console.error(`[✗] FAILED: signOut returned error: ${logoutError.message}`);
  } else {
    console.log('[✓] PASSED: signOut executed without errors.');
  }

  // 3. Verify session is gone
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    console.log('[✓] PASSED: Session is confirmed null after logout.');
  } else {
    console.error('[✗] FAILED: Session still exists after logout.');
  }

  console.log('--------------------------------------------------');
}

testSecureLogout();
