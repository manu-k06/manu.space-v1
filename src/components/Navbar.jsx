import React from 'react';
import { Link, NavLink } from 'react-router-dom';

/**
 * Global Navigation Component.
 * 
 * Uses React Router's `NavLink` to automatically determine if a link
 * is active without having to hardcode "active" on individual pages.
 */
export function Navbar() {
  return (
    <nav className="site-nav fade-in">
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
