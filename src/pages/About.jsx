import React from 'react';

/**
 * About Page Component.
 */
export function About() {
  return (
    <section className="section section--full">
      <div className="container">
        <div className="fade-in">
          <span className="label">About</span>
          <h2 style={{ margin: 'var(--space-sm) 0 var(--space-md)' }}>
            Intentionally quiet. <br />
            Relentlessly focused.
          </h2>
          <p style={{ marginBottom: 'var(--space-sm)' }}>
            I'm a Computer Science student at FISAT, Kerala, somewhere between my
            first year and a very ambitious future. I build things — city
            simulators, AI curated wallpaper websites, portfolio sites with too
            much personality — because I believe the best way to learn is to ship.
          </p>
          <p style={{ marginBottom: 'var(--space-sm)' }}>
            Space has always been my obsession, not just as a subject but as a
            lens: the vastness of it, the silence, the idea that light from
            dying stars still reaches us. That same sense of scale is what I
            bring to my work.
          </p>
          <p>
            I'm chasing two horizons in parallel — a seat at an IIT through GATE,
            and a role at a company where the problems are as big as I want them
            to be. For now, I write code, break things on purpose, and refuse to
            wait for the right moment. The right moment is being built.
          </p>
        </div>
      </div>
    </section>
  );
}
