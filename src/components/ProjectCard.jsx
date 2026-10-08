import React from 'react';
import { ArrowIcon } from './ArrowIcon';

export function ProjectCard({ title, meta, description, link, repo }) {
  const sourceLink = `https://github.com/${repo}`;
  const hasDemo = link !== sourceLink;
  return (
    <article className="project-card">
      <div className="project-header">
        <span className="project-meta">{meta}</span>
      </div>
      <h3 className="project-title">{title}</h3>
      <p className="timeline-description">{description}</p>
      <div className="project-actions">
        {hasDemo && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Try ${title}`}
          >
            Live demo <ArrowIcon />
          </a>
        )}
        <a
          href={sourceLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${title} source code`}
        >
          Code <ArrowIcon />
        </a>
      </div>
    </article>
  );
}
