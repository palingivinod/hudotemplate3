/** Captures the loading state and the hero-to-About dissolve. */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4173/';
mkdirSync('shots', { recursive: true });

const browser = await chromium.launch();

/* 1. Loading screen, on a throttled connection so it is actually visible. */
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const slow = await ctx.newPage();
const cdp = await ctx.newCDPSession(slow);
await cdp.send('Network.enable');
await cdp.send('Network.emulateNetworkConditions', {
  offline: false,
  latency: 120,
  downloadThroughput: (2.5 * 1024 * 1024) / 8,
  uploadThroughput: (1 * 1024 * 1024) / 8,
});
slow.goto(BASE, { waitUntil: 'load' }).catch(() => {});
await slow.waitForSelector('.loader', { timeout: 30000 });
await slow.waitForTimeout(2600);
const loaderState = await slow.evaluate(() => ({
  visible: Boolean(document.querySelector('.loader:not(.loader--out)')),
  percent: document.querySelector('.loader__count span')?.textContent,
  label: document.querySelector('.loader__label')?.textContent,
  barScale: document.querySelector('.loader__bar')?.style.transform,
}));
console.log(`loading screen: ${JSON.stringify(loaderState)}`);
await slow.screenshot({ path: 'shots/loading.png' });
await ctx.close();

/* 2. Hero -> About dissolve. */
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE, { waitUntil: 'load', timeout: 120000 });
await page.waitForFunction(() => !document.querySelector('.loader:not(.loader--out)'), {
  timeout: 120000,
});
await page.waitForTimeout(2200);

const hero = await page.evaluate(() => {
  const el = document.querySelector('.hero');
  return { top: el.offsetTop, height: el.offsetHeight };
});

for (const p of [0.93, 0.97, 0.995, 1.0]) {
  await page.evaluate(
    ({ top, height, vh, prog }) => window.scrollTo(0, top + (height - vh) * prog),
    { top: hero.top, height: hero.height, vh: 900, prog: p },
  );
  await page.waitForTimeout(1100);
  const state = await page.evaluate(() => ({
    dissolve: Number(getComputedStyle(document.querySelector('.hero__dissolve')).opacity).toFixed(2),
    contentOpacity: Number(getComputedStyle(document.querySelector('.hero__content')).opacity).toFixed(2),
    headerSolid: document.querySelector('.hdr').classList.contains('hdr--solid'),
  }));
  console.log(`hero ${(p * 100).toFixed(1)}%: ${JSON.stringify(state)}`);
  await page.screenshot({ path: `shots/dissolve-${Math.round(p * 1000)}.png` });
}

/* Just past the hero: About should own the viewport. */
await page.evaluate(({ top, height }) => window.scrollTo(0, top + height - 200), hero);
await page.waitForTimeout(1200);
await page.screenshot({ path: 'shots/dissolve-into-about.png' });
console.log('captured hand-off into About');

await browser.close();
