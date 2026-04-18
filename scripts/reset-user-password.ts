import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

async function resetTestUserPassword() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for admin actions
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const email = 'javi.test.1776226007869@solarflow.com';
  const newPassword = 'FixedPassword123!';

  console.log(`Resetting password for ${email}...`);

  // Find user by email
  const {
    data: { users },
    error: listError,
  } = await supabase.auth.admin.listUsers();
  const targetUser = users.find(u => u.email === email);

  if (!targetUser) {
    console.error('User not found.');
    return;
  }

  const { data, error } = await supabase.auth.admin.updateUserById(targetUser.id, {
    password: newPassword,
  });

  if (error) {
    console.error('Error resetting password:', error.message);
  } else {
    console.log('Password reset successfully to: FixedPassword123!');
  }
}

resetTestUserPassword();
