import React from 'react';

/**
 * MilestoneCard Component
 * 
 * Sleek, compact checkpoint card along the roadmap.
 */
export function MilestoneCard({ milestone, isActive, onMouseEnter, onMouseLeave }) {
  const isCurrent = milestone.isCurrent;

  return (
    <article
      className={`mountain-card ${isCurrent ? 'mountain-card--summit' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        borderColor: isActive ? 'var(--accent)' : undefined,
      }}
    >
      {/* Header Row: Year Badge + Category */}
      <div className="card-header-meta">
        <span className="card-step-badge">
          {milestone.step} • {milestone.year}
        </span>
        <span className="card-category">{milestone.category}</span>
      </div>

      {/* Title */}
      <h3 className="card-title">{milestone.title}</h3>

      {/* Narrative Description */}
      <p className="card-desc">{milestone.description}</p>

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
