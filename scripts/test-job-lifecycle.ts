import 'dotenv/config';
import { createServerClient } from '@supabase/ssr';
import { supabaseUrl, supabaseAnonKey } from '../src/lib/config';

async function testJobFullLifecycle() {
  const user = { email: 'javi.test.1776226007869@solarflow.com', password: 'FixedPassword123!' };
  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: { get: () => undefined, set: () => {}, remove: () => {} },
  });
  await supabase.auth.signInWithPassword(user);
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user!.id;

  console.log('--- Job Core Lifecycle Testing (SOL-23, 24, 26, 27) ---');

  // 1. SETUP DEPENDENCIES
  console.log('Setting up dependencies (Client, Company, Catalog)...');
  const { data: client } = await supabase
    .from('clientes')
    .insert({ nombre: 'Core Client', user_id: userId })
    .select()
    .single();
  const { data: company } = await supabase
    .from('empresas')
    .insert({ nombre: 'Core Company', user_id: userId })
    .select()
    .single();
  const { data: material } = await supabase
    .from('catalogo_items')
    .insert({ nombre: 'Core Panel', tipo: 'material', precio: 200, user_id: userId })
    .select()
    .single();
  const { data: labor } = await supabase
    .from('catalogo_items')
    .insert({ nombre: 'Core Labor', tipo: 'mano_de_obra', precio: 100, user_id: userId })
    .select()
    .single();

  // 2. CREATE JOB (SOL-23)
  console.log('\n[SOL-23] Creating Job...');
  const { data: job, error: errJ } = await supabase
    .from('trabajos')
    .insert({
      user_id: userId,
      cliente_id: client.id,
      empresa_id: company.id,
      fecha: '2026-05-01',
      hora: '09:00:00',
      estado: 'agendado',
      ubicacion: 'Core Location',
    })
    .select()
    .single();

  if (errJ) {
    console.error('Job Creation Failed:', errJ.message);
    return;
  }
  console.log('[✓] Job Created:', job.id);

  // 3. ADD ITEMS (SOL-26)
  console.log('\n[SOL-26] Adding Items to Job...');
  // Add 10 Panels (200 * 10 = 2000)
  await supabase
    .from('trabajos_items')
    .insert({ trabajo_id: job.id, item_id: material.id, cantidad: 10 });
  // Add 1 Labor (100 * 1 = 100)
  await supabase
    .from('trabajos_items')
    .insert({ trabajo_id: job.id, item_id: labor.id, cantidad: 1 });

  // 4. VERIFY TOTALS (SOL-26 Business Rule)
  console.log('Verifying totals...');
  const { data: items } = await supabase
    .from('trabajos_items')
    .select('cantidad, catalogo_items(precio)')
    .eq('trabajo_id', job.id);

  const calculatedTotal = items?.reduce(
    (acc, i) => acc + i.cantidad * (i.catalogo_items as any).precio,
    0
  );
  console.log('Expected Total: 2100 | Calculated:', calculatedTotal);
  console.log(
    calculatedTotal === 2100 ? '[✓] PASSED: Totals are correct.' : '[✗] FAILED: Totals mismatch.'
  );

  // 5. LIST JOBS (SOL-24)
  console.log('\n[SOL-24] Verifying list and filters...');
  const { data: list } = await supabase.from('trabajos').select('id').eq('user_id', userId);
  console.log(
    list?.some(j => j.id === job.id)
      ? '[✓] PASSED: Job found in list.'
      : '[✗] FAILED: Job missing from list.'
  );

  // 6. CHANGE STATUS (SOL-27)
  console.log('\n[SOL-27] Changing status to "completado"...');
  const { data: updatedJob } = await supabase
    .from('trabajos')
    .update({ estado: 'completado' })
    .eq('id', job.id)
    .select()
    .single();
  console.log(
    updatedJob?.estado === 'completado'
      ? '[✓] PASSED: Status updated.'
      : '[✗] FAILED: Status update failed.'
  );

  // CLEANUP (In reverse order)
  console.log('\n[Cleanup] Cleaning up core test data...');
  await supabase.from('trabajos_items').delete().eq('trabajo_id', job.id);
  await supabase.from('trabajos').delete().eq('id', job.id);
  await supabase.from('catalogo_items').delete().in('id', [material.id, labor.id]);
  await supabase.from('empresas').delete().eq('id', company.id);
  await supabase.from('clientes').delete().eq('id', client.id);

  console.log('-------------------------------------------------------');
}

testJobFullLifecycle();
