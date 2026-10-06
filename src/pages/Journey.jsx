import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { journeyMilestones } from '../data/journeyData';
import { MountainRoad } from '../components/MountainRoad';
import { MilestoneCard } from '../components/MilestoneCard';
import '../styles/journey.css';

export function Journey({ paused, onToggleMotion }) {
  const [hoveredStep, setHoveredStep] = useState(null);
  const [focusedStep, setFocusedStep] = useState(null);
  const containerRef = useRef(null);
  const activeStep = focusedStep || hoveredStep;
  return (
    <section
      id="journey"
      tabIndex={-1}
      aria-labelledby="journey-title"
      className={`section portfolio-section journey-section ${paused ? 'journey--paused' : ''}`}
    >
      <div className="container journey-content">
        <header className="journey-header">
          <div className="journey-eyebrow">
            <span className="label">03 / Journey · 2024 — Now</span>
            <button
              className="sky-toggle"
              type="button"
              aria-pressed={paused}
              onClick={onToggleMotion}
            >
              {paused ? 'Resume space animation' : 'Pause space animation'}
            </button>
          </div>
          <h2 id="journey-title">A steady exposure.</h2>
          <p>
            The milestones, detours, and orbits that shaped the path so far.
          </p>
          <Link className="journey-current-link" to="/#milestone-current-orbit">
            Jump to my current orbit <span aria-hidden="true">↓</span>
          </Link>
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
      </div>
    </section>
  );
}
