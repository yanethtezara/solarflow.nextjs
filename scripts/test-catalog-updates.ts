import 'dotenv/config';
import { createServerClient } from '@supabase/ssr';
import { supabaseUrl, supabaseAnonKey } from '../src/lib/config';

async function testCatalogUpdates() {
  const user = { email: 'javi.test.1776226007869@solarflow.com', password: 'FixedPassword123!' };

  console.log('--- Catalog Edit/Delete Testing Session (SOL-21) ---');

  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: { get: () => undefined, set: () => {}, remove: () => {} },
  });
  await supabase.auth.signInWithPassword(user);

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user!.id;

  // 1. Create temporary item
  console.log('Creating item for update test...');
  const { data: item, error: errI } = await supabase
    .from('catalogo_items')
    .insert({
      nombre: 'Original Name',
      tipo: 'material',
      precio: 50.0,
      user_id: userId,
    })
    .select()
    .single();

  if (errI) {
    console.error('Creation failed:', errI.message);
    return;
  }

  // 2. Update Item
  console.log(`Updating item ${item.id}...`);
  const { data: updatedItem, error: errU } = await supabase
    .from('catalogo_items')
    .update({ nombre: 'Updated Name', precio: 75.0 })
    .eq('id', item.id)
    .select()
    .single();

  if (updatedItem?.nombre === 'Updated Name' && updatedItem?.precio == 75.0) {
    console.log('[✓] PASSED: Item updated successfully.');
  } else {
    console.error('[✗] FAILED: Item update failed.', errU?.message);
  }

  // 3. Delete Item
  console.log(`Deleting item ${item.id}...`);
  const { error: errD } = await supabase.from('catalogo_items').delete().eq('id', item.id);

  if (errD) {
    console.error('[✗] FAILED: Item deletion failed.', errD.message);
  } else {
    console.log('[✓] PASSED: Item deleted successfully.');
  }

  console.log('----------------------------------------------------');
}

testCatalogUpdates();
