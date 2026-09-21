import { Wordmark } from './ui/Wordmark';
import { scrollToSection } from '../lib/useSmoothScroll';

/** Mirrors the header nav so the two never drift apart. */
const FOOTER_NAV = [
  { label: 'Home', href: '#home' },
  { label: 'Villas', href: '#villas' },
  { label: 'How We Build', href: '#process' },
  { label: 'Quality', href: '#features' },
  { label: 'About', href: '#about' },
  { label: 'Location', href: '#location' },
  { label: 'Contact', href: '#contact' },
];

/**
 * Social handles are placeholders pending HODU's real accounts — they point at
 * the platform root rather than inventing a username that resolves to someone
 * else's profile.
 */
const SOCIAL = [
  { label: 'Instagram', href: 'https://instagram.com/' },
  { label: 'Facebook', href: 'https://facebook.com/' },
  { label: 'LinkedIn', href: 'https://linkedin.com/' },
];

const LEGAL = [
  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'Terms & Conditions', href: '#terms' },
];

export function Footer() {
  return (
    <footer className="foot">
      <div className="foot__media" aria-hidden="true">
        <video
          className="foot__video"
          src="/videos/drone_shot.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <span className="foot__veil" />
      </div>

      <div className="shell foot__content">
        <hr className="rule" />

        <div className="foot__grid">
          <div className="foot__brand">
            <Wordmark width={112} />
            <p className="body foot__blurb">
              HODU designs, builds and delivers private luxury villas in and around Vijayawada —
              architecture, interiors, landscape and construction as one scope.
            </p>
          </div>

          <nav className="foot__nav" aria-label="Footer">
            <h2 className="eyebrow eyebrow--plain foot__label">Navigate</h2>
            <ul>
              {FOOTER_NAV.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.href, -1);
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="foot__col foot__col--contact">
            <h2 className="eyebrow eyebrow--plain foot__label">Contact</h2>
            <p className="body">
              <a className="foot__link" href="mailto:enquiries@hodu.in">
                enquiries@hodu.in
              </a>
              <br />
              <a className="foot__link" href="tel:+919999999999">
                +91 99999 99999
              </a>
              <br />
              <span className="foot__address">
                Vijayawada
                <br />
                Andhra Pradesh, India
              </span>
            </p>
          </div>

          <div className="foot__col foot__col--social">
            <h2 className="eyebrow eyebrow--plain foot__label">Follow</h2>
            <ul className="foot__social">
              {SOCIAL.map((item) => (
                <li key={item.label}>
                  <a
                    className="foot__link"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="foot__base">
          <p className="foot__copy">&copy; 2026 HODU</p>
          <ul className="foot__legal">
            {LEGAL.map((item) => (
              <li key={item.label}>
                <a className="foot__link" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="foot__copy foot__tagline">Architecture &middot; Craft &middot; Landscape</p>
        </div>
      </div>
    </footer>
  );
}
