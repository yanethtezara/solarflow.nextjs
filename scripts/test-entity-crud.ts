import 'dotenv/config';
import { createServerClient } from '@supabase/ssr';
import { supabaseUrl, supabaseAnonKey } from '../src/lib/config';

async function testEntityCRUD() {
  const userA = { email: 'javi.test.1776226007869@solarflow.com', password: 'FixedPassword123!' };
  const userB = { email: 'javi.test.1776482325735@solarflow.com', password: 'FixedPassword123!' };

  console.log('--- Entity CRUD & RLS Testing Session (SOL-16, SOL-17) ---');

  // --- USER A ACTIONS ---
  console.log(`\n[User A] Logging in as ${userA.email}...`);
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

  console.log('[User A] Creating Client "Cliente User A"...');
  const { data: clientA, error: errCA } = await supabaseA
    .from('clientes')
    .insert({
      nombre: 'Cliente User A',
      direccion: 'Calle A 123',
      telefono: '111222333',
      user_id: sessionA.user.id,
    })
    .select()
    .single();

  if (errCA) {
    console.error('[User A] Client Creation Error:', errCA.message);
  }

  console.log('[User A] Creating Company "Empresa User A"...');
  const { data: companyA, error: errEA } = await supabaseA
    .from('empresas')
    .insert({
      nombre: 'Empresa User A',
      contacto_responsable: 'Persona A',
      telefono_contacto: '999888777',
      user_id: sessionA.user.id,
    })
    .select()
    .single();

  if (errEA) {
    console.error('[User A] Company Creation Error:', errEA.message);
  }

  // --- USER B ACTIONS ---
  console.log(`\n[User B] Logging in as ${userB.email}...`);
  const supabaseB = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: { get: () => undefined, set: () => {}, remove: () => {} },
  });
  const {
    data: { session: sessionB },
  } = await supabaseB.auth.signInWithPassword(userB);

  if (!sessionB) {
    console.error('User B Login Failed');
    return;
  }

  console.log('[User B] Creating Client "Cliente User B"...');
  const { data: clientB, error: errCB } = await supabaseB
    .from('clientes')
    .insert({
      nombre: 'Cliente User B',
      telefono: '444555666',
      user_id: sessionB.user.id,
    })
    .select()
    .single();

  // --- RLS READ TEST ---
  console.log('\n--- RLS Verification: READ ---');
  const { data: allClientsB } = await supabaseB.from('clientes').select('nombre');
  const hasClientA = allClientsB?.some(c => c.nombre === 'Cliente User A');
  console.log(
    hasClientA
      ? "[✗] FAILED: User B can see User A's clients"
      : "[✓] PASSED: User B cannot see User A's clients"
  );

  const { data: allCompaniesB } = await supabaseB.from('empresas').select('nombre');
  const hasCompanyA = allCompaniesB?.some(c => c.nombre === 'Empresa User A');
  console.log(
    hasCompanyA
      ? "[✗] FAILED: User B can see User A's companies"
      : "[✓] PASSED: User B cannot see User A's companies"
  );

  // --- RLS UPDATE TEST ---
  console.log('\n--- RLS Verification: UPDATE ---');
  console.log("[User B] Attempting to update User A's client...");
  const { data: updateRes, error: errUpdate } = await supabaseB
    .from('clientes')
    .update({ nombre: 'HACKED' })
    .eq('id', clientA.id)
    .select();

  const updatedCount = updateRes?.length || 0;
  console.log(
    errUpdate || updatedCount === 0
      ? '[✓] PASSED: Update blocked by RLS'
      : `[✗] FAILED: User B updated ${updatedCount} of User A's clients`
  );

  // --- CRUD: UPDATE OWN ---
  console.log('\n--- CRUD Verification: UPDATE OWN ---');
  const { error: errUpdateOwn } = await supabaseB
    .from('clientes')
    .update({ direccion: 'Nueva Direccion B' })
    .eq('id', clientB.id);
  console.log(
    errUpdateOwn ? '[✗] FAILED: Could not update own client' : '[✓] PASSED: Own client updated'
  );

  // --- CRUD: DELETE OWN ---
  console.log('\n--- CRUD Verification: DELETE OWN ---');
  const { error: errDeleteOwn } = await supabaseB.from('clientes').delete().eq('id', clientB.id);
  console.log(
    errDeleteOwn ? '[✗] FAILED: Could not delete own client' : '[✓] PASSED: Own client deleted'
  );

  // CLEANUP USER A
  console.log('\n[Cleanup] Removing User A test data...');
  await supabaseA.from('clientes').delete().eq('id', clientA.id);
  await supabaseA.from('empresas').delete().eq('id', companyA.id);

  console.log('\n-----------------------------------------------------------');
}

testEntityCRUD();
