import { useEffect, useRef, useState } from 'react';
import preLoaderSrc from '../assets/videos/pre_loader.mp4';
import './loading.css';

interface LoadingScreenProps {
  /** Kept for App wiring; progress UI removed in favor of the video. */
  progress: number;
  done: boolean;
}

/**
 * Full-bleed preloader. Plays `pre_loader.mp4` all the way through, then
 * fades out only after the hero is also ready.
 */
export function LoadingScreen({ done }: LoadingScreenProps) {
  const [dismissed, setDismissed] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.volume = 0;
    video.loop = false;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    const tryPlay = () => {
      const play = video.play();
      if (play && typeof play.catch === 'function') play.catch(() => undefined);
    };

    const onEnded = () => {
      setVideoEnded(true);
      /* Hold the last frame while the site finishes loading. */
      video.pause();
    };

    tryPlay();
    video.addEventListener('ended', onEnded);
    video.addEventListener('loadeddata', tryPlay);
    video.addEventListener('canplay', tryPlay);
    return () => {
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('loadeddata', tryPlay);
      video.removeEventListener('canplay', tryPlay);
    };
  }, []);

  /* Dismiss only after the full clip has played AND the hero is ready. */
  useEffect(() => {
    if (!done || !videoEnded || exiting || dismissed) return;
    const id = window.setTimeout(() => setExiting(true), 200);
    return () => window.clearTimeout(id);
  }, [done, videoEnded, exiting, dismissed]);

  /* If the clip never fires `ended` (autoplay blocked), still release eventually. */
  useEffect(() => {
    if (videoEnded || exiting || dismissed) return;
    const id = window.setTimeout(() => setVideoEnded(true), 12000);
    return () => window.clearTimeout(id);
  }, [videoEnded, exiting, dismissed]);

  useEffect(() => {
    if (!exiting) return;
    videoRef.current?.pause();
    const id = window.setTimeout(() => setDismissed(true), 900);
    return () => window.clearTimeout(id);
  }, [exiting]);

  if (dismissed) return null;

  return (
    <div
      className={`loader ${exiting ? 'loader--out' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <video
        ref={videoRef}
        className="loader__video"
        src={preLoaderSrc}
        muted
        playsInline
        autoPlay
        preload="auto"
        aria-hidden="true"
      />
    </div>
  );
}
