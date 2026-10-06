import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { journeyMilestones } from '../data/journeyData';
import { MountainRoad } from '../components/MountainRoad';
import { MilestoneCard } from '../components/MilestoneCard';
import { CelestialSky } from '../components/CelestialSky';
import { ArrowIcon } from '../components/ArrowIcon';
import '../styles/journey.css';

export function Journey() {
  const [hoveredStep, setHoveredStep] = useState(null);
  const [focusedStep, setFocusedStep] = useState(null);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef(null);
  const activeStep = focusedStep || hoveredStep;
  return (
    <section
      className={`section journey-section ${paused ? 'journey--paused' : ''}`}
    >
      <CelestialSky paused={paused} />
      <div className="container journey-content">
        <header className="journey-header">
          <div className="journey-eyebrow">
            <span className="label">Journey / 2024 — Now</span>
            <button
              className="sky-toggle"
              type="button"
              aria-pressed={paused}
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? 'Resume motion' : 'Pause motion'}
            </button>
          </div>
          <h1>A steady exposure.</h1>
          <p>
            The milestones, detours, and orbits that shaped the path so far.
          </p>
          <a className="journey-current-link" href="#milestone-current-orbit">
            Jump to my current orbit <span aria-hidden="true">↓</span>
          </a>
        </header>
        <div ref={containerRef} className="mountain-roadmap-wrap">
          <MountainRoad
            containerRef={containerRef}
            activeStep={activeStep}
            paused={paused}
          />
          <ol className="milestones-flow" aria-label="My journey">
            {journeyMilestones.map((milestone) => (
              <li
                key={milestone.id}
                className="milestone-row"
                data-step={milestone.step}
              >
                <MilestoneCard
                  milestone={milestone}
                  isActive={activeStep === milestone.step}
                  onMouseEnter={() => setHoveredStep(milestone.step)}
                  onMouseLeave={() => setHoveredStep(null)}
                  onFocus={() => setFocusedStep(milestone.step)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget))
                      setFocusedStep(null);
                  }}
                />
              </li>
            ))}
          </ol>
        </div>
        <footer className="journey-outro">
          <span className="label">The next chapter</span>
          <h2>Still building. Still looking up.</h2>
          <p>
            Explore what I’ve been working on, or get in touch to build
            something together.
          </p>
          <div className="journey-actions">
            <Link
              className="journey-action journey-action--primary"
              to="/projects"
            >
              Explore my projects <ArrowIcon />
            </Link>
            <Link className="journey-action" to="/contact">
              Get in touch <ArrowIcon />
            </Link>
          </div>
        </footer>
      </div>
    </section>
  );
}
