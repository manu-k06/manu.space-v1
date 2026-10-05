import React, { useState } from 'react';
import { journeyMilestones } from '../data/journeyData';
import { MountainRoad } from '../components/MountainRoad';
import { MilestoneCard } from '../components/MilestoneCard';
import { CelestialSky } from '../components/CelestialSky';
import '../styles/journey.css';

/**
 * Journey Page Component (Mountain Switchback Pass).
 * 
 * Features:
 * - Authentic mountain road with realistic hairpin switchbacks, stone curbs & dashed stripes.
 * - Dynamic scroll-tracking starlight beacon traveling along the curves.
 * - Living animated celestial background with breathing nebulas, stars & meteor streaks.
 * - Responsive alternating frosted glass milestone cards with project chips.
 */
export function Journey() {
  const [activeStep, setActiveStep] = useState(null);

  // Layout assignment for alternating switchback bends
  const getRowClass = (index) => {
    if (index === 4) return 'milestone-row--summit';
    return index % 2 === 0 ? 'milestone-row--left' : 'milestone-row--right';
  };

  return (
    <section className="section journey-section">
      {/* Living animated celestial background */}
      <CelestialSky />

      <div className="container">
        {/* Header */}
        <div className="fade-in" style={{ marginBottom: 'var(--space-xl)' }}>
          <span className="label">Journey</span>
          <h2 style={{ margin: 'var(--space-sm) 0 var(--space-md)' }}>
            A steady exposure.
          </h2>
          <p style={{ maxWidth: '64ch', color: 'var(--text-secondary)' }}>
            The milestones, detours, and orbits that shaped the path so far.
          </p>
        </div>

        {/* Mountain Switchback Roadmap Area */}
        <div className="mountain-roadmap-wrap">
          {/* Authentic Switchback Road SVG with Scroll-Driven Traveler Beacon */}
          <MountainRoad
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />

          {/* Milestone Cards Flow along the Switchback Bends */}
          <div className="milestones-flow">
            {journeyMilestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={`milestone-row milestone-row--${milestone.step} ${getRowClass(index)} fade-in`}
              >
                <MilestoneCard
                  milestone={milestone}
                  isActive={activeStep === milestone.step}
                  onMouseEnter={() => setActiveStep(milestone.step)}
                  onMouseLeave={() => setActiveStep(null)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
