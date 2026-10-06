import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

/**
 * Main Layout Shell.
 *
 * Demonstrates React Router's <Outlet /> concept:
 * The Navbar stays mounted across all pages, while the child
 * route content renders inside <Outlet />.
 */
export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const previousPath = useRef(location.pathname);

  // Automatically reset scroll to top on route navigation to prevent top-offset collisions
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const titles = {
      '/': 'Manu — Developer & space enthusiast',
      '/journey': 'Journey — Manu',
      '/projects': 'Projects — Manu',
      '/about': 'About — Manu',
      '/contact': 'Contact — Manu',
    };
    document.title = titles[location.pathname] || 'manu.space';
    if (previousPath.current !== location.pathname) {
      document.getElementById('main-content')?.focus({ preventScroll: true });
      previousPath.current = location.pathname;
    }
  }, [location.pathname]);

  return (
    <>
      {/* Navigation is persistent across all routes */}
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />

      {/* Main page content swaps out here */}
      <main
        id="main-content"
        tabIndex={-1}
        key={location.pathname}
        className="page-enter"
        style={{ flex: 1 }}
      >
        <Outlet />
      </main>

      {/* The home hero is full-viewport, footer is shown on all other pages */}
      {!isHome && <Footer />}
    </>
  );
}
