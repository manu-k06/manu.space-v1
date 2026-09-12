import React from 'react';

/**
 * TimelineItem Component.
 * 
 * Demonstrates React Props & List Rendering:
 * Used inside a .map() in Journey.jsx to render individual timeline points.
 */
export function TimelineItem({ date, title, description }) {
  return (
    <li className="timeline-item fade-in">
      <span className="timeline-date">{date}</span>
      <h3 className="timeline-title">{title}</h3>
      <p className="timeline-description">{description}</p>
    </li>
  );
}
