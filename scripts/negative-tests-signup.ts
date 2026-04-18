import 'dotenv/config';
import { createServerClient } from '@supabase/ssr';
import { supabaseUrl, supabaseAnonKey } from '../src/lib/config';

async function runNegativeTests() {
  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: { get: () => undefined, set: () => {}, remove: () => {} },
  });

  console.log('--- Running Negative Tests for SOL-11 ---');

  // Test 1: Existing Email
  const existingEmail = 'javi.test.1776482325735@solarflow.com';
  console.log(`Test 1: Existing Email (${existingEmail})...`);
  const { data: data1, error: error1 } = await supabase.auth.signUp({
    email: existingEmail,
    password: 'StrongPassword123!',
  });
  console.log('Full Response Data:', JSON.stringify(data1, null, 2));
  console.log(
    error1
      ? `[✓] PASSED: Got expected error: ${error1.message}`
      : `[✗] FAILED: Signup succeeded for existing email`
  );

  // Test 2: Invalid Email
  const invalidEmail = 'invalid-email-format';
  console.log(`Test 2: Invalid Email Format (${invalidEmail})...`);
  const { error: error2 } = await supabase.auth.signUp({
    email: invalidEmail,
    password: 'StrongPassword123!',
  });
  console.log(
    error2
      ? `[✓] PASSED: Got expected error: ${error2.message}`
      : `[✗] FAILED: Signup succeeded for invalid email`
  );

  // Test 3: Weak Password (less than 6 chars per story)
  const weakPassword = '123';
  console.log(`Test 3: Weak Password (${weakPassword})...`);
  const { error: error3 } = await supabase.auth.signUp({
    email: `test.${Date.now()}@solarflow.com`,
    password: weakPassword,
  });
  console.log(
    error3
      ? `[✓] PASSED: Got expected error: ${error3.message}`
      : `[✗] FAILED: Signup succeeded for weak password`
  );

  console.log('-----------------------------------------');
}

runNegativeTests();
