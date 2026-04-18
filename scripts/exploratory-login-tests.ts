import 'dotenv/config';
import { createServerClient } from '@supabase/ssr';
import { supabaseUrl, supabaseAnonKey } from '../src/lib/config';

async function runLoginExploratoryTests() {
  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: { get: () => undefined, set: () => {}, remove: () => {} },
  });

  console.log('--- Running Exploratory Login Tests for SOL-12 ---');

  // We'll use the user created in the previous SOL-11 session
  // Email: javi.test.1776482325735@solarflow.com
  // Password: See scripts/test-signup.ts logic (Str0ngP@ssw0rd! + timestamp)
  // Since timestamps differ, I'll use a fixed credential if available or
  // attempt with a known failing one first.

  const testEmail = 'javi.test.1776482325735@solarflow.com';

  // Test 1: Wrong Password
  console.log(`Test 1: Login with Wrong Password (${testEmail})...`);
  const { data: data1, error: error1 } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: 'WrongPassword123!',
  });
  console.log(
    error1
      ? `[✓] PASSED: Got expected error: ${error1.message}`
      : `[✗] FAILED: Login succeeded with wrong password`
  );

  // Test 2: Non-existent User
  const nonExistentEmail = `no.existe.${Date.now()}@test.com`;
  console.log(`Test 2: Login with Non-existent User (${nonExistentEmail})...`);
  const { data: data2, error: error2 } = await supabase.auth.signInWithPassword({
    email: nonExistentEmail,
    password: 'AnyPassword123!',
  });
  console.log(
    error2
      ? `[✓] PASSED: Got expected error: ${error2.message}`
      : `[✗] FAILED: Login succeeded for non-existent user`
  );

  // Test 3: Invalid Email Format
  console.log('Test 3: Login with Invalid Email Format...');
  const { error: error3 } = await supabase.auth.signInWithPassword({
    email: 'not-an-email',
    password: 'Password123!',
  });
  console.log(
    error3
      ? `[✓] PASSED: Got expected error: ${error3.message}`
      : `[✗] FAILED: API accepted invalid email format`
  );

  console.log('-------------------------------------------------');
}

runLoginExploratoryTests();
