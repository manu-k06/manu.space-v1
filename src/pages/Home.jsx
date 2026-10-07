import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowIcon } from '../components/ArrowIcon';
import heroImg from '../assets/hero.png';
import { useParallax } from '../hooks/useParallax';
import { useTypewriter } from '../hooks/useTypewriter';

// Preserve the original full-width portrait; position the copy in its open space.
export function Home() {
  const [isExposed, setIsExposed] = useState(false);
  const parallaxRef = useParallax(22);
  const { displayText, isTyping, isDone } = useTypewriter(
    'A developer & space enthusiast.',
    65,
    600
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsExposed(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="home"
      tabIndex={-1}
      className="hero-section"
      aria-labelledby="hero-title"
    >
      {/* Outer Parallax Container with entrance fade */}
      <div className="hero-parallax-container fade-in">
        {/* Parallax wrapper: transform is purely driven by useParallax, no keyframe override */}
        <div ref={parallaxRef} className="hero-parallax-wrapper">
          <img
            src={heroImg}
            alt="Portrait of Manu"
            className={`hero-image ${isExposed ? 'exposed' : ''}`}
          />
        </div>
      </div>

      {/* Cinematic Vignette */}
      <div className="hero-vignette" />

      <div className="hero-content">
        <div className="hero-text">
          <h1 id="hero-title" className="hero-name">
            Manu
          </h1>
          <span
            className={`hero-typewriter ${isTyping ? 'typing-active' : ''} ${
              isDone ? 'typing-done' : ''
            }`}
          >
            <span className="hero-tagline-readable">
              A developer &amp; space enthusiast.
            </span>
            <span aria-hidden="true">{displayText}</span>
          </span>
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
            <Link className="journey-action" to="/#contact">
              Get in touch <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
