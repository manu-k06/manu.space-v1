import React from 'react';
import { ArrowIcon } from './ArrowIcon';

/**
 * MilestoneCard Component
 *
 * Sleek, compact checkpoint card along the roadmap.
 */
export function MilestoneCard({
  milestone,
  isActive,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
}) {
  const isCurrent = milestone.isCurrent;

  return (
    <article
      id={`milestone-${milestone.id}`}
      tabIndex={0}
      aria-labelledby={`milestone-title-${milestone.id}`}
      onFocus={onFocus}
      onBlur={onBlur}
      className={`mountain-card ${isCurrent ? 'mountain-card--summit' : ''} ${isActive ? 'mountain-card--active' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Header Row: Year Badge + Category */}
      <div className="card-header-meta">
        <span className="card-step-badge">
          {milestone.step} • {milestone.year}
        </span>
        <span className="card-category">{milestone.category}</span>
      </div>

      {/* Title */}
      <h3 id={`milestone-title-${milestone.id}`} className="card-title">
        {milestone.title}
      </h3>

      {/* Narrative Description */}
      <p className="card-desc">{milestone.summary}</p>
      <details className="milestone-details">
        <summary aria-label={`Read more about ${milestone.title}`}>
          Read the story
        </summary>
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
      </details>

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
              <ArrowIcon />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
