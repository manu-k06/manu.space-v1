import React, { useEffect, useRef, useState } from 'react';
import '../styles/station.css';

export function SpaceStation() {
  const hostRef = useRef(null);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    const host = hostRef.current;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let scene,
      cancelled = false,
      loading = false,
      visible = false;
    const sync = () =>
      scene?.setActive(visible && !document.hidden && !reduced.matches);
    const fail = () => {
      if (cancelled) return;
      scene?.dispose();
      setUnavailable(true);
    };
    const preloadObserver = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || loading) return;
        loading = true;
        preloadObserver.disconnect();
        try {
          const { createStationScene } = await import(
            './station/createStationScene'
          );
          if (cancelled) return;
          scene = createStationScene(host, fail);
          host.dataset.ready = 'true';
          sync();
        } catch {
          fail();
        }
      },
      { rootMargin: '300px' }
    );
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    preloadObserver.observe(host);
    visibilityObserver.observe(host);
    reduced.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      cancelled = true;
      preloadObserver.disconnect();
      visibilityObserver.disconnect();
      reduced.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      scene?.dispose();
    };
  }, []);
  return (
    <div
      ref={hostRef}
      className={`station-scene${unavailable ? ' station-unavailable' : ''}`}
      aria-hidden="true"
    />
  );
}
