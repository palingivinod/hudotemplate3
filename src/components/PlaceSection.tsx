import { Line, Reveal, TextReveal } from './ui/Reveal';
import { Figure } from './ui/Figure';
import { WHY_CARDS } from '../data/home';
import {
  LOCATION_INFO_CARDS,
  LOCATION_INTRO,
  LOCATION_STRIP,
} from '../data/location';
import locationVillaWebp from '../assets/location-villa.webp';
import locationVillaJpg from '../assets/location-villa.jpg';
import './place.css';

function LocationMap() {
  return (
    <div className="loc-map" aria-label="Map of HODU villa locations around Vijayawada">
      <svg className="loc-map__svg" viewBox="0 0 420 520" role="img" aria-hidden="true">
        <defs>
          <pattern id="loc-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0V28" fill="none" stroke="rgba(6,29,43,0.05)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="420" height="520" fill="#F4F1EA" />
        <rect width="420" height="520" fill="url(#loc-grid)" />

        {/* Krishna River */}
        <path
          d="M0 310 C70 290, 120 340, 180 325 C250 308, 300 350, 360 335 C390 328, 410 340, 420 345 L420 380 C380 370, 340 355, 280 365 C210 378, 150 350, 90 360 C50 366, 20 375, 0 380 Z"
          fill="rgba(0, 191, 199, 0.12)"
        />
        <text x="48" y="352" className="loc-map__label loc-map__label--water">
          Krishna River
        </text>

        {/* Roads */}
        <path d="M40 80 L200 200 L380 160" className="loc-map__road loc-map__road--major" />
        <path d="M80 480 L210 300 L340 420" className="loc-map__road" />
        <path d="M20 220 L400 260" className="loc-map__road" />
        <path d="M160 40 L240 500" className="loc-map__road" />

        {/* NH-16 label */}
        <text x="268" y="148" className="loc-map__label loc-map__label--road">
          NH-16
        </text>
        <text x="24" y="56" className="loc-map__label loc-map__label--dir">
          To Hyderabad
        </text>
        <text x="300" y="448" className="loc-map__label loc-map__label--dir">
          To Guntur
        </text>

        {/* City */}
        <circle cx="210" cy="270" r="46" className="loc-map__city-ring" />
        <text x="210" y="274" textAnchor="middle" className="loc-map__label loc-map__label--city">
          Vijayawada
        </text>

        {/* Airport */}
        <g className="loc-map__pin" transform="translate(318 96)">
          <circle r="14" className="loc-map__pin-dot" />
          <path d="M-6 1 L6 1 M0 -5 L6 1 L0 7" className="loc-map__pin-icon" />
          <text x="18" y="4" className="loc-map__label">
            Airport
          </text>
        </g>

        {/* Junction */}
        <g className="loc-map__pin" transform="translate(118 210)">
          <circle r="14" className="loc-map__pin-dot" />
          <path d="M-6 -2 H6 M-6 2 H6 M-4 -5 V5 M4 -5 V5" className="loc-map__pin-icon" />
          <text x="18" y="4" className="loc-map__label">
            Junction
          </text>
        </g>

        {/* Amenity markers */}
        <g className="loc-map__amenity" transform="translate(92 390)">
          <circle r="10" />
          <text x="14" y="3">Schools</text>
        </g>
        <g className="loc-map__amenity" transform="translate(168 430)">
          <circle r="10" />
          <text x="14" y="3">Hospitals</text>
        </g>
        <g className="loc-map__amenity" transform="translate(250 400)">
          <circle r="10" />
          <text x="14" y="3">Retail</text>
        </g>
        <g className="loc-map__amenity" transform="translate(318 360)">
          <circle r="10" />
          <text x="14" y="3">Dining</text>
        </g>

        {/* HODU marker */}
        <g className="loc-map__hodu" transform="translate(232 232)">
          <circle r="28" className="loc-map__hodu-ring" />
          <circle r="18" className="loc-map__hodu-core" />
          <text y="4" textAnchor="middle" className="loc-map__hodu-label">
            HODU
          </text>
        </g>
      </svg>

      <div className="loc-map__legend" aria-hidden="true">
        <span>
          <i className="loc-map__legend-dot loc-map__legend-dot--hodu" />
          HODU
        </span>
        <span>
          <i className="loc-map__legend-dot" />
          City &amp; travel
        </span>
        <span>
          <i className="loc-map__legend-dot loc-map__legend-dot--life" />
          Everyday life
        </span>
      </div>
    </div>
  );
}

