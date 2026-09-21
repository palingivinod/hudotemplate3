/**
 * Build-time asset pipeline for the HODU demo.
 *
 * 1. Reads the original PNG frames in public/hodu-frames, sorts them
 *    NUMERICALLY, and writes an ordered manifest the hero canvas consumes.
 * 2. Derives a lightweight WebP tier used only on small screens / save-data
 *    connections. The original PNGs stay untouched and remain the desktop
 *    render source.
 * 3. Derives responsive stills for the editorial sections from chosen frames,
 *    so the page never requests a 1 MB PNG for a static image.
 *
 * Safe to re-run: existing outputs are skipped.
 */
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const FRAMES_DIR = path.join(root, 'public', 'hodu-frames');
const LITE_DIR = path.join(root, 'public', 'hodu-frames-lite');
const STILLS_DIR = path.join(root, 'public', 'stills');
const MANIFEST = path.join(root, 'public', 'hodu-frames', 'manifest.json');

/** Lightweight mobile tier: same 16:9 composition, smaller payload. */
const LITE_WIDTH = 960;
const LITE_QUALITY = 74;

/** Responsive widths for the editorial section stills. */
const STILL_WIDTHS = [1920, 1280, 800];

/**
 * Frames chosen as editorial imagery. Keys become /stills/<key>-<w>.webp.
 * Every one of these is a real frame from the supplied HODU sequence.
 */
const STILLS = {
  /* Indices scaled for the 432-frame hodu_frames2 sequence (was 240). */
  'about-threshold': 25,
  'philosophy-dusk': 384,
  'architecture-entry': 40,
  'villa-signature': 416,
  'interior-01': 83,
  'interior-02': 112,
  'interior-03': 153,
  'interior-04': 166,
  'interior-05': 191,
  'interior-06': 218,
  'interior-07': 254,
  'interior-08': 297,
  'interior-09': 332,
  'materials-detail': 159,
  'lifestyle-wide': 395,
  'location-aerial': 366,
  'why-hodu': 240,
  'project-01': 7,
  'project-02': 94,
  'project-03': 339,
  'project-04': 425,
  'brand-statement': 285,
  'final-cta': 411,
  'gallery-bedroom': 195,
  'gallery-bathroom': 216,
  'gallery-stair': 238,
  'gallery-garden': 373,
  'gallery-pool': 400,
  'gallery-night': 427,
};

/**
 * Square material swatches for the Materials palette, cropped out of the
 * supplied frames so the thumbnails are real HODU imagery rather than stock
 * texture. Values are [frame, left, top, size] in source pixels.
 */
const SWATCHES = {
  stone: [153, 430, 380, 180],
  timber: [198, 140, 90, 200],
  glass: [198, 980, 60, 180],
  metal: [40, 330, 140, 200],
  finishes: [254, 60, 60, 200],
  flooring: [83, 400, 560, 150],
  lighting: [112, 520, 60, 150],
  kitchen: [153, 150, 250, 180],
  bathroom: [216, 400, 150, 180],
};

/** 1x and 2x for a 48px thumbnail. */
const SWATCH_SIZES = [96, 192];

function frameIndexFromName(name) {
  const match = name.match(/(\d+)(?=\.png$)/i);
  return match ? Number.parseInt(match[1], 10) : Number.NaN;
}

function readOrderedFrames() {
  if (!existsSync(FRAMES_DIR)) {
    throw new Error(
      `Missing ${path.relative(root, FRAMES_DIR)}. Extract hodu_frames.zip into it first.`,
    );
  }
  return readdirSync(FRAMES_DIR)
    .filter((f) => f.toLowerCase().endsWith('.png'))
    .map((f) => ({ file: f, index: frameIndexFromName(f) }))
    .sort((a, b) => {
      // Numeric ordering, so frame_10 never sorts before frame_2.
      if (Number.isNaN(a.index) || Number.isNaN(b.index)) {
        return a.file.localeCompare(b.file, 'en', { numeric: true });
      }
      return a.index - b.index;
    });
}

function loadSharp() {
  try {
    return require('sharp');
  } catch {
    return null;
  }
}

async function main() {
  const ordered = readOrderedFrames();
  if (ordered.length === 0) throw new Error('No PNG frames found in public/hodu-frames.');

  const sharp = loadSharp();
  let width = 1280;
  let height = 720;

  if (sharp) {
    const meta = await sharp(path.join(FRAMES_DIR, ordered[0].file)).metadata();
    width = meta.width ?? width;
    height = meta.height ?? height;
  }

  const bytes = ordered.reduce(
    (sum, f) => sum + statSync(path.join(FRAMES_DIR, f.file)).size,
    0,
  );

  writeFileSync(
    MANIFEST,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: ordered.length,
        width,
        height,
        aspectRatio: Number((width / height).toFixed(6)),
        totalBytes: bytes,
        // Ordered, not sorted at runtime. Index === playback position.
        frames: ordered.map((f) => f.file),
      },
      null,
      2,
    )}\n`,
  );

  console.log(
    `manifest: ${ordered.length} frames @ ${width}x${height} (${(bytes / 1024 / 1024).toFixed(1)} MB PNG)`,
  );

  if (!sharp) {
    console.warn('sharp unavailable - skipped lite tier and stills generation.');
    return;
  }

  mkdirSync(LITE_DIR, { recursive: true });
  mkdirSync(STILLS_DIR, { recursive: true });

  let liteMade = 0;
  for (const { file } of ordered) {
    const out = path.join(LITE_DIR, file.replace(/\.png$/i, '.webp'));
    if (existsSync(out)) continue;
    await sharp(path.join(FRAMES_DIR, file))
      .resize({ width: LITE_WIDTH, withoutEnlargement: true })
      .webp({ quality: LITE_QUALITY, effort: 4 })
      .toFile(out);
    liteMade += 1;
  }
  console.log(`lite tier: ${liteMade} new / ${ordered.length} total @ ${LITE_WIDTH}px webp`);

  const byIndex = new Map(ordered.map((f) => [f.index, f.file]));
  let stillsMade = 0;
  for (const [key, frame] of Object.entries(STILLS)) {
    const source = byIndex.get(frame);
    if (!source) {
      console.warn(`still "${key}": frame ${frame} not found, skipping.`);
      continue;
    }
    for (const w of STILL_WIDTHS) {
      const out = path.join(STILLS_DIR, `${key}-${w}.webp`);
      if (existsSync(out)) continue;
      await sharp(path.join(FRAMES_DIR, source))
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: w >= 1600 ? 88 : 84, effort: 5 })
        .toFile(out);
      stillsMade += 1;
    }
  }
  console.log(`stills: ${stillsMade} new files in public/stills`);

  let swatchesMade = 0;
  for (const [key, [frame, left, top, size]] of Object.entries(SWATCHES)) {
    const source = byIndex.get(frame);
    if (!source) {
      console.warn(`swatch "${key}": frame ${frame} not found, skipping.`);
      continue;
    }
    for (const s of SWATCH_SIZES) {
      const out = path.join(STILLS_DIR, `swatch-${key}-${s}.webp`);
      if (existsSync(out)) continue;
      await sharp(path.join(FRAMES_DIR, source))
        .extract({ left, top, width: size, height: size })
        .resize(s, s)
        .webp({ quality: 86, effort: 5 })
        .toFile(out);
      swatchesMade += 1;
    }
  }
  console.log(`swatches: ${swatchesMade} new files in public/stills`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
