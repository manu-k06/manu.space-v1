import React from 'react';
import { projects } from '../data/projectsData';
import { GalaxyWindow } from '../components/GalaxyWindow';
import { ProjectCard } from '../components/ProjectCard';

export function Projects({ paused, onToggleMotion }) {
  return (
    <section
      id="projects"
      tabIndex={-1}
      className="section portfolio-section"
      aria-labelledby="projects-title"
    >
      <div className="container">
        <header className="section-heading">
          <div className="section-eyebrow">
            <span className="label">01 / Selected work</span>
            <button
              className="sky-toggle"
              type="button"
              aria-pressed={paused}
              onClick={onToggleMotion}
            >
              {paused ? 'Resume space animation' : 'Pause space animation'}
            </button>
          </div>
          <div className="celestial-intro">
            <div className="celestial-intro-copy">
              <h2 id="projects-title">Ideas, made real.</h2>
              <p>
                Web apps, games, and AI tools. A few things I’ve built and
                shipped.
              </p>
            </div>
            <GalaxyWindow galaxy="galaxy1" label="The spiral beyond" />
          </div>
        </header>
        <div className="projects-grid">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
        <details className="more-projects">
          <summary>Explore two more projects</summary>
          <div className="projects-grid">
            {projects.slice(3).map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}
