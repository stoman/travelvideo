const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:4200/video/munich_airport');

  const locator = page.locator('text=15.08.2013');
  const count = await locator.count();
  if (count === 0) {
    console.error('Date not found on page');
    await page.screenshot({ path: '/home/jules/verification/date-format-debugging.png' });
    process.exit(1);
  }

  await page.screenshot({ path: '/home/jules/verification/date-format-verification.png' });
  await browser.close();
})();
