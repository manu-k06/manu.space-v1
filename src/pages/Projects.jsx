import React from 'react';
import { projects } from '../data/projectsData';
import { ProjectCard } from '../components/ProjectCard';

/**
 * Projects Page Component.
 * 
 * Demonstrates passing props with spread attributes ({...project})
 * and rendering lists with unique keys.
 */
export function Projects() {
  return (
    <section className="section">
      <div className="container" style={{ paddingTop: 'var(--space-2xl)' }}>
        <div className="fade-in">
          <span className="label">Selected Work</span>
          <h2 style={{ margin: 'var(--space-sm) 0 var(--space-md)' }}>
            Frames of work.
          </h2>
          <p style={{ marginBottom: 'var(--space-xl)' }}>
            A collection of projects built with intention.
          </p>
        </div>

        <div className="projects-grid fade-in">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
