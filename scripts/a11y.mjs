/** Keyboard order, focus visibility and semantic-structure audit. */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4173/';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE, { waitUntil: 'load', timeout: 120000 });
await page.waitForFunction(() => !document.querySelector('.loader:not(.loader--out)'), {
  timeout: 120000,
});
await page.waitForTimeout(2000);

const seq = [];
for (let i = 0; i < 13; i += 1) {
  await page.keyboard.press('Tab');
  seq.push(
    await page.evaluate(() => {
      const a = document.activeElement;
      if (!a) return 'none';
      const cs = getComputedStyle(a);
      const name = `${a.tagName.toLowerCase()}.${(a.className || '').toString().split(' ')[0]}`;
      const ring = cs.outlineStyle !== 'none' ? cs.outlineColor.replace(/\s/g, '') : 'NONE';
      return `${name.slice(0, 32).padEnd(32)} outline:${ring}`;
    }),
  );
}
console.log('TAB ORDER');
seq.forEach((s, i) => console.log(`  ${String(i + 1).padStart(2)}. ${s}`));

/* FAQ via keyboard */
await page.evaluate(() => document.getElementById('contact')?.scrollIntoView());
await page.waitForTimeout(600);
const trigger = page.locator('.faq__trigger').nth(1);
await trigger.focus();
await page.keyboard.press('Enter');
await page.waitForTimeout(500);
const openedByKey = await page
  .locator('.faq__item')
  .nth(1)
  .evaluate((el) => el.classList.contains('is-open'));
console.log(`\nfaq opens with Enter: ${openedByKey}`);

const audit = await page.evaluate(() => {
  const fields = Array.from(document.querySelectorAll('input, select, textarea'));
  return {
    imagesMissingAlt: Array.from(document.images).filter((i) => !i.hasAttribute('alt')).length,
    allFieldsLabelled: fields.every((el) => Boolean(document.querySelector(`label[for="${el.id}"]`))),
    fieldCount: fields.length,
    ariaExpandedControls: document.querySelectorAll('[aria-expanded]').length,
    h1Count: document.querySelectorAll('h1').length,
    lang: document.documentElement.lang,
    hasMain: Boolean(document.querySelector('main')),
    navCount: document.querySelectorAll('nav').length,
    skipLink: Boolean(document.querySelector('.skip-link')),
    jsonLd: Boolean(document.querySelector('script[type="application/ld+json"]')),
    ogTags: document.querySelectorAll('meta[property^="og:"]').length,
    twitterTags: document.querySelectorAll('meta[name^="twitter:"]').length,
    canonical: document.querySelector('link[rel=canonical]')?.getAttribute('href'),
  };
});
console.log(`\nAUDIT ${JSON.stringify(audit, null, 1)}`);

await browser.close();
