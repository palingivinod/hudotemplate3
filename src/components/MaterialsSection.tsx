import { useEffect, useState } from 'react';
import { Line, Reveal, TextReveal } from './ui/Reveal';
import { Figure } from './ui/Figure';
import { MATERIAL_CARDS } from '../data/home';
import { MATERIAL_CATEGORIES } from '../data/materials';
import './materials.css';

/**
 * Section 06 — Materials & Craftsmanship.
 * Four primary cards on the page; full palette opens in a dialog.
 */
export function MaterialsSection() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    if (!paletteOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPaletteOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paletteOpen]);

  return (
    <section id="materials" className="section section--navy mat">
      <div className="shell">
        <div className="mat__head">
          <div>
            <Reveal as="p" className="eyebrow">
              Materials
            </Reveal>
            <TextReveal as="h2" className="mat__title">
              <Line>Materials</Line>
              <Line>Chosen to Last.</Line>
            </TextReveal>
          </div>
          <Reveal className="mat__intro" delay={0.1}>
            <p>
              The character of a villa is shaped by the materials behind its appearance — how they
              age, how they perform and how they are integrated into the architecture.
            </p>
            <button type="button" className="tlink mat__palette-btn" onClick={() => setPaletteOpen(true)}>
              View Material Palette
              <span className="btn__arrow" aria-hidden="true">
                &rarr;
              </span>
            </button>
          </Reveal>
        </div>

        <Reveal as="ul" className="mat__cards" stagger={0.06} y={16}>
          {MATERIAL_CARDS.map((m) => (
            <li className="mat__card" key={m.name}>
              <span className="mat__swatch">
                <img
                  src={`/stills/swatch-${m.swatch}-96.webp`}
                  srcSet={`/stills/swatch-${m.swatch}-96.webp 96w, /stills/swatch-${m.swatch}-192.webp 192w`}
                  sizes="56px"
                  width={56}
                  height={56}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <h3 className="mat__card-title">{m.name}</h3>
              <p className="mat__card-copy">{m.copy}</p>
            </li>
          ))}
        </Reveal>

        <Reveal className="mat__detail" delay={0.08}>
          <Figure
            name="materials-detail"
            alt="Detail of a book-matched marble island against dark timber joinery"
            ratio="ratio-169"
            className="mat__detail-media"
            reveal="left"
            parallax={8}
            sizes="100vw"
          />
          <p className="mat__detail-cap">Considered interiors — stone and timber in dialogue</p>
        </Reveal>
      </div>

      {paletteOpen ? (
        <div
          className="mat__dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mat-palette-title"
        >
          <button
            type="button"
            className="mat__dialog-scrim"
            aria-label="Close material palette"
            onClick={() => setPaletteOpen(false)}
          />
          <div className="mat__dialog-panel">
            <div className="mat__dialog-head">
              <h3 id="mat-palette-title" className="mat__dialog-title">
                Material palette
              </h3>
              <button type="button" className="mat__dialog-close" onClick={() => setPaletteOpen(false)}>
                Close
              </button>
            </div>
            <ul className="mat__dialog-list">
              {MATERIAL_CATEGORIES.map((m) => (
                <li key={m.name}>
                  <span className="mat__swatch mat__swatch--sm">
                    <img
                      src={`/stills/swatch-${m.swatch}-96.webp`}
                      alt=""
                      width={40}
                      height={40}
                      loading="lazy"
                    />
                  </span>
                  <span>
                    <strong>{m.name}</strong>
                    <span className="mat__dialog-copy">{m.copy}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
}
