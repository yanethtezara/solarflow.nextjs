const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const userId = '9c3b7018-00d3-49cb-9869-8421dacae0a8';

async function uploadCatalog() {
  console.log('Iniciando carga de catálogo...');
  
  const csvContent = fs.readFileSync('catalogo.csv', 'utf8');
  const lines = csvContent.split('\n');
  const items = [];

  // Empezamos en 1 para saltar el header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('Total')) continue;

    const parts = line.split(';');
    if (parts.length < 2) continue;

    let nombre = parts[0].replace(/"/g, '').trim();
    let costoStr = parts[1].replace(',', '.').trim();
    let costo = parseFloat(costoStr) || 0;

    if (nombre && nombre !== 'Varios') {
      items.push({
        user_id: userId,
        nombre: nombre,
        tipo: 'material',
        precio: costo
      });
    }
  }

  console.log(`Procesados ${items.length} ítems. Subiendo a Supabase...`);

  const { data, error } = await supabase
    .from('catalogo_items')
    .insert(items);

  if (error) {
    console.error('Error al subir catálogo:', error.message);
  } else {
    console.log('✅ Catálogo cargado exitosamente.');
  }
}

uploadCatalog();
