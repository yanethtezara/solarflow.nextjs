import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

async function confirmTestUser() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const email = 'javi.test.1776226007869@solarflow.com';

  console.log(`Confirming email for ${email}...`);

  const {
    data: { users },
  } = await supabase.auth.admin.listUsers();
  const targetUser = users.find(u => u.email === email);

  if (!targetUser) {
    console.error('User not found.');
    return;
  }

  const { data, error } = await supabase.auth.admin.updateUserById(targetUser.id, {
    email_confirm: true,
  });

  if (error) {
    console.error('Error confirming email:', error.message);
  } else {
    console.log('Email confirmed successfully.');
  }
}

confirmTestUser();
