import { useLayoutEffect, useRef, type ElementType, type ReactNode } from 'react';
import { gsap, EASE, prefersReducedMotion } from '../../lib/motion';

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Seconds of delay, used to sequence sibling reveals. */
  delay?: number;
  /** Stagger direct children instead of animating the wrapper as one block. */
  stagger?: number;
  y?: number;
  start?: string;
  id?: string;
}

/**
 * Fade-and-rise reveal. The pre-animation state lives in CSS (`[data-reveal]`)
 * so nothing flashes at full opacity before GSAP takes over.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  className,
  delay = 0,
  stagger,
  y = 26,
  start = 'top 85%',
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger !== undefined ? Array.from(el.children) : el;

    if (prefersReducedMotion()) {
      gsap.set(targets, { opacity: 1, y: 0, clearProps: 'transform' });
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      if (stagger !== undefined) gsap.set(el, { opacity: 1, y: 0 });

      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 1.15,
          ease: EASE,
          delay,
          stagger: stagger ?? 0,
          scrollTrigger: { trigger: el, start, once: true },
        },
      );
    });

    return () => ctx.revert();
  }, [delay, stagger, y, start]);

  const preState =
    stagger === undefined ? { 'data-reveal': '' } : { 'data-reveal-children': '' };

  return (
    <Tag ref={ref} className={className} id={id} {...preState}>
      {children}
    </Tag>
  );
}

interface TextRevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
}

/**
 * Masked line reveal for large serif headings: each line rises out from behind
 * its own clipping box. Lines are declared as separate child spans by callers.
 */
export function TextReveal({ children, as: Tag = 'h2', className, delay = 0 }: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const lines = el.querySelectorAll<HTMLElement>('.line > span');
    if (lines.length === 0) return;

    if (prefersReducedMotion()) {
      gsap.set(lines, { yPercent: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { yPercent: 108, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.3,
          ease: 'expo.out',
          stagger: 0.09,
          delay,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        },
      );
    });

    return () => ctx.revert();
  }, [delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** A single masked line inside `TextReveal`. */
export function Line({ children }: { children: ReactNode }) {
  return (
    <span className="line">
      <span>{children}</span>
    </span>
  );
}
