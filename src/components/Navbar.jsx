import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const sections = ['home', 'projects', 'about', 'journey', 'contact'];

export function Navbar() {
  const [active, setActive] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const navHeight = navRef.current?.getBoundingClientRect().height || 90;
      const readingLine = navHeight + Math.min(150, innerHeight * 0.2);
      let current = 'home';
      for (const id of sections) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= readingLine)
          current = id;
      }
      if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4)
        current = 'contact';
      setActive(current);
      setIsScrolled(scrollY > 20);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const root = document.documentElement;
    const previousHeight = root.style.getPropertyValue('--nav-height');
    const observer = new ResizeObserver(() => {
      root.style.setProperty(
        '--nav-height',
        `${Math.ceil(navRef.current.getBoundingClientRect().height)}px`
      );
      schedule();
    });
    observer.observe(navRef.current);
    const main = document.getElementById('main-content');
    if (main) observer.observe(main);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (previousHeight)
        root.style.setProperty('--nav-height', previousHeight);
      else root.style.removeProperty('--nav-height');
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className={`site-nav ${isScrolled ? 'site-nav--scrolled' : ''}`}
      aria-label="Main navigation"
    >
      <div className="container">
        <Link
          to="/#home"
          className="brand"
          aria-label="Manu, back to top"
          aria-current={active === 'home' ? 'location' : undefined}
        >
          Manu.
        </Link>
        <div className="nav-links">
          {sections.slice(1).map((id) => (
            <Link
              key={id}
              to={`/#${id}`}
              className={active === id ? 'active' : ''}
              aria-current={active === id ? 'location' : undefined}
            >
              {id}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
