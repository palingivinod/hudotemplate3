import { useEffect, useRef, useState } from 'react';
import { Wordmark } from './ui/Wordmark';
import { lockScroll, scrollToSection } from '../lib/useSmoothScroll';
import './header.css';

export const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'Contact', href: '#contact' },
] as const;

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState('#home');
  const [menuOpen, setMenuOpen] = useState(false);

  /* Swap to the light background once the hero is behind us. */
  useEffect(() => {
    let rafId = 0;
    let queued = false;

    /* The hero is pinned for several viewports, so the switch is tied to the
       hero's own scroll progress rather than a fixed viewport multiple. */
    const measure = () => {
      queued = false;
      const hero = document.getElementById('home');
      if (!hero) {
        setSolid(window.scrollY > window.innerHeight * 0.85);
        return;
      }
      const travel = hero.offsetHeight - window.innerHeight;
      const progress = travel > 0 ? (window.scrollY - hero.offsetTop) / travel : 1;
      setSolid(progress > 0.95);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      rafId = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  /* Highlight the section currently in view. */
  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.querySelector(item.href)).filter(
      (el): el is Element => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.15, 0.5] },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    lockScroll(menuOpen);
    return () => lockScroll(false);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const go = (href: string) => {
    setMenuOpen(false);
    // Let the scroll lock release before Lenis starts moving.
    requestAnimationFrame(() => scrollToSection(href, href === '#home' ? 0 : -1));
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`hdr ${solid ? 'hdr--solid' : ''} ${menuOpen ? 'hdr--menu' : ''}`}
      >
        <div className="hdr__inner">
          <a
            className="hdr__brand"
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              go('#home');
            }}
          >
            <Wordmark width={108} />
          </a>

          <nav className="hdr__nav" aria-label="Primary">
            <ul className="hdr__list">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`hdr__link ${active === item.href ? 'is-active' : ''}`}
                    aria-current={active === item.href ? 'true' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item.href);
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hdr__actions">
            <button type="button" className="hdr__enquire" onClick={() => go('#contact')}>
              Enquire Now
            </button>
            <button
              type="button"
              className="hdr__toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="visually-hidden">{menuOpen ? 'Close menu' : 'Open menu'}</span>
              <span className="hdr__bars" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={`mnav ${menuOpen ? 'mnav--open' : ''}`} hidden={!menuOpen}>
        <nav className="mnav__inner" aria-label="Mobile">
          <ul className="mnav__list">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.href} style={{ transitionDelay: `${0.06 + i * 0.045}s` }}>
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    go(item.href);
                  }}
                >
                  <span className="mnav__num">{String(i + 1).padStart(2, '0')}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mnav__foot">
            <button type="button" className="btn" onClick={() => go('#contact')}>
              Enquire Now
              <span className="btn__arrow" aria-hidden="true">
                &rarr;
              </span>
            </button>
            <p className="mnav__meta">Vijayawada, India</p>
          </div>
        </nav>
      </div>
    </>
  );
}
