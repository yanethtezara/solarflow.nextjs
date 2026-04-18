import { chromium } from 'playwright';

async function runSmokeTest() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    extraHTTPHeaders: {
      'x-vercel-protection-bypass': 'EGQV1zebZKGHls6T4KFw5CnLRi4Kix3F',
    },
  });
  const page = await context.newPage();

  console.log('--- Starting Smoke Test for SOL-11 (UI) ---');

  try {
    console.log('Navigating to https://staging-solarflow.vercel.app/signup...');
    await page.goto('https://staging-solarflow.vercel.app/signup');

    // 1. Basic Access Check
    const title = await page.title();
    console.log(`Page Title: ${title}`);

    // 2. Check for UI Elements (data-testid)
    const emailInput = await page.getByTestId('email_input');
    const passwordInput = await page.getByTestId('password_input');
    const submitButton = await page.getByTestId('submit_button');

    const isEmailVisible = await emailInput.isVisible();
    const isPasswordVisible = await passwordInput.isVisible();
    const isSubmitVisible = await submitButton.isVisible();

    console.log(`[${isEmailVisible ? '✓' : '✗'}] Email Input Visible`);
    console.log(`[${isPasswordVisible ? '✓' : '✗'}] Password Input Visible`);
    console.log(`[${isSubmitVisible ? '✓' : '✗'}] Submit Button Visible`);

    if (isEmailVisible && isPasswordVisible && isSubmitVisible) {
      console.log('\x1b[32m%s\x1b[0m', '--- UI Smoke Test PASSED ---');
    } else {
      console.error('\x1b[31m%s\x1b[0m', '--- UI Smoke Test FAILED: Missing Elements ---');
    }
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '--- UI Smoke Test FAILED: Navigation/Error ---');
    console.error(error);
  } finally {
    await browser.close();
  }
}

runSmokeTest();
