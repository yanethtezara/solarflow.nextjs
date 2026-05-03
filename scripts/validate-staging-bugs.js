const { chromium } = require('playwright');

(async () => {
  const baseUrl = 'https://solarflow-nextjs-develop.vercel.app';
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let allPassed = true;

  const checkColors = async (url, pageName, hasCard = true) => {
    console.log(`\nVerificando: ${pageName} (${url})`);
    await page.goto(url, { waitUntil: 'networkidle' });

    // Check main background (bg-slate-900 = rgb(15, 23, 42))
    const mainBgColor = await page.evaluate(() => {
      const el = document.querySelector('main') || document.querySelector('div.min-h-screen');
      return window.getComputedStyle(el).backgroundColor;
    });

    const expectedBg = 'rgb(15, 23, 42)';
    if (mainBgColor === expectedBg) {
      console.log(`✅ [${pageName}] Fondo es Navy (${mainBgColor})`);
    } else {
      console.error(
        `❌ [${pageName}] Fondo INCORRECTO. Esperado ${expectedBg}, recibido ${mainBgColor}`
      );
      allPassed = false;
    }

    if (hasCard) {
      // Check card background (bg-white = rgb(255, 255, 255))
      const cardBgColor = await page.evaluate(() => {
        const el = document.querySelector('.card');
        return window.getComputedStyle(el).backgroundColor;
      });

      const expectedCardBg = 'rgb(255, 255, 255)';
      if (cardBgColor === expectedCardBg) {
        console.log(`✅ [${pageName}] Recuadro (Card) es Blanco (${cardBgColor})`);
      } else {
        console.error(
          `❌ [${pageName}] Recuadro INCORRECTO. Esperado ${expectedCardBg}, recibido ${cardBgColor}`
        );
        allPassed = false;
      }
    }
  };

  try {
    // SOL-58: Landing Page (No tiene recuadro, solo fondo y botones transparentes)
    await checkColors(baseUrl + '/', 'Landing Page', false);

    // SOL-59: Login Page
    await checkColors(baseUrl + '/login', 'Login Page', true);

    // SOL-60: Forgot Password
    await checkColors(baseUrl + '/forgot-password', 'Forgot Password Page', true);

    // SOL-61: Reset Password
    await checkColors(baseUrl + '/auth/reset-password', 'Reset Password Page', true);

    console.log('\n=======================================');
    if (allPassed) {
      console.log('✅✅ TODAS LAS PRUEBAS VISUALES PASARON EN STAGING ✅✅');
    } else {
      console.error('❌❌ SE ENCONTRARON FALLOS EN LA VALIDACIÓN ❌❌');
    }
    console.log('=======================================');
  } catch (error) {
    console.error('Error durante la ejecución del script:', error);
  } finally {
    await browser.close();
  }
})();
