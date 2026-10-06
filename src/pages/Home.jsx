import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowIcon } from '../components/ArrowIcon';
import heroImg from '../assets/hero.png';
import { useParallax } from '../hooks/useParallax';
import { useTypewriter } from '../hooks/useTypewriter';

/**
 * Home Page (Cinematic Hero Section).
 *
 * Features:
 * 1. Film exposure effect: smooth grayscale/contrast/blur reveal on mount.
 * 2. Mouse parallax: subtle 3D depth tracking cursor movement.
 * 3. Typewriter effect: terminal-style typewriter with blinking cursor.
 */
export function Home() {
  const [isExposed, setIsExposed] = useState(false);
  // Parallax with 22px max shift for noticeable, elegant depth
  const parallaxRef = useParallax(22);
  const { displayText, isTyping, isDone } = useTypewriter(
    'A developer & space enthusiast.',
    65, // typing speed in ms
    600 // start delay in ms
  );

  // Film exposure effect: transitions image filter & opacity after a brief mount delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExposed(true);
    }, 300);

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

      {/* Hero Content Overlay */}
      <div className="hero-content">
        <div className="hero-text fade-in">
          <h1 id="hero-title" className="hero-name">
            Manu
          </h1>
          <span
            className={`hero-typewriter ${isTyping ? 'typing-active' : ''} ${
              isDone ? 'typing-done' : ''
            }`}
          >
            {displayText}
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
