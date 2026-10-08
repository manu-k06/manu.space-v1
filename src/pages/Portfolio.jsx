import React from 'react';
import { Home } from './Home';
import { Projects } from './Projects';
import { About } from './About';
import { Journey } from './Journey';
import { Contact } from './Contact';
import { CelestialSky } from '../components/CelestialSky';

export function Portfolio() {
  return (
    <>
      <Home />
      <div className="portfolio-space">
        <CelestialSky />
        <Projects />
        <About />
        <Journey />
        <Contact />
      </div>
    </>
  );
}
