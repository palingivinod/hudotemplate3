/** Exercises the homepage's interactive pieces and asserts observable results. */
import { chromium } from 'playwright';

const URL = process.env.URL ?? 'http://localhost:5173/';
const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

await page.goto(URL, { waitUntil: 'load' });
await page.waitForTimeout(3500);

/* ---- Every nav and footer anchor resolves to a real section ---- */
const anchors = await page.evaluate(() => {
  const hrefs = new Set();
  for (const el of document.querySelectorAll('.hdr__link, .foot__nav a, .mnav__list a')) {
    const h = el.getAttribute('href');
    if (h?.startsWith('#')) hrefs.add(h);
  }
  return [...hrefs].map((h) => ({ href: h, found: Boolean(document.querySelector(h)) }));
});
const broken = anchors.filter((a) => !a.found);
check(
  'nav anchors resolve',
  broken.length === 0,
  broken.length ? `missing: ${broken.map((b) => b.href).join(', ')}` : `${anchors.length} checked`,
);

/* ---- Architecture principle tabs ---- */
await page.locator('#architecture').scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
const panelBefore = await page.locator('.arch__panel-title').innerText();
await page.locator('.arch__tab').nth(2).click();
await page.waitForTimeout(500);
const panelAfter = await page.locator('.arch__panel-title').innerText();
check(
  'architecture tabs switch panel',
  panelBefore !== panelAfter && /SPACE/i.test(panelAfter),
  `${panelBefore.trim()} -> ${panelAfter.trim()}`,
);

const selected = await page.locator('.arch__tab[aria-selected="true"]').count();
check('exactly one tab selected', selected === 1, `${selected} selected`);

await page.locator('.arch__tab').nth(2).press('ArrowRight');
await page.waitForTimeout(400);
const afterKey = await page.locator('.arch__panel-title').innerText();
check('arrow key moves tabs', /LANDSCAPE/i.test(afterKey), afterKey.trim());

/* ---- FAQ accordion ---- */
await page.locator('#faq').scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
const faqTrigger = page.locator('.faq__trigger').nth(3);
await faqTrigger.click();
await page.waitForTimeout(400);
check(
  'faq item opens',
  (await faqTrigger.getAttribute('aria-expanded')) === 'true',
  'item 04 expanded',
);
const openCount = await page.locator('.faq__trigger[aria-expanded="true"]').count();
check('faq is single-open', openCount === 1, `${openCount} open`);

/* ---- Schedule a Site Visit seeds the message ---- */
await page.locator('#contact').scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
await page.locator('.enq__visit').click();
await page.waitForTimeout(400);
const seeded = await page.locator('#enq-message').inputValue();
check('site visit seeds message', /schedule a site visit/i.test(seeded), seeded.slice(0, 48));

/* ---- Validation: submit empty ---- */
await page.locator('#enq-message').fill('');
await page.locator('.enq__submit').click();
await page.waitForTimeout(400);
const errCount = await page.locator('.enq__error').count();
check('validation blocks empty submit', errCount >= 4, `${errCount} field errors`);

/* Optional preference fields must not be required. */
const optionalErrors = await page.evaluate(
  () =>
    ['enq-location', 'enq-villaType', 'enq-budget'].filter((id) =>
      document.querySelector(`#${id}-error`),
    ).length,
);
check('preference fields are optional', optionalErrors === 0);

/* ---- Happy path ---- */
await page.locator('#enq-name').fill('Asha Rao');
await page.locator('#enq-phone').fill('9876543210');
await page.locator('#enq-email').fill('asha@example.com');
await page.locator('#enq-message').fill('Interested in a four bedroom villa near Mangalagiri.');
await page.locator('.enq__submit').click();
await page.waitForTimeout(1400);
const success = await page.locator('.enq__success').count();
const successText = success ? await page.locator('.enq__success-title').innerText() : '';
check('valid submit shows confirmation', success === 1 && /Asha/.test(successText), successText);

/* ---- Header compacts past the hero ---- */
const heroTop = await page.evaluate(() => {
  const h = document.querySelector('.hdr');
  return h ? Math.round(h.getBoundingClientRect().height) : 0;
});
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(700);
const isSolid = await page.locator('.hdr--solid').count();
check('header is transparent over hero', isSolid === 0);
const scrolledH = await page.evaluate(() => {
  const h = document.querySelector('.hdr');
  return h ? Math.round(h.getBoundingClientRect().height) : 0;
});
check('header compacts on scroll', heroTop < scrolledH, `${scrolledH}px -> ${heroTop}px`);

/* ---- Testimonials stay hidden with no data ---- */
const testi = await page.locator('#testimonials').count();
check('testimonials hidden without data', testi === 0);

check('no console or page errors', errors.length === 0, errors.slice(0, 2).join(' | '));

await browser.close();
const failed = results.filter((r) => !r.pass).length;
console.log(`\n${failed === 0 ? 'ALL INTERACTIONS PASS' : `${failed} failing`}`);
process.exit(failed === 0 ? 0 : 1);
