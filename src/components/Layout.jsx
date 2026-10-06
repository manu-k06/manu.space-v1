import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Layout() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (location.pathname !== '/') return;
    document.title = 'Manu — Developer & space enthusiast';
    let id;
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      return;
    }
    let cancelled = false;
    let frame;
    // Font metrics can change the height of every section above a deep link.
    // Wait for them before positioning; cancel if navigation changes meanwhile.
    const position = () => {
      if (cancelled) return;
      frame = requestAnimationFrame(() => {
        if (cancelled) return;
        const target = document.getElementById(id || 'home');
        if (!target) return;
        const smooth =
          navigationType === 'PUSH' &&
          !matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({
          behavior: smooth ? 'smooth' : 'instant',
          block: 'start',
        });
        if (id) target.focus({ preventScroll: true });
      });
    };
    if (id) document.fonts.ready.then(position);
    else position();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [location.key, location.pathname, location.hash, navigationType]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1} style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
