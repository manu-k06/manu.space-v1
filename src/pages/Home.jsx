import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowIcon } from '../components/ArrowIcon';
import heroImg from '../assets/hero.png';

// Preserve the original full-width portrait; position the copy in its open space.
export function Home() {
  return (
    <section
      id="home"
      tabIndex={-1}
      className="hero-section"
      aria-labelledby="hero-title"
    >
      <div className="hero-portrait">
        <img
          src={heroImg}
          alt="Portrait of Manu"
          className="hero-image"
          fetchPriority="high"
        />
      </div>
      <div className="hero-vignette" aria-hidden="true" />

      <div className="hero-content">
        <div className="hero-text">
          <h1 id="hero-title" className="hero-name">
            Manu
          </h1>
          <p className="hero-tagline">A developer &amp; space enthusiast.</p>
          <p className="hero-intro">
            Computer Science student building web apps, games, and AI tools.
          </p>
          <div className="hero-actions">
            <Link
              className="journey-action journey-action--primary"
              to="/#projects"
            >
              Explore my work <ArrowIcon />
            </Link>
            <Link className="hero-contact-link" to="/#contact">
              Get in touch <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
