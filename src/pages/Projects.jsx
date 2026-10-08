import React from 'react';
import { projects } from '../data/projectsData';
import { GalaxyWindow } from '../components/GalaxyWindow';
import { ProjectCard } from '../components/ProjectCard';

export function Projects() {
  return (
    <section
      id="projects"
      tabIndex={-1}
      className="section portfolio-section"
      aria-labelledby="projects-title"
    >
      <div className="container">
        <header className="section-heading">
          <div className="celestial-intro">
            <div className="celestial-intro-copy">
              <h2 id="projects-title">Selected work.</h2>
            </div>
            <GalaxyWindow galaxy="galaxy1" />
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
