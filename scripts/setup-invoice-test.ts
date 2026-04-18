import 'dotenv/config';
import { createServerClient } from '@supabase/ssr';
import { supabaseUrl, supabaseAnonKey } from '../src/lib/config';

async function setupAndTestInvoice() {
  const user = { email: 'javi.test.1776226007869@solarflow.com', password: 'FixedPassword123!' };

  console.log('--- Setting up fresh data for Invoice Test (SOL-32) ---');

  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: { get: () => undefined, set: () => {}, remove: () => {} },
  });
  await supabase.auth.signInWithPassword(user);
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user!.id;

  // 1. Setup Data
  const { data: client } = await supabase
    .from('clientes')
    .insert({ nombre: 'Invoice Test Client', user_id: userId })
    .select()
    .single();
  const { data: material } = await supabase
    .from('catalogo_items')
    .insert({ nombre: 'Invoice Panel', tipo: 'material', precio: 500, user_id: userId })
    .select()
    .single();

  // Create Completed Job
  const { data: job } = await supabase
    .from('trabajos')
    .insert({
      user_id: userId,
      cliente_id: client.id,
      fecha: '2026-04-20',
      hora: '14:00:00',
      estado: 'completado',
    })
    .select()
    .single();

  // Add Items
  await supabase
    .from('trabajos_items')
    .insert({ trabajo_id: job.id, item_id: material.id, cantidad: 2 });

  console.log(`[✓] Setup complete. Job ID: ${job.id}`);

  // 2. Perform Validation
  console.log('\n--- Invoice Preview Validation ---');
  const { data: invData } = await supabase
    .from('trabajos')
    .select(
      `
      id, estado,
      clientes(nombre),
      trabajos_items(cantidad, catalogo_items(nombre, precio))
    `
    )
    .eq('id', job.id)
    .single();

  const items = invData.trabajos_items as any[];
  const total = items.reduce((acc, i) => acc + i.cantidad * i.catalogo_items.precio, 0);

  console.log(`Job Status: ${invData.estado}`);
  console.log(`Client: ${invData.clientes.nombre}`);
  console.log(`Calculated Total: ${total} EUR (Expected: 1000)`);

  if (total === 1000 && invData.estado === 'completado') {
    console.log('\x1b[32m%s\x1b[0m', '[✓] PASSED: Invoice logic verified.');
  } else {
    console.error('[✗] FAILED: Data or logic discrepancy.');
  }

  // 3. CLEANUP
  console.log('\n[Cleanup] Cleaning test data...');
  await supabase.from('trabajos_items').delete().eq('trabajo_id', job.id);
  await supabase.from('trabajos').delete().eq('id', job.id);
  await supabase.from('catalogo_items').delete().eq('id', material.id);
  await supabase.from('clientes').delete().eq('id', client.id);

  console.log('-------------------------------------------------------');
}

setupAndTestInvoice();
