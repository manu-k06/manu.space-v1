import React from 'react';

// Preserve the canvas anchors without adding visible captions to the page.
export function GalaxyWindow({ galaxy, className = '' }) {
  return (
    <div className={`galaxy-window ${className}`} aria-hidden="true">
      <div className="galaxy-stage" data-galaxy={galaxy} />
    </div>
  );
}
