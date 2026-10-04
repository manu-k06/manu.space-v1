import React from 'react';

/**
 * MilestoneCard Component
 * 
 * Renders an individual checkpoint card along the mountain switchback.
 */
export function MilestoneCard({ milestone, isActive, onMouseEnter, onMouseLeave }) {
  const isSummit = milestone.isCurrent;

  return (
    <article
      className={`mountain-card ${isSummit ? 'mountain-card--summit' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        borderColor: isActive ? 'var(--accent)' : undefined,
      }}
    >
      {isSummit && (
        <div className="summit-flag-badge">
          <span>🚩</span>
          <span>The Summit Peak</span>
        </div>
      )}

      {/* Header Meta */}
      <div className="card-header-meta">
        <span className="card-step-badge">
          Step {milestone.step} • {milestone.year}
        </span>
        <span className="card-altitude">{milestone.altitude}</span>
      </div>

      {/* Category */}
      <span className="card-category">{milestone.category}</span>

      {/* Title */}
      <h3 className="card-title">{milestone.title}</h3>

      {/* Narrative Description */}
      <p className="card-desc">{milestone.description}</p>

      {/* Inspirational Quote if available */}
      {milestone.quote && (
        <blockquote className="card-quote">
          {milestone.quote}
        </blockquote>
      )}

      {/* Key Focus Tags */}
      {milestone.tags && milestone.tags.length > 0 && (
        <div className="card-tags">
          {milestone.tags.map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Shipped Projects Links */}
      {milestone.projects && milestone.projects.length > 0 && (
        <div className="card-project-links">
          {milestone.projects.map((proj) => (
            <a
              key={proj.name}
              href={proj.link}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link-chip"
              title={`View ${proj.name}`}
            >
              <span>{proj.name}</span>
              <span className="project-link-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
