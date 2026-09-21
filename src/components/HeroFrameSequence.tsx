import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  FrameStore,
  coverRect,
  loadManifest,
  pickTier,
  renderScale,
  type FrameManifest,
} from '../lib/frameSequence';
import { clamp, lerp, progressBetween, prefersReducedMotion } from '../lib/motion';
import { scrollToSection } from '../lib/useSmoothScroll';
import { still } from '../lib/stills';
import './hero.css';

/** Fraction of the pinned scroll spent playing frames; the rest holds the last one. */
const PLAY_END = 1;

/**
 * The dissolve runs across the hero's exit — the final viewport after the pin
 * releases — so About can take over immediately as the sequence finishes.
 */
const DISSOLVE_FROM = 0;
const DISSOLVE_TO = 0.45;

interface HeroFrameSequenceProps {
  onReady: () => void;
  onProgress: (value: number) => void;
}

/**
 * Scroll-driven architectural walkthrough.
 *
 * Scroll position maps to a frame index which is drawn straight to a canvas
 * inside a single requestAnimationFrame loop. No React state is touched while
 * scrolling — the frame index, overlay opacities and canvas geometry all live
 * in refs, so scrubbing 432 frames never triggers a re-render.
 */
export function HeroFrameSequence({ onReady, onProgress }: HeroFrameSequenceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const dissolveRef = useRef<HTMLDivElement>(null);

  const storeRef = useRef<FrameStore | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const frameRef = useRef(0);
  const targetRef = useRef(0);
  const drawnRef = useRef(-1);
  const dirtyRef = useRef(true);
  const sizeRef = useRef({ w: 0, h: 0 });

  const [failed, setFailed] = useState(false);

  /* ---------- Load the sequence ---------- */
  useEffect(() => {
    let cancelled = false;
    let store: FrameStore | null = null;
    let ticker = 0;

    loadManifest()
      .then((manifest: FrameManifest) => {
        if (cancelled) return;
        store = new FrameStore(manifest, pickTier());
        storeRef.current = store;

        store.start({
          onProgress: () => {
            if (cancelled || !store) return;
            onProgress(store.readyProgress);
            dirtyRef.current = true;
          },
          onReady: () => {
            if (cancelled) return;
            window.clearInterval(ticker);
            onReady();
          },
          onError: (err) => console.warn(err.message),
        });

        /* On a slow connection whole seconds pass between frames landing, so
           the counter also tracks elapsed time to stay alive. */
        ticker = window.setInterval(() => {
          if (cancelled || !store) return;
          onProgress(Math.max(store.readyProgress, store.elapsedFraction * 0.92));
        }, 120);
      })
      .catch((err: Error) => {
        console.error(err);
        if (cancelled) return;
        setFailed(true);
        onReady();
      });

    return () => {
      cancelled = true;
      window.clearInterval(ticker);
      store?.destroy();
      storeRef.current = null;
    };
  }, [onReady, onProgress]);

  /* ---------- Canvas sizing, scroll mapping and rendering ---------- */
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    ctxRef.current = ctx;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const reduced = prefersReducedMotion();

    const resize = () => {
      const store = storeRef.current;
      const sourceW = store?.width ?? 1280;
      const sourceH = store?.height ?? 720;
      const cssW = canvas.clientWidth || window.innerWidth;
      const cssH = canvas.clientHeight || window.innerHeight;

      const scale = renderScale(cssW, cssH, sourceW, sourceH, window.devicePixelRatio || 1);
      const w = Math.round(cssW * scale);
      const h = Math.round(cssH * scale);

      if (w === sizeRef.current.w && h === sizeRef.current.h) return;

      sizeRef.current = { w, h };
      canvas.width = w;
      canvas.height = h;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      // Re-render the frame we were already on; resizing must not restart it.
      dirtyRef.current = true;
    };

    const draw = (index: number) => {
      const store = storeRef.current;
      if (!store) return;

      const img = store.nearest(index);
      if (!img) return;

      const { w, h } = sizeRef.current;
      const rect = coverRect(w, h, img.naturalWidth, img.naturalHeight);
      ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h);
      drawnRef.current = store.has(index) ? index : -1;
    };

    let rafId = 0;

    const tick = () => {
      rafId = requestAnimationFrame(tick);

      const store = storeRef.current;
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const travel = section.offsetHeight - viewport;
      const past = -rect.top;
      const progress = travel > 0 ? clamp(past / travel, 0, 1) : 0;
      // How far the released pin has scrolled off, 0 at release and 1 once gone.
      const exit = clamp((past - travel) / viewport, 0, 1);

      /* Overlay states, written directly to style to avoid re-renders. */
      const content = contentRef.current;
      if (content) {
        const fade = progressBetween(progress, 0.06, 0.24);
        content.style.opacity = `${1 - fade}`;
        content.style.transform = `translate3d(0, ${-fade * 42}px, 0)`;
        content.style.visibility = fade >= 1 ? 'hidden' : 'visible';
      }

      const cue = cueRef.current;
      if (cue) {
        const cueFade = progressBetween(progress, 0.01, 0.08);
        cue.style.opacity = `${1 - cueFade}`;
      }

      const dissolve = dissolveRef.current;
      if (dissolve) {
        dissolve.style.opacity = `${progressBetween(exit, DISSOLVE_FROM, DISSOLVE_TO)}`;
      }

      if (!store) return;

      const last = store.count - 1;
      const play = clamp(progress / PLAY_END, 0, 1);
      targetRef.current = play * last;

      // Easing the index toward its target smooths the hand-off between
      // frames that are already decoded and ones that just arrived.
      if (reduced) {
        frameRef.current = targetRef.current;
      } else {
        const next = lerp(frameRef.current, targetRef.current, 0.38);
        frameRef.current = Math.abs(next - targetRef.current) < 0.01 ? targetRef.current : next;
      }

      const index = Math.round(frameRef.current);
      store.setPriority(index);

      if (index !== drawnRef.current || dirtyRef.current) {
        dirtyRef.current = false;
        draw(index);
      }
    };

    resize();
    rafId = requestAnimationFrame(tick);

    const onResize = () => {
      resize();
      dirtyRef.current = true;
    };

    const observer = new ResizeObserver(onResize);
    observer.observe(canvas);
    window.addEventListener('orientationchange', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('orientationchange', onResize);
      ctxRef.current = null;
    };
  }, []);

  return (
    <section ref={sectionRef} id="home" className="hero" aria-label="HODU villa walkthrough">
      <div className="hero__pin">
        {failed ? (
          <img className="hero__fallback" src={still('hero-villa', 1920)} alt="" aria-hidden="true" />
        ) : (
          <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
        )}

        <div className="hero__veil" aria-hidden="true" />

        <div ref={contentRef} className="hero__content">
          <div className="shell hero__inner">
            <p className="hero__eyebrow">HODU Private Villas</p>
            <h1 className="hero__title">
              <span className="hero__line">
                <span>Private Villas,</span>
              </span>
              <span className="hero__line">
                <span>Thoughtfully Designed.</span>
              </span>
            </h1>
            <p className="hero__copy">
              HODU designs, builds and delivers private luxury villas with architecture, interiors,
              landscape and construction quality handled as one integrated process.
            </p>
            <div className="hero__actions">
              <button
                type="button"
                className="btn btn--primary hero__cta"
                onClick={() => scrollToSection('#villas', -1)}
              >
                Explore Villas
                <span className="btn__arrow" aria-hidden="true">
                  &rarr;
                </span>
              </button>
              <button
                type="button"
                className="btn btn--ghost-dark hero__cta"
                onClick={() => scrollToSection('#contact', -40)}
              >
                Enquire Now
              </button>
            </div>
          </div>
        </div>

        {/* Outer element carries the scroll-driven opacity; the inner element
            owns the entrance animation. A CSS animation on the same element
            would outrank the inline style and never fade out. */}
        <div ref={cueRef} className="hero__cue" aria-hidden="true">
          <span className="hero__cue-in">
            <span className="hero__cue-label">Scroll to explore</span>
            <span className="hero__cue-rail">
              <span className="hero__cue-dot" />
            </span>
          </span>
        </div>

        {/* Dissolves the final frame into the warm white of the About section. */}
        <div ref={dissolveRef} className="hero__dissolve" aria-hidden="true" />
      </div>

      <p className="visually-hidden">
        As you scroll, an architectural walkthrough moves from the HODU arrival court through the
        living hall, private suites and garden terraces of a HODU luxury villa.
      </p>
    </section>
  );
}
