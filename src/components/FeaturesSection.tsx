import type { ReactNode } from 'react';
import { Line, Reveal, TextReveal } from './ui/Reveal';
import { QUALITY_CARDS } from '../data/home';
import qualityCraftWebp from '../assets/quality-craft.webp';
import qualityCraftJpg from '../assets/quality-craft.jpg';
import './features.css';

const QUALITY_ICONS: Record<string, ReactNode> = {
  '01': (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" stroke="currentColor" strokeWidth="1.25" />
      <rect x="13" y="3" width="8" height="8" stroke="currentColor" strokeWidth="1.25" />
      <rect x="3" y="13" width="8" height="8" stroke="currentColor" strokeWidth="1.25" />
      <rect x="13" y="13" width="8" height="8" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  ),
  '02': (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20V8l8-4 8 4v12" stroke="currentColor" strokeWidth="1.25" />
      <path d="M9 20v-6h6v6" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  ),
  '03': (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 18h16M6 18V9l6-4 6 4v9" stroke="currentColor" strokeWidth="1.25" />
      <path d="M10 14h4" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  ),
  '04': (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  ),
  '05': (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.25" />
      <path d="M9 9h6M9 13h6M9 17h3" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  ),
  '06': (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5 9.5 17 19 7.5" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  ),
};

/**
 * Quality & Craft — construction standards for private villas.
 * Craft image is imported so Vite always bundles and serves it.
 */
export function FeaturesSection() {
  return (
    <section id="features" className="section section--mist feat quality">
      <div className="shell">
        <div className="feat__head">
          <div>
            <Reveal as="p" className="eyebrow">
              Quality &amp; craft
            </Reveal>
            <TextReveal as="h2" className="feat__title">
              <Line>Quality Built</Line>
              <Line>Into Every Detail.</Line>
            </TextReveal>
          </div>
          <Reveal as="p" className="feat__intro" delay={0.1}>
            Material selection, workmanship, services and inspection are reviewed throughout
            construction — so the finished villa performs as planned.
          </Reveal>
        </div>

        <Reveal as="ul" className="feat__grid" stagger={0.05} y={14}>
          {QUALITY_CARDS.map((card) => (
            <li className="feat__card" key={card.index}>
              <div className="feat__card-top">
                <span className="feat__card-num">{card.index}</span>
                <span className="feat__icon">{QUALITY_ICONS[card.index]}</span>
              </div>
              <h3 className="feat__card-title">{card.title}</h3>
              <ul className="feat__items">
                <li>{card.copy}</li>
              </ul>
            </li>
          ))}
        </Reveal>

        <Reveal className="quality__media" delay={0.12}>
          <figure className="quality__figure">
            <picture>
              <source srcSet={qualityCraftWebp} type="image/webp" />
              <img
                src={qualityCraftJpg}
                alt="Stone and timber craftsmanship detail inside a HODU private villa"
                width={1920}
                height={1080}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </picture>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
