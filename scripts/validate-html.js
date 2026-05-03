// validate-html.js
const assert = require('assert');

async function validatePage(url, pageName, expectedBg, expectedCard) {
  console.log(`\nVerificando HTML de: ${pageName} (${url})`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const html = await res.text();

    // Verificar que el contenedor principal (main o div) tenga el fondo correcto
    if (html.includes(expectedBg)) {
      console.log(`✅ [${pageName}] Fondo '${expectedBg}' encontrado en el DOM.`);
    } else {
      console.error(`❌ [${pageName}] No se encontró el fondo '${expectedBg}'.`);
      return false;
    }

    if (expectedCard) {
      // Verificar que haya un elemento con clase card y fondo blanco
      if (html.includes(expectedCard)) {
        console.log(`✅ [${pageName}] Recuadro '${expectedCard}' encontrado en el DOM.`);
      } else {
        console.error(`❌ [${pageName}] No se encontró el recuadro '${expectedCard}'.`);
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error(`❌ Error conectando a ${url}:`, error.message);
    return false;
  }
}

async function main() {
  const baseUrl = 'https://solarflow-nextjs-develop.vercel.app';

  const results = await Promise.all([
    validatePage(baseUrl + '/', 'Landing Page', 'bg-slate-900', null),
    validatePage(baseUrl + '/login', 'Login Page', 'bg-slate-900', 'bg-white'),
    validatePage(baseUrl + '/forgot-password', 'Forgot Password', 'bg-slate-900', 'bg-white'),
    validatePage(baseUrl + '/auth/reset-password', 'Reset Password', 'bg-slate-900', 'bg-white'),
  ]);

  if (results.every(r => r === true)) {
    console.log('\n✅✅ TODAS LAS PRUEBAS PASARON EN STAGING ✅✅');
  } else {
    console.error('\n❌❌ SE ENCONTRARON FALLOS O EL DEPLOY AÚN NO TERMINA ❌❌');
  }
}

main();
