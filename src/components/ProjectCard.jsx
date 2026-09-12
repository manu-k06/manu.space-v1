import React from 'react';
import { useRepoStats } from '../hooks/useRepoStats';

/**
 * ProjectCard Component.
 * 
 * Demonstrates:
 * 1. React Props: receives curated content from projectsData.
 * 2. Asynchronous Component Hydration: uses `useRepoStats` to augment
 *    the static card with live GitHub metadata (stars, language) if available.
 * 3. Graceful degradation: if offline or rate-limited, shows clean static content.
 */
export function ProjectCard({ title, meta, description, link, repo }) {
  const { stats } = useRepoStats(repo);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card"
    >
      <div className="project-header">
        <span className="project-meta">{meta}</span>
        {stats && (stats.stars > 0 || stats.language) && (
          <span className="project-badge">
            {stats.language && <span className="project-lang">{stats.language}</span>}
            {stats.stars > 0 && <span className="project-stars">★ {stats.stars}</span>}
          </span>
        )}
      </div>
      <div className="project-title-row">
        <h3 className="project-title">{title}</h3>
        <span className="project-arrow" aria-hidden="true">↗</span>
      </div>
      <p className="timeline-description">{description}</p>
    </a>
  );
}
