// scripts/test-signup.ts
import 'dotenv/config'; // Load environment variables from .env
import { createServerClient } from '@supabase/ssr';
import { supabaseUrl, supabaseAnonKey } from '../src/lib/config';

async function testSignUp() {
  console.log('--- Running Supabase Signup Test ---');

  // 1. Create a Supabase client for a server-side environment
  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      get: () => undefined,
      set: () => {},
      remove: () => {},
    },
  });

  // 2. Generate a random email and a strong password
  const email = `javi.test.${Date.now()}@solarflow.com`;
  const password = `Str0ngP@ssw0rd!${Date.now()}`;

  console.log(`Attempting to sign up with email: ${email}`);

  // 3. Attempt to sign up the new user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  // 4. Report the result
  if (error) {
    console.error('\x1b[31m%s\x1b[0m', '--- Signup Test Failed ---'); // Red color for error
    console.error('Error Details:', error.message);
    if (error.stack) {
      console.error('Stack Trace:', error.stack);
    }
    console.log('\nTroubleshooting Tips:');
    console.log('- Is your Supabase project running?');
    console.log(
      '- Are NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY correct in your .env file?'
    );
    console.log('- Is there a network issue preventing connection to the Supabase API?');
  } else if (data.user) {
    console.log('\x1b[32m%s\x1b[0m', '--- Signup Test Successful! ---'); // Green color for success
    console.log('User created successfully:');
    console.log('  User ID:', data.user.id);
    console.log('  Email:', data.user.email);
    console.log('\nNext Steps:');
    console.log('1. Check the "Authentication" section in your Supabase project dashboard.');
    console.log(`2. You should see a new user with the email: ${email}`);
    console.log(
      '3. You may need to disable "Enable email confirmations" in Supabase > Authentication > Providers > Email if you want to log in immediately without verifying the email address.'
    );
  } else {
    console.warn('\x1b[33m%s\x1b[0m', '--- Signup Test Result Ambiguous ---'); // Yellow color for warning
    console.log('The signup process completed without an error, but no user data was returned.');
    console.log(
      'This can happen if you have email confirmations enabled in your Supabase project.'
    );
    console.log('Please check your Supabase dashboard to see if the user was created.');
  }

  console.log('------------------------------------');
}

testSignUp();
