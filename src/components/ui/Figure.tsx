import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../../lib/motion';
import { still } from '../../lib/stills';

interface FigureProps {
  /** Key from the generated stills set, e.g. `architecture-entry`. */
  name: string;
  alt: string;
  className?: string;
  /** Aspect-ratio utility class, e.g. `ratio-32`. */
  ratio?: string;
  /** Vertical parallax travel in percent of the image overflow. */
  parallax?: number;
  /** Clip-path wipe direction on entry. */
  reveal?: 'up' | 'left' | 'none';
  priority?: boolean;
  sizes?: string;
  children?: React.ReactNode;
}

/**
 * Architectural image with a clip-path entry wipe and optional parallax.
 * The image is over-sized vertically so parallax never exposes an edge.
 */
export function Figure({
  name,
  alt,
  className = '',
  ratio = 'ratio-32',
  parallax = 0,
  reveal = 'up',
  priority = false,
  sizes = '(max-width: 900px) 100vw, 60vw',
  children,
}: FigureProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (reveal !== 'none') {
        const from =
          reveal === 'left' ? { clipPath: 'inset(0 100% 0 0)' } : { clipPath: 'inset(100% 0 0 0)' };

        gsap.fromTo(
          wrap,
          from,
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.35,
            ease: 'expo.inOut',
            scrollTrigger: {
              trigger: wrap,
              start: 'top 92%',
              once: true,
              invalidateOnRefresh: true,
              // If the figure is already in view (hash jump / late mount), show it.
              onRefresh(self) {
                if (self.progress > 0 || self.isActive) self.animation?.progress(1);
              },
            },
          },
        );
        // Soft settle only — avoid a large pre-scale that reads as "zoomed"
        // if the trigger fires late or the tween is interrupted.
        gsap.fromTo(
          img,
          { scale: 1.02 },
          {
            scale: 1,
            duration: 1.4,
            ease: 'expo.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: wrap,
              start: 'top 92%',
              once: true,
              invalidateOnRefresh: true,
              onRefresh(self) {
                if (self.progress > 0 || self.isActive) self.animation?.progress(1);
              },
            },
          },
        );
      }

      if (parallax !== 0) {
        gsap.fromTo(
          img,
          { yPercent: -parallax / 2 },
          {
            yPercent: parallax / 2,
            ease: 'none',
            scrollTrigger: {
              trigger: wrap,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }
    });

    return () => ctx.revert();
  }, [parallax, reveal]);

  const overflow =
    parallax !== 0
      ? {
          height: `${100 + Math.abs(parallax)}%`,
          top: `${-Math.abs(parallax) / 2}%`,
          right: 0,
          width: '100%',
          maxWidth: '100%',
        }
      : undefined;

  return (
    <div ref={wrapRef} className={`media ${ratio} ${parallax ? 'media--parallax' : ''} ${className}`}>
      <img
        ref={imgRef}
        src={still(name, 1280)}
        srcSet={`${still(name, 800)} 800w, ${still(name, 1280)} 1280w, ${still(name, 1920)} 1920w`}
        sizes={sizes}
        alt={alt}
        width={1280}
        height={720}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        // Lowercase: React 18 passes unknown camelCase props through with a warning.
        {...{ fetchpriority: priority ? 'high' : 'auto' }}
        style={overflow ? { position: 'absolute', left: 0, ...overflow } : undefined}
      />
      {children}
    </div>
  );
}
