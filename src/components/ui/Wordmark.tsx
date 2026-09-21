import { useEffect, useState } from 'react';
import './wordmark.css';

/**
 * Drop the official HODU logo at one of these paths and it is used verbatim —
 * original file, original colours, original proportions, no filters. Until
 * then the component falls back to a neutral typographic wordmark so nothing
 * renders broken.
 */
const LOGO_CANDIDATES = [
  '/brand/hodu-logo-mark.png',
  '/brand/hodu-logo.svg',
  '/brand/hodu-logo.png',
];

type Probe = { status: 'pending' | 'found' | 'missing'; src?: string };

let cached: Probe = { status: 'pending' };
const listeners = new Set<(p: Probe) => void>();

function probeLogo() {
  if (cached.status !== 'pending') return;

  let i = 0;
  const attempt = () => {
    if (i >= LOGO_CANDIDATES.length) {
      cached = { status: 'missing' };
      listeners.forEach((fn) => fn(cached));
      return;
    }
    const src = LOGO_CANDIDATES[i];
    i += 1;
    const img = new Image();
    img.onload = () => {
      cached = { status: 'found', src };
      listeners.forEach((fn) => fn(cached));
    };
    img.onerror = attempt;
    img.src = src;
  };
  attempt();
}

interface WordmarkProps {
  className?: string;
  /** Rendered width of the logo image, in px. Height follows the artwork. */
  width?: number;
  invert?: boolean;
}

export function Wordmark({ className = '', width = 108, invert = false }: WordmarkProps) {
  const [probe, setProbe] = useState<Probe>(cached);

  useEffect(() => {
    if (cached.status !== 'pending') {
      setProbe(cached);
      return;
    }
    listeners.add(setProbe);
    probeLogo();
    return () => {
      listeners.delete(setProbe);
    };
  }, []);

  if (probe.status === 'found' && probe.src) {
    return (
      <img
        className={`wordmark__img ${className}`}
        src={probe.src}
        alt="HODU"
        style={{ width, height: 'auto' }}
      />
    );
  }

  return (
    <span className={`wordmark ${invert ? 'wordmark--invert' : ''} ${className}`} aria-label="HODU">
      HODU
    </span>
  );
}
