/**
 * Design-review screenshots. Captures each section in real-viewport chunks so
 * what you see is the true layout at that breakpoint, rather than a clip taken
 * at a viewport the CSS never sees.
 *
 * Scrolls with wheel events because Lenis owns the scroll position.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = process.env.URL ?? 'http://localhost:5173/';
const WIDTH = Number(process.env.W ?? 1440);
const HEIGHT = Number(process.env.H ?? 900);
const ONLY = process.env.ONLY?.split(',');
const OUT = `shots/review/${WIDTH}`;

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
});
const page = await context.newPage();
page.on('pageerror', (e) => console.log(`pageerror: ${e.message.slice(0, 160)}`));

await page.goto(URL, { waitUntil: 'load' });
await page.waitForTimeout(3500);

async function wheelTo(targetY) {
  const step = Math.round(HEIGHT * 0.6);
  for (let guard = 0; guard < 500; guard += 1) {
    const y = await page.evaluate(() => window.scrollY);
    if (Math.abs(targetY - y) < 24) break;
    const delta = targetY - y;
    await page.mouse.wheel(0, Math.sign(delta) * Math.min(step, Math.abs(delta)));
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(450);
}

const sections = await page.evaluate(() =>
  [...document.querySelectorAll('main > section, main > div > section')].map((el) => ({
    id: el.id || 'cta',
    top: Math.round(el.getBoundingClientRect().top + window.scrollY),
    height: Math.round(el.getBoundingClientRect().height),
  })),
);

// Warm every ScrollTrigger first, so nothing is captured mid-reveal.
await wheelTo(await page.evaluate(() => document.body.scrollHeight));
await page.waitForTimeout(600);

for (const s of sections) {
  if (s.id === 'home') continue; // pinned hero spans several viewports
  if (ONLY && !ONLY.includes(s.id)) continue;

  const chunks = Math.min(4, Math.ceil(s.height / HEIGHT));
  for (let c = 0; c < chunks; c += 1) {
    await wheelTo(s.top + c * HEIGHT);
    const name = chunks > 1 ? `${s.id}-${c + 1}` : s.id;
    await page.screenshot({ path: `${OUT}/${name}.png` });
    console.log(`${OUT}/${name}.png`);
  }
}

await browser.close();
