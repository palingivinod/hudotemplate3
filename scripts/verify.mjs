/**
 * Homepage health check across breakpoints: horizontal overflow, console
 * errors, heading structure, section heights and stranded reveal animations.
 *
 * Scrolling goes through real wheel events. Lenis owns the scroll position, so
 * `window.scrollTo` gets reverted on the next animation frame and sections
 * never enter the viewport — which reads as dozens of "stuck" reveals that are
 * actually fine for a human.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = process.env.URL ?? 'http://localhost:5173/';
const OUT = 'shots/home';
const SHOOT = (process.env.SHOOT ?? '1440,390').split(',');
const VIEWPORTS = [
  { name: '1920', width: 1920, height: 1080 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1024', width: 1024, height: 768 },
  { name: '768', width: 768, height: 1024 },
  { name: '390', width: 390, height: 844 },
  { name: '360', width: 360, height: 740 },
];

/* Scroll-driven hero overlays are meant to sit at zero opacity at the top of
   the page; they are not stranded reveals. */
const INTENTIONALLY_HIDDEN = ['hero__cue', 'hero__dissolve', 'hero__veil'];

mkdirSync(OUT, { recursive: true });

async function wheelTo(page, targetY, viewportH) {
  const step = Math.round(viewportH * 0.6);
  for (let guard = 0; guard < 400; guard += 1) {
    const y = await page.evaluate(() => window.scrollY);
    const delta = targetY - y;
    if (Math.abs(delta) < step * 0.5) break;
    await page.mouse.wheel(0, Math.sign(delta) * step);
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(350);
}

const browser = await chromium.launch();
let failures = 0;

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const problems = [];
  page.on('console', (m) => {
    if (m.type() === 'error') problems.push(`console: ${m.text().slice(0, 200)}`);
  });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message.slice(0, 200)}`));

  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(3500); // loader dismiss + first frames

  // Walk the whole page so every ScrollTrigger and lazy image fires.
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  await wheelTo(page, pageHeight, vp.height);
  await page.waitForTimeout(800);

  const report = await page.evaluate((intentional) => {
    const doc = document.documentElement;

    const sections = [...document.querySelectorAll('main > section, main > div > section')].map(
      (el) => {
        const r = el.getBoundingClientRect();
        return {
          id: el.id || '(none)',
          cls: el.className.split(' ').filter((c) => !c.startsWith('section'))[0] ?? '',
          h: Math.round(r.height),
          top: Math.round(r.top + window.scrollY),
        };
      },
    );

    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((el) => ({
      level: Number(el.tagName[1]),
      text: (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 52),
    }));

    const stuckEls = [...document.querySelectorAll('main *')].filter((el) => {
      const s = getComputedStyle(el);
      if (Number(s.opacity) > 0.02 || s.visibility === 'hidden') return false;
      const r = el.getBoundingClientRect();
      if (r.height <= 8 || r.width <= 8) return false;
      return !intentional.some((c) => el.classList.contains(c));
    });

    const stuckWhere = [
      ...new Set(
        stuckEls.map((el) => {
          const sec = el.closest('section');
          const cls = String(el.className).split(' ')[0] || el.tagName.toLowerCase();
          return `${sec?.id || '?'}:${cls}`;
        }),
      ),
    ].slice(0, 12);

    let widest = { sel: '', w: 0 };
    for (const el of document.querySelectorAll('main *, footer *')) {
      const r = el.getBoundingClientRect();
      const right = r.left + r.width + window.scrollX;
      if (right > widest.w) {
        widest = {
          w: Math.round(right),
          sel: `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}`,
        };
      }
    }

    return {
      overflow: doc.scrollWidth - doc.clientWidth,
      sections,
      headings,
      stuck: stuckEls.length,
      stuckWhere,
      widest,
    };
  }, INTENTIONALLY_HIDDEN);

  const h1s = report.headings.filter((h) => h.level === 1);

  // Heading levels must not skip (h2 -> h4), ignoring the footer's labels.
  const skips = [];
  let prev = 0;
  for (const h of report.headings) {
    if (prev && h.level > prev + 1) skips.push(`h${prev}->h${h.level} "${h.text}"`);
    prev = h.level;
  }

  const badOverflow = report.overflow > 1;
  const ok =
    problems.length === 0 &&
    !badOverflow &&
    h1s.length === 1 &&
    report.stuck === 0 &&
    skips.length === 0;
  if (!ok) failures += 1;

  console.log(`\n=== ${vp.name} (${vp.width}x${vp.height}) ${ok ? 'PASS' : 'FAIL'} ===`);
  console.log(
    `overflow ${report.overflow}px | stuck ${report.stuck} | h1 ${h1s.length} | heading-skips ${skips.length}`,
  );
  if (badOverflow) console.log(`  widest: ${report.widest.sel} @ ${report.widest.w}px`);
  if (report.stuck > 0) console.log(`  stuck in: ${report.stuckWhere.join(', ')}`);
  for (const s of skips.slice(0, 5)) console.log(`  skip: ${s}`);
  for (const p of problems.slice(0, 6)) console.log(`  ${p}`);
  console.log('  ' + report.sections.map((s) => `${s.id}=${s.h}`).join('  '));

  if (vp.name === '1440') {
    console.log('\nheading outline:');
    for (const h of report.headings) {
      console.log(`  ${'  '.repeat(h.level - 1)}h${h.level} ${h.text}`);
    }
  }

  if (SHOOT.includes(vp.name)) {
    for (const s of report.sections) {
      if (s.id === '(none)' || s.id === 'home') continue; // hero is many viewports tall
      await wheelTo(page, s.top, vp.height);
      const box = await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: 0, y: r.top, width: document.documentElement.clientWidth, height: r.height };
      }, s.id);
      if (!box || box.height < 20) continue;
      try {
        await page.screenshot({
          path: `${OUT}/${vp.name}-${s.id}.png`,
          clip: { ...box, y: Math.max(0, box.y), height: Math.min(box.height, 6000) },
        });
      } catch {
        /* clipped outside the viewport; metrics above already cover it */
      }
    }
  }

  await context.close();
}

await browser.close();
console.log(`\n${failures === 0 ? 'ALL BREAKPOINTS PASS' : `${failures} breakpoint(s) failing`}`);
process.exit(failures === 0 ? 0 : 1);
