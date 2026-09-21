import { useCallback, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HeroFrameSequence } from './components/HeroFrameSequence';
import { LoadingScreen } from './components/LoadingScreen';
import { AboutSection } from './components/AboutSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { ProcessSection } from './components/ProcessSection';
import { FeaturesSection } from './components/FeaturesSection';
import { FeaturedVillas } from './components/FeaturedVillas';
import { PlaceSection } from './components/PlaceSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { useSmoothScroll } from './lib/useSmoothScroll';
import { ScrollTrigger, prefersReducedMotion } from './lib/motion';
import { lockScroll } from './lib/useSmoothScroll';

/**
 * Nine-section homepage — private villa builder IA.
 * 1 Hero · 2 Story · 3 Philosophy · 4 How We Build · 5 Quality
 * 6 Explore Villas · 7 Why HODU · 8 Location · 9 Enquiry
 */
export default function App() {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useSmoothScroll(ready);

  useEffect(() => {
    if (ready) return;
    window.scrollTo(0, 0);
    lockScroll(true);
    return () => lockScroll(false);
  }, [ready]);

  useEffect(() => {
    if (prefersReducedMotion()) document.documentElement.classList.add('no-motion');
  }, []);

  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 220);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('load', onLoad);
    };
  }, [ready]);

  const onHeroReady = useCallback(() => setReady(true), []);
  const onHeroProgress = useCallback((value: number) => {
    setProgress((prev) => (value > prev ? value : prev));
  }, []);

  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>

      <LoadingScreen progress={progress} done={ready} />
      <Header />

      <main id="main">
        <HeroFrameSequence onReady={onHeroReady} onProgress={onHeroProgress} />
        <AboutSection />
        <ArchitectureSection />
        <ProcessSection />
        <FeaturesSection />
        <FeaturedVillas />
        <PlaceSection />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
