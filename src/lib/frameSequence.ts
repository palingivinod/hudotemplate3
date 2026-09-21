/**
 * Progressive frame-sequence loader for the HODU hero.
 *
 * The sequence is 432 original PNG frames, so nothing here waits for
 * a complete download. Frames arrive in an interlaced order — a coarse pass
 * across the whole timeline first, then repeated refinement passes — which
 * means the entire scroll range is scrubbable while detail keeps filling in.
 * Whatever frame the scroll asks for, the store answers with the nearest frame
 * it already holds, so the canvas never stalls.
 */

export interface FrameManifest {
  count: number;
  width: number;
  height: number;
  aspectRatio: number;
  frames: string[];
}

export type FrameTier = 'original' | 'lite';

const ORIGINAL_DIR = '/hodu-frames';
const LITE_DIR = '/hodu-frames-lite';

/** Coarsest pass. 432 / 16 ≈ 27 frames make the whole sequence scrubbable. */
const FIRST_PASS_STRIDE = 16;

export async function loadManifest(): Promise<FrameManifest> {
  const res = await fetch(`${ORIGINAL_DIR}/manifest.json`);
  if (!res.ok) throw new Error(`Frame manifest failed to load (${res.status}).`);
  const data = (await res.json()) as FrameManifest;
  if (!Array.isArray(data.frames) || data.frames.length === 0) {
    throw new Error('Frame manifest is empty.');
  }
  return data;
}

/**
 * Picks the render tier. The original PNGs are the default so the desktop
 * experience uses the untouched source; small screens and metered connections
 * get the derived WebP tier instead of 220 MB of PNG.
 */
export function pickTier(): FrameTier {
  if (typeof window === 'undefined') return 'original';

  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string; downlink?: number };
    }
  ).connection;

  if (conn?.saveData) return 'lite';
  if (conn?.effectiveType && /(^|-)(2g|3g)$/.test(conn.effectiveType)) return 'lite';
  // An original frame is ~940 KB. Below roughly 5 Mbit/s the coarse pass takes
  // long enough to be felt, so the derived tier gives a far better arrival.
  if (typeof conn?.downlink === 'number' && conn.downlink > 0 && conn.downlink < 5) return 'lite';

  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof deviceMemory === 'number' && deviceMemory <= 4) return 'lite';

  const narrow = Math.min(window.innerWidth, window.innerHeight) <= 820;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (narrow && coarse) return 'lite';

  return 'original';
}

function frameUrl(file: string, tier: FrameTier): string {
  return tier === 'lite'
    ? `${LITE_DIR}/${file.replace(/\.png$/i, '.webp')}`
    : `${ORIGINAL_DIR}/${file}`;
}

/**
 * Interlaced load order: 0 and the last frame, then stride 16, 8, 4, 2, 1.
 * Each pass doubles temporal resolution across the entire sequence rather than
 * finishing the beginning before the middle exists.
 */
export function buildLoadOrder(count: number): number[] {
  const order: number[] = [];
  const seen = new Uint8Array(count);

  const push = (i: number) => {
    if (i >= 0 && i < count && !seen[i]) {
      seen[i] = 1;
      order.push(i);
    }
  };

  push(0);
  push(count - 1);

  for (let stride = FIRST_PASS_STRIDE; stride >= 1; stride = Math.floor(stride / 2)) {
    for (let i = 0; i < count; i += stride) push(i);
    if (stride === 1) break;
  }
  for (let i = 0; i < count; i += 1) push(i);

  return order;
}

/** Number of frames in the first pass, used to gate the loading screen. */
export function firstPassSize(count: number): number {
  return Math.ceil(count / FIRST_PASS_STRIDE) + 1;
}

function decodeImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;

    const settle = () => {
      // decode() keeps the first paint of each frame off the main thread.
      if (typeof img.decode === 'function') {
        img.decode().then(() => resolve(img), () => resolve(img));
      } else {
        resolve(img);
      }
    };

    if (img.complete && img.naturalWidth > 0) {
      settle();
      return;
    }
    img.onload = settle;
    img.onerror = () => reject(new Error(`Frame failed: ${src}`));
  });
}

export interface FrameStoreEvents {
  /** Fires as frames land, throttled to once per animation frame by the caller. */
  onProgress?: (loaded: number, total: number) => void;
  /** Fires once the coarse pass is in memory and the hero can be revealed. */
  onReady?: () => void;
  onError?: (error: Error) => void;
}

export class FrameStore {
  readonly count: number;
  readonly width: number;
  readonly height: number;
  readonly tier: FrameTier;

  private readonly files: string[];
  private readonly images: (HTMLImageElement | null)[];
  private readonly order: number[];
  private readonly claimed: Uint8Array;
  private readonly concurrency: number;

  private cursor = 0;
  private inFlight = 0;
  private loadedCount = 0;
  private readyFired = false;
  private destroyed = false;
  private readyTimer = 0;
  private startedAt = 0;
  private readonly readyThreshold: number;

  /** Current scroll position, used to preempt the queue near the playhead. */
  private priority = 0;

  private events: FrameStoreEvents = {};

  constructor(manifest: FrameManifest, tier: FrameTier) {
    this.count = manifest.frames.length;
    this.width = manifest.width;
    this.height = manifest.height;
    this.tier = tier;
    this.files = manifest.frames;
    this.images = new Array(this.count).fill(null);
    this.order = buildLoadOrder(this.count);
    this.claimed = new Uint8Array(this.count);
    this.readyThreshold = Math.min(this.count, firstPassSize(this.count));
    this.concurrency = tier === 'lite' ? 8 : 6;
  }

