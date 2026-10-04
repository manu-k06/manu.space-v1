import React, { useState } from 'react';
import { journeyMilestones } from '../data/journeyData';
import { MountainRoad } from '../components/MountainRoad';
import { MilestoneCard } from '../components/MilestoneCard';
import '../styles/journey.css';

/**
 * Journey Page Component (Mountain Switchback Pass).
 * 
 * Features:
 * - Authentic mountain road with realistic hairpin switchbacks, stone curbs & dashed stripes.
 * - Dynamic scroll-tracking starlight beacon traveling along the curves.
 * - Responsive alternating frosted glass milestone cards with project chips and altitude metrics.
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
      {/* Atmospheric celestial gradient */}
      <div className="journey-backdrop" />

      <div className="container">
        {/* Header */}
        <div className="journey-header fade-in">
          <div className="journey-meta-badge">
            <span className="journey-pulse-dot" />
            <span>The Switchback Expedition</span>
          </div>
          <h2 style={{ margin: 'var(--space-xs) 0 var(--space-sm)' }}>
            The Mountain Pass.
          </h2>
          <p style={{ maxWidth: '64ch', color: 'var(--text-secondary)' }}>
            A continuous ascent through hairpin turns, fundamental detours, and rapid shipping — 
            climbing from base camp toward high alpine systems engineering.
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
                className={`milestone-row ${getRowClass(index)} fade-in`}
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
