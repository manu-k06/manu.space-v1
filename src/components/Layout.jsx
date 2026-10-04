import React, { useEffect } from 'react';
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

  // Automatically reset scroll to top on route navigation to prevent top-offset collisions
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {/* Navigation is persistent across all routes */}
      <Navbar />

      {/* Main page content swaps out here */}
      <main key={location.pathname} className="page-enter" style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* The home hero is full-viewport, footer is shown on all other pages */}
      {!isHome && <Footer />}
    </>
  );
}
