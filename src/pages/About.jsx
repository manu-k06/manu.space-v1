import React from 'react';

export function About() {
  return (
    <section
      id="about"
      tabIndex={-1}
      className="section portfolio-section"
      aria-labelledby="about-title"
    >
      <div className="container about-layout">
        <header className="section-heading">
          <span className="label">02 / A little about me</span>
          <h2 id="about-title">
            Curious by nature.
            <br />A builder by choice.
          </h2>
        </header>
        <div className="about-copy">
          <p>
            I’m a Computer Science student at FISAT, Kerala. I build web apps,
            games, and AI tools because the best way I know to learn is to ship
            something, break it, and make it better.
          </p>
          <p>
            Space is a constant source of curiosity—the scale, the silence, and
            how much there is left to discover. That curiosity follows me into
            code.
          </p>
          <h3>What I work with</h3>
          <ul className="skills-list" aria-label="Technologies">
            {[
              'JavaScript',
              'React',
              'Python / FastAPI',
              'Supabase',
              'HTML Canvas',
              'Git & Linux',
            ].map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
