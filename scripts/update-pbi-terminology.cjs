const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.md')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk('.context/PBI');
let updatedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  
  // Reemplazo de palabras
  content = content.replace(/\bTrabajo\b/g, 'Instalación')
                   .replace(/\btrabajo\b/g, 'instalación')
                   .replace(/\bTrabajos\b/g, 'Instalaciones')
                   .replace(/\btrabajos\b/g, 'instalaciones')
                   // Revertir contexto de base de datos y API
                   .replace(/instalaciones_items/g, 'trabajos_items')
                   .replace(/\/api\/instalaciones/g, '/api/trabajos')
                   .replace(/instalación_id/g, 'trabajo_id')
                   .replace(/Instalación_id/g, 'trabajo_id')
                   .replace(/instalaciones_cliente_id_fkey/g, 'trabajos_cliente_id_fkey')
                   .replace(/instalaciones_empresa_id_fkey/g, 'trabajos_empresa_id_fkey')
                   .replace(/instalaciones_user_id_fkey/g, 'trabajos_user_id_fkey');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;
  }
});

console.log(`Terminología actualizada en ${updatedCount} archivos PBI.`);
