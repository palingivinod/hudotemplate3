import { Line, Reveal, TextReveal } from './ui/Reveal';
import { Figure } from './ui/Figure';
import { SPECS_DISCLAIMER, VILLAS } from '../data/villas';
import { scrollToSection } from '../lib/useSmoothScroll';
import './villas.css';

/**
 * Explore HODU Villas — buyer information cards.
 */
export function FeaturedVillas() {
  return (
    <section id="villas" className="section section--mist villas">
      <div className="shell">
        <div className="villas__head">
          <div>
            <Reveal as="p" className="eyebrow">
              Available villas
            </Reveal>
            <TextReveal as="h2" className="villas__title">
              <Line>Explore HODU</Line>
              <Line>Villas</Line>
            </TextReveal>
          </div>
          <Reveal as="p" className="villas__intro" delay={0.1}>
            Private villas designed around individual plots, requirements and lifestyles.
          </Reveal>
        </div>

        <ul className="villas__grid">
          {VILLAS.map((villa, i) => (
            <li className="vcard" key={villa.name}>
              <Reveal className="vcard__media" delay={0.04 + (i % 2) * 0.04}>
                <Figure
                  name={villa.image}
                  alt={`${villa.name} — private villa in ${villa.location}`}
                  ratio="ratio-169"
                  reveal={i % 2 === 0 ? 'left' : 'up'}
                  parallax={5}
                  sizes="(max-width: 760px) 100vw, 46vw"
                />
              </Reveal>

              <div className="vcard__body">
                <div className="vcard__meta">
                  <span className="vcard__index">{villa.index}</span>
                  <span className="vcard__status">{villa.status}</span>
                </div>
                <h3 className="vcard__name">{villa.name}</h3>
                <p className="vcard__place">{villa.location}</p>
                <p className="vcard__summary">{villa.summary}</p>

                <dl className="vcard__specs">
                  {villa.specs.map((spec) => (
                    <div className="vcard__spec" key={spec.label}>
                      <dt>{spec.label}</dt>
                      <dd>{spec.value}</dd>
                    </div>
                  ))}
                </dl>

                <ul className="vcard__tags">
                  {villa.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="tlink vcard__cta"
                  onClick={() => scrollToSection('#contact', -40)}
                >
                  View Villa
                  <span className="btn__arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </button>
              </div>
            </li>
          ))}
        </ul>

        <p className="villas__note">{SPECS_DISCLAIMER}</p>
      </div>
    </section>
  );
}
