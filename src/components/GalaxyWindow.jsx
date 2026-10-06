import React from 'react';

// The canvas measures this open region so the galaxy stays clear of the content.
export function GalaxyWindow({ galaxy, label, className = '' }) {
  return (
    <figure className={`galaxy-window ${className}`} aria-label={label}>
      <div className="galaxy-stage" data-galaxy={galaxy} aria-hidden="true" />
      <figcaption>
        <span aria-hidden="true">✦</span> {label}
      </figcaption>
    </figure>
  );
}
