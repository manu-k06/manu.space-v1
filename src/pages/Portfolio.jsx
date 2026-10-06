import React, { useState } from 'react';
import { Home } from './Home';
import { Projects } from './Projects';
import { About } from './About';
import { Journey } from './Journey';
import { Contact } from './Contact';
import { CelestialSky } from '../components/CelestialSky';

export function Portfolio() {
  const [paused, setPaused] = useState(false);
  const toggleMotion = () => setPaused((value) => !value);
  return (
    <>
      <Home />
      <div className="portfolio-space">
        <CelestialSky paused={paused} />
        <Projects paused={paused} onToggleMotion={toggleMotion} />
        <About />
        <Journey paused={paused} onToggleMotion={toggleMotion} />
        <Contact paused={paused} onToggleMotion={toggleMotion} />
      </div>
    </>
  );
}