  get loaded(): number {
    return this.loadedCount;
  }

  /** 0–1 across the coarse pass; drives the loading screen counter. */
  get readyProgress(): number {
    return Math.min(1, this.loadedCount / this.readyThreshold);
  }

  get fullProgress(): number {
    return this.loadedCount / this.count;
  }

  get isComplete(): boolean {
    return this.loadedCount >= this.count;
  }

  /**
   * `readyTimeoutMs` is a safety net: however slow the connection, the hero is
   * revealed once the first frame exists rather than waiting for the whole
   * coarse pass. Later frames keep streaming in behind the visitor.
   */
  start(events: FrameStoreEvents = {}, readyTimeoutMs = 6000): void {
    this.events = events;
    this.startedAt = Date.now();
    if (readyTimeoutMs > 0) {
      this.readyTimer = window.setTimeout(() => this.fireReadyIfPossible(), readyTimeoutMs);
    }
    this.pump();
  }

  /** 0–1 ramp over the ready timeout, so the counter never appears frozen. */
  get elapsedFraction(): number {
    if (this.startedAt === 0) return 0;
    return Math.min(1, (Date.now() - this.startedAt) / 6000);
  }

  private fireReadyIfPossible(): void {
    if (this.readyFired || this.destroyed) return;
    if (!this.images[0]) {
      // First frame still in flight; check again shortly.
      this.readyTimer = window.setTimeout(() => this.fireReadyIfPossible(), 400);
      return;
    }
    this.readyFired = true;
    window.clearTimeout(this.readyTimer);
    this.events.onReady?.();
  }

  setPriority(index: number): void {
    this.priority = index;
  }

  has(index: number): boolean {
    return this.images[index] !== null;
  }

  get(index: number): HTMLImageElement | null {
    return this.images[index] ?? null;
  }

  /**
   * Nearest already-decoded frame, searching outward. Keeps the canvas moving
   * when the requested frame has not arrived yet.
   */
  nearest(index: number): HTMLImageElement | null {
    const exact = this.images[index];
    if (exact) return exact;

    for (let offset = 1; offset < this.count; offset += 1) {
      const before = index - offset;
      if (before >= 0 && this.images[before]) return this.images[before];
      const after = index + offset;
      if (after < this.count && this.images[after]) return this.images[after];
    }
    return null;
  }

  destroy(): void {
    this.destroyed = true;
    window.clearTimeout(this.readyTimer);
    this.events = {};
    this.images.fill(null);
  }

  /**
   * Frames within this window of the playhead jump the queue, so fast scrolling
   * to an unloaded region resolves quickly instead of waiting for its turn.
   */
  private nextPriorityIndex(): number | null {
    const radius = 8;
    for (let offset = 0; offset <= radius; offset += 1) {
      const ahead = this.priority + offset;
      if (ahead < this.count && !this.images[ahead] && !this.claimed[ahead]) return ahead;
      const behind = this.priority - offset;
      if (behind >= 0 && !this.images[behind] && !this.claimed[behind]) return behind;
    }
    return null;
  }

  private nextQueuedIndex(): number | null {
    while (this.cursor < this.order.length) {
      const index = this.order[this.cursor];
      this.cursor += 1;
      if (!this.images[index] && !this.claimed[index]) return index;
    }
    return null;
  }

  private pump(): void {
    if (this.destroyed) return;

    while (this.inFlight < this.concurrency) {
      const index = this.nextPriorityIndex() ?? this.nextQueuedIndex();
      if (index === null) break;
      this.fetchFrame(index);
    }
  }

  private fetchFrame(index: number): void {
    this.claimed[index] = 1;
    this.inFlight += 1;

    decodeImage(frameUrl(this.files[index], this.tier))
      .then((img) => {
        if (this.destroyed) return;
        this.images[index] = img;
        this.loadedCount += 1;
        this.events.onProgress?.(this.loadedCount, this.count);

        if (!this.readyFired && this.loadedCount >= this.readyThreshold) {
          this.readyFired = true;
          window.clearTimeout(this.readyTimer);
          this.events.onReady?.();
        }
      })
      .catch((err: Error) => {
        this.claimed[index] = 0;
        if (!this.destroyed) this.events.onError?.(err);
      })
      .finally(() => {
        this.inFlight -= 1;
        if (!this.destroyed) this.pump();
      });
  }
}

/**
 * Cover-fit geometry, matching CSS `object-fit: cover` — the frame always fills
 * the viewport and is cropped symmetrically, never stretched.
 */
export function coverRect(
  targetW: number,
  targetH: number,
  sourceW: number,
  sourceH: number,
): { x: number; y: number; w: number; h: number; scale: number } {
  const scale = Math.max(targetW / sourceW, targetH / sourceH);
  const w = sourceW * scale;
  const h = sourceH * scale;
  return { x: (targetW - w) / 2, y: (targetH - h) / 2, w, h, scale };
}

/**
 * Canvas backing-store scale.
 *
 * The source frames are 1280x720, so rendering a 1920px-wide viewport at
 * devicePixelRatio 2 would allocate 4x the pixels for detail the source does
 * not contain. This caps the backing store at the point where extra pixels stop
 * buying sharpness, which keeps memory sane on phones with DPR 3.
 */
export function renderScale(
  cssW: number,
  cssH: number,
  sourceW: number,
  sourceH: number,
  dpr: number,
): number {
  const cover = Math.max(cssW / sourceW, cssH / sourceH);
  const useful = Math.max(1, Math.min(2, 1.4 / cover));
  return Math.min(Math.max(dpr, 1), useful);
}
