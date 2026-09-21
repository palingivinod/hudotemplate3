import { Line, Reveal, TextReveal } from './ui/Reveal';
import { Figure } from './ui/Figure';
import { PHILOSOPHY_CARDS } from '../data/home';
import './architecture.css';

/**
 * Philosophy — how HODU designs private villas around living.
 */
export function ArchitectureSection() {
  return (
    <section id="architecture" className="section section--navy arch" aria-label="Villa design philosophy">
      <div className="shell">
        <div className="arch__compose">
          <div className="arch__copy-col">
            <Reveal as="p" className="eyebrow">
              Philosophy
            </Reveal>
            <TextReveal as="h2" className="arch__title">
              <Line>Designed Around</Line>
              <Line>How You Live.</Line>
            </TextReveal>
            <Reveal as="p" className="arch__intro" delay={0.1}>
              Every HODU villa begins with orientation, natural light, ventilation, privacy, spatial
              planning and the garden connection — settled before elevations are drawn.
            </Reveal>
          </div>

          <div className="arch__media-col">
            <Figure
              name="philosophy-villa"
              alt="A private HODU villa opening to its own landscaped garden"
              ratio="ratio-169"
              className="arch__visual-main"
              reveal="left"
              parallax={8}
              sizes="(max-width: 900px) 100vw, 48vw"
            />
          </div>
        </div>

        <Reveal as="ul" className="arch__principles" stagger={0.06} y={16}>
          {PHILOSOPHY_CARDS.map((p) => (
            <li className="arch__principle" key={p.title}>
              <span className="arch__principle-num">{p.index}</span>
              <h3 className="arch__principle-title">{p.title}</h3>
              <p className="arch__principle-copy">{p.copy}</p>
              <span className="arch__principle-line" aria-hidden="true" />
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
