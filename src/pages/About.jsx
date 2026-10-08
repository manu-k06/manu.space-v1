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
          <h2 id="about-title">A little about me.</h2>
        </header>
        <div className="about-copy">
          <p>
            I’m a Computer Science student at FISAT, Kerala, with a curiosity
            for space and a habit of learning by building. I make things, break
            them, and figure out how to make them better.
          </p>
        </div>
      </div>
    </section>
  );
}
