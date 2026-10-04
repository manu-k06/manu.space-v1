import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

/**
 * Global Navigation Component.
 * 
 * Features:
 * - Route awareness: automatically applies subpage styling on non-home pages
 * - Scroll awareness: applies frosted glass backdrop on scroll or subpages
 *   to completely prevent navbar text collisions with scrolling page content.
 * - Active route styling via React Router's `NavLink`.
 */
export function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClasses = [
    'site-nav',
    'fade-in',
    !isHome ? 'site-nav--subpage' : '',
    isScrolled ? 'site-nav--scrolled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={navClasses}>

      <div className="container">
        <Link to="/" className="brand">
          Manu.
        </Link>
        <div className="nav-links">
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            About
          </NavLink>
          <NavLink
            to="/journey"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Journey
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Projects
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Contact
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
