import React from 'react';
import { journeyMilestones } from '../data/journeyData';
import { TimelineItem } from '../components/TimelineItem';

/**
 * Journey Page Component.
 * 
 * Demonstrates:
 * 1. Rendering Lists with .map()
 * 2. The `key` prop requirement in React to track element identity efficiently.
 */
export function Journey() {
  return (
    <section className="section">
      <div className="container">

        <div className="fade-in">
          <span className="label">Journey</span>
          <h2 style={{ margin: 'var(--space-sm) 0 var(--space-xl)' }}>
            A steady exposure.
          </h2>
        </div>

        <ul className="timeline fade-in">
          {journeyMilestones.map((milestone) => (
            <TimelineItem
              key={milestone.id}
              date={milestone.date}
              title={milestone.title}
              description={milestone.description}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
