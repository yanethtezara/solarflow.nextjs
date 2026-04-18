import 'dotenv/config';
import { createServerClient } from '@supabase/ssr';
import { supabaseUrl, supabaseAnonKey } from '../src/lib/config';

async function testCatalogCRUD() {
  const userA = { email: 'javi.test.1776226007869@solarflow.com', password: 'FixedPassword123!' };
  const userB = { email: 'javi.test.1776482325735@solarflow.com', password: 'FixedPassword123!' };

  console.log('--- Catalog API & RLS Testing Session (SOL-19, SOL-20) ---');

  // --- USER A: SETUP ---
  const supabaseA = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: { get: () => undefined, set: () => {}, remove: () => {} },
  });
  const {
    data: { session: sessionA },
  } = await supabaseA.auth.signInWithPassword(userA);
  if (!sessionA) {
    console.error('User A Login Failed');
    return;
  }

  // 1. Create Labor Service
  console.log('[User A] Creating Labor Service "Instalación Básica"...');
  const { data: laborA, error: errL } = await supabaseA
    .from('catalogo_items')
    .insert({
      nombre: 'Instalación Básica',
      tipo: 'mano_de_obra',
      precio: 150.0,
      user_id: sessionA.user.id,
    })
    .select()
    .single();
  if (errL) console.error('[User A] Labor Error:', errL.message);

  // 2. Create Material
  console.log('[User A] Creating Material "Panel Solar 400W"...');
  const { data: materialA, error: errM } = await supabaseA
    .from('catalogo_items')
    .insert({
      nombre: 'Panel Solar 400W',
      tipo: 'material',
      precio: 250.0,
      user_id: sessionA.user.id,
    })
    .select()
    .single();
  if (errM) console.error('[User A] Material Error:', errM.message);

  // --- USER B: RLS TEST ---
  const supabaseB = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: { get: () => undefined, set: () => {}, remove: () => {} },
  });
  await supabaseB.auth.signInWithPassword(userB);

  console.log('\n--- RLS Verification: READ ---');
  const { data: allItemsB } = await supabaseB.from('catalogo_items').select('nombre');
  const leakedItems = allItemsB?.filter(
    i => i.nombre === 'Instalación Básica' || i.nombre === 'Panel Solar 400W'
  );

  if (leakedItems && leakedItems.length > 0) {
    console.log("[✗] FAILED: User B can see User A's catalog items");
  } else {
    console.log("[✓] PASSED: User B cannot see User A's catalog items");
  }

  // --- NEGATIVE TESTS (Business Rules) ---
  console.log('\n--- Business Rules Verification ---');

  // Test: Negative Price
  console.log('[User A] Attempting to create item with negative price...');
  const { error: errNeg } = await supabaseA.from('catalogo_items').insert({
    nombre: 'Precio Negativo',
    tipo: 'material',
    precio: -100.0,
    user_id: sessionA.user.id,
  });
  console.log(
    errNeg
      ? `[✓] PASSED: Blocked negative price: ${errNeg.message}`
      : '[✗] FAILED: Allowed negative price'
  );

  // CLEANUP
  console.log('\n[Cleanup] Removing test items...');
  if (laborA) await supabaseA.from('catalogo_items').delete().eq('id', laborA.id);
  if (materialA) await supabaseA.from('catalogo_items').delete().eq('id', materialA.id);

  console.log('----------------------------------------------------------');
}

testCatalogCRUD();
