/** Labelled contact sheet of chosen frame ranges, for picking new stills. */
import sharp from 'sharp';

const frame = (n) => `public/hodu-frames/frame_${String(n).padStart(6, '0')}.png`;
const RANGES = process.env.RANGES ?? '100-136:4,195-239:3';
const COLS = 5;
const W = 320;
const H = 180;
const LABEL = 16;

const picks = [];
for (const spec of RANGES.split(',')) {
  const [range, step] = spec.split(':');
  const [a, b] = range.split('-').map(Number);
  for (let n = a; n <= b; n += Number(step ?? 1)) picks.push(n);
}

const rows = Math.ceil(picks.length / COLS);
const tiles = [];
for (const [i, n] of picks.entries()) {
  const left = (i % COLS) * W;
  const top = Math.floor(i / COLS) * (H + LABEL);
  tiles.push({
    input: await sharp(frame(n)).resize(W, H).png().toBuffer(),
    left,
    top: top + LABEL,
  });
  tiles.push({
    input: Buffer.from(
      `<svg width="${W}" height="${LABEL}"><rect width="${W}" height="${LABEL}" fill="#111"/><text x="4" y="12" font-family="monospace" font-size="12" fill="#fff">frame ${n}</text></svg>`,
    ),
    left,
    top,
  });
}

await sharp({
  create: {
    width: W * COLS,
    height: rows * (H + LABEL),
    channels: 3,
    background: '#ffffff',
  },
})
  .composite(tiles)
  .jpeg({ quality: 82 })
  .toFile('shots/frame-sheet.jpg');

console.log(`${picks.length} frames -> shots/frame-sheet.jpg`);
