import { chromium } from 'playwright-core';

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
const token = `${encode({ alg: 'none', typ: 'JWT' })}.${encode({
  sub: 'mobile-layout-test',
  email: 'mobile-layout@test.local',
  role: 'participant',
  exp: Math.floor(Date.now() / 1000) + 3600
})}.signature`;

const browser = await chromium.launch({ executablePath: chrome, headless: true });
const results = [];

for (const width of [320, 360, 375, 390]) {
  const context = await browser.newContext({ viewport: { width, height: 844 } });
  await context.addCookies([{ name: 'access_token', value: token, url: 'http://127.0.0.1:3000' }]);
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const closed = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    pageWidth: document.documentElement.scrollWidth,
    headerWidth: document.querySelector('header')?.scrollWidth,
    inboxVisible: Boolean(document.querySelector('.inbox-trigger')?.getBoundingClientRect().width),
    menuVisible: Boolean(document.querySelector('.menu-button')?.getBoundingClientRect().width),
    headerLogoutVisible: [...document.querySelectorAll('button')].some((element) => element.textContent?.trim().toLowerCase() === 'logout' && element.getBoundingClientRect().width > 0),
    headerCtaVisible: [...document.querySelectorAll('.header-cta')].some((element) => /complete|secure|continue|registration/i.test(element.textContent || '') && element.getBoundingClientRect().width > 0)
  }));

  await page.locator('.menu-button').click();
  await page.waitForTimeout(100);
  const opened = await page.evaluate(() => {
    const visible = (element) => Boolean(element && element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0);
    const logout = [...document.querySelectorAll('button')].find((element) => element.textContent?.trim().toLowerCase() === 'logout' && visible(element));
    const menu = document.querySelector('details[open] .nav-menu-panel');
    const rect = menu?.getBoundingClientRect();
    return {
      logoutVisible: visible(logout),
      menuLeft: rect?.left,
      menuRight: rect?.right,
      menuInsideViewport: Boolean(rect && rect.left >= 0 && rect.right <= document.documentElement.clientWidth)
    };
  });

  if (width === 320) await page.screenshot({ path: 'mobile-header-320.png', fullPage: false });
  if (width === 390) await page.screenshot({ path: 'mobile-header-390.png', fullPage: false });
  results.push({ width, closed, opened });
  await context.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
