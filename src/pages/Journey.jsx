import React, { useState, useRef } from 'react';
import { journeyMilestones } from '../data/journeyData';
import { MountainRoad } from '../components/MountainRoad';
import { GalaxyWindow } from '../components/GalaxyWindow';
import { MilestoneCard } from '../components/MilestoneCard';
import '../styles/journey.css';

export function Journey() {
  const [hoveredStep, setHoveredStep] = useState(null);
  const [focusedStep, setFocusedStep] = useState(null);
  const containerRef = useRef(null);
  const activeStep = focusedStep || hoveredStep;
  return (
    <section
      id="journey"
      tabIndex={-1}
      aria-labelledby="journey-title"
      className="section portfolio-section journey-section"
    >
      <div className="container journey-content">
        <header className="journey-header">
          <div className="celestial-intro">
            <div className="celestial-intro-copy">
              <h2 id="journey-title">My journey.</h2>
            </div>
            <GalaxyWindow galaxy="galaxy2" />
          </div>
        </header>
        <div ref={containerRef} className="mountain-roadmap-wrap">
          <MountainRoad containerRef={containerRef} activeStep={activeStep} />
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
                {milestone.step === '03' && (
                  <GalaxyWindow
                    galaxy="galaxy3"
                    className="galaxy-window--trail"
                  />
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
