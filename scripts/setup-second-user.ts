import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

async function setupSecondUser() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const email = 'javi.test.1776482325735@solarflow.com';
  const newPassword = 'FixedPassword123!';

  console.log(`Setting up second user: ${email}...`);

  const {
    data: { users },
  } = await supabase.auth.admin.listUsers();
  const targetUser = users.find(u => u.email === email);

  if (!targetUser) {
    console.error('User not found.');
    return;
  }

  const { error } = await supabase.auth.admin.updateUserById(targetUser.id, {
    password: newPassword,
    email_confirm: true,
  });

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Second user confirmed and password set.');
  }
}

setupSecondUser();
