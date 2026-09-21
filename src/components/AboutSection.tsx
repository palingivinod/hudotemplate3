import { Line, Reveal, TextReveal } from './ui/Reveal';
import { Figure } from './ui/Figure';
import { scrollToSection } from '../lib/useSmoothScroll';
import { STORY_CARDS } from '../data/home';
import './about.css';

/**
 * HODU Story — who we are as a private villa builder.
 * Layout: left image · right story · bottom information cards.
 */
export function AboutSection() {
  return (
    <section id="about" className="about" aria-label="About HODU">
      <div className="about__stage">
        <div className="about__media">
          <Figure
            name="story-construction"
            alt="A HODU private villa under construction on its own plot"
            ratio=""
            className="about__photo"
            reveal="left"
            parallax={5}
            sizes="(max-width: 900px) 100vw, 40vw"
            priority
          />
        </div>

        <div className="about__panel">
          <div className="about__panel-top">
            <Reveal as="p" className="about__eyebrow">
              About HODU
            </Reveal>
            <Reveal as="p" className="about__micro" delay={0.08}>
              Private villa
              <br />
              builder
            </Reveal>
          </div>

          <TextReveal as="h2" className="about__title">
            <Line>Building Villas</Line>
            <Line>With a Clearer Approach.</Line>
          </TextReveal>

          <Reveal className="about__copy" delay={0.1}>
            <p>
              HODU brings planning, architecture, construction, interiors and landscape together to
              create private villas through one coordinated process.
            </p>
            <p>
              Each villa is designed and built for a single family on its own plot — with clarity
              from first conversation to handover.
            </p>
          </Reveal>

          <Reveal className="about__cta-wrap" delay={0.14}>
            <button
              type="button"
              className="about__cta"
              onClick={() => scrollToSection('#process', -1)}
            >
              How We Build
              <span className="about__cta-arrow" aria-hidden="true">
                &rarr;
              </span>
            </button>
          </Reveal>
        </div>
      </div>

      <div className="about__bottom">
        <div className="shell">
          <Reveal as="ul" className="about__cards" stagger={0.06} y={16}>
            {STORY_CARDS.map((card) => (
              <li className="about__card" key={card.index}>
                <div className="about__card-top">
                  <span className="about__card-num">{card.index}</span>
                </div>
                <h3 className="about__card-title">{card.title}</h3>
                <p className="about__card-copy">{card.copy}</p>
                <span className="about__card-accent" aria-hidden="true" />
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