/**
 * Why HODU + Location — trust and place for private villa buyers.
 */
export function PlaceSection() {
  return (
    <>
      <section id="why" className="section section--navy place place--why">
        <div className="shell place__why-shell">
          <div className="place__why-layout">
            <div>
              <Reveal as="p" className="eyebrow">
                Why HODU
              </Reveal>
              <TextReveal as="h2" className="place__why-title">
                <Line>Why HODU?</Line>
              </TextReveal>
              <Reveal as="p" className="place__why-lead" delay={0.08}>
                How private villas are designed, built and delivered — with clarity at every stage.
              </Reveal>

              <Reveal as="ul" className="place__why-cards" stagger={0.07} y={14}>
                {WHY_CARDS.map((card, i) => (
                  <li className="place__why-card" key={card.title}>
                    <span className="place__why-num">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="place__why-card-title">{card.title}</h3>
                    <p className="place__why-card-copy">{card.copy}</p>
                  </li>
                ))}
              </Reveal>
            </div>

            <Reveal className="place__why-media" delay={0.12}>
              <Figure
                name="why-hodu"
                alt="Architecture and garden of a HODU private villa"
                ratio="ratio-43"
                reveal="up"
                parallax={7}
                sizes="(max-width: 980px) 100vw, 40vw"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section id="location" className="loc" aria-label="Location">
        <div className="loc__shell">
          <header className="loc__head">
            <p className="eyebrow">Location</p>
            <div className="loc__head-row">
              <h2 className="loc__title">
                Villas in and Around
                <br />
                Vijayawada
              </h2>
              <p className="loc__intro">{LOCATION_INTRO}</p>
            </div>
          </header>

          <div className="loc__compose">
            <figure className="loc__villa">
              <picture>
                <source srcSet={locationVillaWebp} type="image/webp" />
                <img
                  src={locationVillaJpg}
                  alt="A private HODU luxury villa on its own landscaped plot near Vijayawada"
                  width={1600}
                  height={2000}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <figcaption className="loc__caption">
                A well connected
                <br />
                place to call home
              </figcaption>
            </figure>

            <ul className="loc__cards">
              {LOCATION_INFO_CARDS.map((card) => (
                <li className="loc__card" key={card.index}>
                  <div className="loc__card-top">
                    <span className="loc__card-num">{card.index}</span>
                    <h3 className="loc__card-title">{card.title}</h3>
                  </div>
                  <ul className="loc__card-list">
                    {card.details.map((detail) => (
                      <li key={detail.label}>
                        <strong>{detail.label}</strong>
                        <span>{detail.note}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            <div className="loc__map-wrap">
              <LocationMap />
            </div>
          </div>
        </div>

        <div className="loc__strip">
          <div className="loc__shell loc__strip-inner">
            <div className="loc__strip-copy">
              <p className="loc__strip-eyebrow">{LOCATION_STRIP.eyebrow}</p>
              <h3 className="loc__strip-title">{LOCATION_STRIP.title}</h3>
              <p className="loc__strip-text">{LOCATION_STRIP.copy}</p>
            </div>

            <ul className="loc__stats">
              {LOCATION_STRIP.stats.map((stat) => (
                <li className="loc__stat" key={stat.label}>
                  <span className="loc__stat-value">{stat.value}</span>
                  <span className="loc__stat-label">{stat.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
