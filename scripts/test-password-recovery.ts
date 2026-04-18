import 'dotenv/config';
import { createServerClient } from '@supabase/ssr';
import { supabaseUrl, supabaseAnonKey } from '../src/lib/config';

async function testPasswordRecovery() {
  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: { get: () => undefined, set: () => {}, remove: () => {} },
  });

  console.log('--- Running Password Recovery API Tests for SOL-13 ---');

  // Test 1: Existing User
  const testEmail = 'javi.test.1776226007869@solarflow.com';
  console.log(`Test 1: Recovery for Existing User (${testEmail})...`);
  const { data: data1, error: error1 } = await supabase.auth.resetPasswordForEmail(testEmail, {
    redirectTo: 'https://staging-solarflow.vercel.app/auth/reset-password',
  });

  if (error1) {
    console.error(`[✗] FAILED: Got error: ${error1.message}`);
  } else {
    console.log(`[✓] PASSED: Recovery initiated successfully.`);
  }

  // Test 2: Non-existent User
  const nonExistentEmail = `not-found-${Date.now()}@solarflow.com`;
  console.log(`Test 2: Recovery for Non-existent User (${nonExistentEmail})...`);
  const { data: data2, error: error2 } =
    await supabase.auth.resetPasswordForEmail(nonExistentEmail);

  // Supabase should return success (empty data/no error) even if user doesn't exist
  // unless user enumeration protection is disabled.
  if (error2) {
    console.error(`[✗] OBS: Got error (Enumeration Protection might be OFF): ${error2.message}`);
  } else {
    console.log(`[✓] PASSED: Generic success response received.`);
  }

  console.log('-----------------------------------------------------');
}

testPasswordRecovery();
