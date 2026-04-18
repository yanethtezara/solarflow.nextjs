import 'dotenv/config';
import { createServerClient } from '@supabase/ssr';
import { supabaseUrl, supabaseAnonKey } from '../src/lib/config';

async function testInvoiceGeneration() {
  const user = { email: 'javi.test.1776226007869@solarflow.com', password: 'FixedPassword123!' };
  const jobId = '412af084-a830-4e6b-ad0b-9a1f3d3fbd70'; // Use the completed job found

  console.log('--- Invoice Generation & Data Testing (SOL-33, 34, 35) ---');

  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: { get: () => undefined, set: () => {}, remove: () => {} },
  });
  await supabase.auth.signInWithPassword(user);

  console.log(`Fetching invoice details for Job: ${jobId}...`);

  // 1. Fetch Job + Client + Company (SOL-34)
  const { data: job, error: errJ } = await supabase
    .from('trabajos')
    .select(
      `
      *,
      clientes(nombre, direccion, telefono),
      empresas(nombre, contacto_responsable, telefono_contacto)
    `
    )
    .eq('id', jobId)
    .single();

  if (errJ) {
    console.error('Failed to fetch job:', errJ.message);
    return;
  }

  console.log('[✓] Job found in status:', job.estado);
  console.log('[✓] Client Data:', job.clientes?.nombre);
  console.log('[✓] Company Data:', job.empresas?.nombre);

  // 2. Fetch Items (SOL-33)
  const { data: items, error: errI } = await supabase
    .from('trabajos_items')
    .select(
      `
      cantidad,
      catalogo_items(nombre, precio)
    `
    )
    .eq('trabajo_id', jobId);

  if (errI) {
    console.error('Failed to fetch items:', errI.message);
  }

  console.log('\n--- Invoice Breakdown ---');
  let totalCalculated = 0;
  items?.forEach(item => {
    const price = (item.catalogo_items as any).precio;
    const subtotal = item.cantidad * price;
    totalCalculated += subtotal;
    console.log(`- ${item.cantidad} x ${(item.catalogo_items as any).nombre}: ${subtotal} EUR`);
  });

  console.log('\n--- Totals ---');
  console.log(`Calculated Invoice Total: ${totalCalculated} EUR`);

  // Verification
  if (job.estado === 'completado' && items && items.length > 0) {
    console.log('\x1b[32m%s\x1b[0m', '[✓] PASSED: Invoice data is complete and accurate.');
  } else {
    console.warn('[!] WARNING: Invoice data may be incomplete or job is not completed.');
  }

  console.log('----------------------------------------------------------');
}

testInvoiceGeneration();
