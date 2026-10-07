import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowIcon } from '../components/ArrowIcon';
import heroImg from '../assets/hero.png';
import { useTypewriter } from '../hooks/useTypewriter';

// A quiet entrance keeps the portrait still and the introduction readable.
export function Home() {
  const { displayText, isTyping, isDone } = useTypewriter(
    'A developer & space enthusiast.',
    65,
    600
  );

  return (
    <section
      id="home"
      tabIndex={-1}
      className="hero-section"
      aria-labelledby="hero-title"
    >
      <div className="hero-portrait">
        <img src={heroImg} alt="Portrait of Manu" className="hero-image" />
      </div>

      {/* Introduction beside the portrait on desktop, below it on mobile. */}
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
