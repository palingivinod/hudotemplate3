import { useEffect, useRef } from 'react';
import { Line, Reveal, TextReveal } from './ui/Reveal';
import { PROCESS_CARDS } from '../data/home';
import './process.css';

/**
 * How We Build — six-stage villa construction process over a looping
 * background film of the build.
 */
export function ProcessSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.volume = 0;

    const tryPlay = () => {
      const play = video.play();
      if (play && typeof play.catch === 'function') play.catch(() => undefined);
    };

    tryPlay();
    video.addEventListener('loadeddata', tryPlay);
    video.addEventListener('canplay', tryPlay);
    return () => {
      video.removeEventListener('loadeddata', tryPlay);
      video.removeEventListener('canplay', tryPlay);
    };
  }, []);

  return (
    <section id="process" className="section proc" aria-label="How we build">
      <div className="proc__media" aria-hidden="true">
        <video
          ref={videoRef}
          className="proc__video"
          src="/videos/how_we_build.mp4"
          muted
          playsInline
          autoPlay
          loop
          preload="auto"
        />
        <span className="proc__veil" />
      </div>

      <div className="shell proc__content">
        <div className="proc__head">
          <div>
            <Reveal as="p" className="eyebrow">
              How we build
            </Reveal>
            <TextReveal as="h2" className="proc__title">
              <Line>From First Conversation</Line>
              <Line>to Handover.</Line>
            </TextReveal>
          </div>
          <Reveal as="p" className="proc__intro" delay={0.1}>
            A structured process keeps villa design, approvals, construction and handover clear from
            beginning to end.
          </Reveal>
        </div>

        <Reveal as="ol" className="proc__track" stagger={0.05} y={14}>
          {PROCESS_CARDS.map((step) => (
            <li className="proc__card" key={step.index}>
              <span className="proc__card-num">{step.index}</span>
              <div className="proc__card-body">
                <h3 className="proc__card-title">{step.title}</h3>
                <p className="proc__card-copy">{step.copy}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
