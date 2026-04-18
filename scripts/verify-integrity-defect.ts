import 'dotenv/config';
import { createServerClient } from '@supabase/ssr';
import { supabaseUrl, supabaseAnonKey } from '../src/lib/config';

async function verifyIntegrityDefect() {
  const user = { email: 'javi.test.1776226007869@solarflow.com', password: 'FixedPassword123!' };
  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: { get: () => undefined, set: () => {}, remove: () => {} },
  });

  await supabase.auth.signInWithPassword(user);
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user!.id;

  console.log('--- Verifying Data Integrity Defect (SOL-16) ---');

  // 1. Create Client
  const { data: client } = await supabase
    .from('clientes')
    .insert({
      nombre: 'Client for Integrity Test',
      user_id: userId,
    })
    .select()
    .single();

  // 2. Create Job associated with client
  console.log(`Creating job for client ${client.id}...`);
  const { data: job } = await supabase
    .from('trabajos')
    .insert({
      user_id: userId,
      cliente_id: client.id,
      fecha: new Date().toISOString().split('T')[0],
      estado: 'agendado',
    })
    .select()
    .single();

  // 3. Attempt to delete client
  console.log('Attempting to delete client (should be blocked per business rule)...');
  const { error: errDelete } = await supabase.from('clientes').delete().eq('id', client.id);

  if (errDelete) {
    console.log('[✓] PASSED (Unexpected based on DB schema): Client deletion was blocked.');
    console.log('Error:', errDelete.message);
  } else {
    console.log('[✗] FAILED: Client was deleted successfully. This violates the business rule.');

    // Check if job still exists
    const { data: jobCheck } = await supabase.from('trabajos').select().eq('id', job.id).single();
    if (!jobCheck) {
      console.log('[!] CRITICAL: Job was also deleted due to CASCADE rule.');
    }
  }

  console.log('--------------------------------------------------');
}

verifyIntegrityDefect();
