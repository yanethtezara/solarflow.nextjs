import 'dotenv/config';
import { createServerClient } from '@supabase/ssr';
import { supabaseUrl, supabaseAnonKey } from '../src/lib/config';

async function testCalendarSynchronization() {
  const user = { email: 'javi.test.1776226007869@solarflow.com', password: 'FixedPassword123!' };
  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: { get: () => undefined, set: () => {}, remove: () => {} },
  });
  await supabase.auth.signInWithPassword(user);
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user!.id;

  console.log('--- Calendar Data Synchronization Testing (SOL-29) ---');

  // 1. Create a job for a specific future date
  const targetDate = '2026-06-15';
  console.log(`Step 1: Creating a job for ${targetDate}...`);

  // Need a client first
  const { data: client } = await supabase
    .from('clientes')
    .insert({ nombre: 'Calendar Test Client', user_id: userId })
    .select()
    .single();

  const { data: job, error: errJ } = await supabase
    .from('trabajos')
    .insert({
      user_id: userId,
      cliente_id: client.id,
      fecha: targetDate,
      hora: '10:00:00',
      estado: 'agendado',
      ubicacion: 'Staging Calendar Office',
    })
    .select()
    .single();

  if (errJ) {
    console.error('Failed to create job:', errJ.message);
    return;
  }
  console.log('[✓] Job created with ID:', job.id);

  // 2. Fetch jobs via API (simulating calendar loading events)
  console.log('\nStep 2: Fetching jobs to verify calendar visibility...');
  const { data: jobs, error: errFetch } = await supabase
    .from('trabajos')
    .select('id, fecha, estado, clientes(nombre)')
    .eq('user_id', userId)
    .gte('fecha', '2026-06-01')
    .lte('fecha', '2026-06-30');

  if (errFetch) {
    console.error('Fetch failed:', errFetch.message);
  }

  const foundJob = jobs?.find(j => j.id === job.id);
  if (foundJob) {
    console.log('[✓] PASSED: Job is visible in the calendar data range.');
    console.log(`    Date: ${foundJob.fecha} | Client: ${(foundJob.clientes as any).nombre}`);
  } else {
    console.error('[✗] FAILED: Job NOT found in the expected range.');
  }

  // 3. CLEANUP
  console.log('\n[Cleanup] Removing calendar test data...');
  await supabase.from('trabajos').delete().eq('id', job.id);
  await supabase.from('clientes').delete().eq('id', client.id);

  console.log('------------------------------------------------------');
}

testCalendarSynchronization();
