import 'dotenv/config';
import { createServerClient } from '@supabase/ssr';
import { supabaseUrl, supabaseAnonKey } from '../src/lib/config';

async function runHappyPathLogin() {
  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: { get: () => undefined, set: () => {}, remove: () => {} },
  });

  const email = `login.test.${Date.now()}@solarflow.com`;
  const password = 'CorrectPassword123!';

  console.log(`--- Happy Path: Signup + Login ---`);

  // 1. Create User
  console.log(`Step 1: Creating user ${email}...`);
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signupError) {
    console.error('Signup failed:', signupError.message);
    return;
  }
  console.log('Signup Successful.');

  // 2. Login with correct credentials
  console.log(`Step 2: Logging in with ${email}...`);
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    console.error('\x1b[31m%s\x1b[0m', '--- Happy Path FAILED ---');
    console.error('Error Details:', loginError.message);
  } else if (loginData.session) {
    console.log('\x1b[32m%s\x1b[0m', '--- Happy Path PASSED ---');
    console.log('Login Successful!');
    console.log('Session access_token exists:', !!loginData.session.access_token);
    console.log('User ID:', loginData.user.id);
  }

  console.log('---------------------------------');
}

runHappyPathLogin();
