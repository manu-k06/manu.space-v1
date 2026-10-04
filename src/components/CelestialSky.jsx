import React, { useEffect, useRef } from 'react';

/**
 * CelestialSky Component (Live Procedural Black & White Galaxy)
 * 
 * Replaces static images with a 100% live-simulated Canvas Galaxy:
 * - Real orbital astrophysics with differential rotation (inner core rotates faster)
 * - Authentic 3D tilted logarithmic spiral arms with galactic nucleus
 * - Hundreds of individual starlight particles, cosmic dust, and diffraction spikes
 * - Secondary satellite globular cluster on lower pass
 * - Subtle ambient cosmic shooting star passes
 * - Pure high-contrast black & white aesthetic
 * - 60 FPS hardware accelerated, retina/HiDPI ready, non-blocking
 */
export function CelestialSky() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // ==========================================
    // PROCEDURAL SIMULATION SETUP
    // ==========================================
    let particles = [];
    let fieldStars = [];
    let meteors = [];

    // Galaxy 1: Primary 3D Tilted Spiral Galaxy (Upper Right)
    const g1 = {
      getCenter: (w, h) => ({
        x: w > 900 ? w * 0.80 : w * 0.75,
        y: Math.min(h * 0.15, 390),
      }),
      arms: 2,
      armSpread: 0.45,
      tiltRatio: 0.58, // Elliptical 3D perspective tilt
      tiltAngle: -0.42, // ~ -24 degrees orientation
      maxRadius: 360,
      baseSpeed: 0.00065,
    };

    // Galaxy 2: Secondary Globular Satellite Cluster (Lower Left)
    const g2 = {
      getCenter: (w, h) => ({
        x: w > 900 ? w * 0.16 : w * 0.22,
        y: h * 0.60,
      }),
      maxRadius: 220,
      baseSpeed: -0.00045,
    };

    const initSimulation = (w, h) => {
      particles = [];
      fieldStars = [];
      meteors = [];

      // Calculate responsive radii
      const r1 = Math.min(Math.max(w * 0.32, 240), 380);
      g1.maxRadius = r1;

      const r2 = Math.min(Math.max(w * 0.20, 160), 230);
      g2.maxRadius = r2;

      // 1. Generate Galaxy 1 Spiral Particles (750 particles)
      const numG1 = w > 900 ? 750 : 450;
      for (let i = 0; i < numG1; i++) {
        const isCore = Math.random() < 0.26;
        let r, theta;

        if (isCore) {
          // Central bulge distribution
          r = Math.pow(Math.random(), 2.0) * (g1.maxRadius * 0.24);
          theta = Math.random() * Math.PI * 2;
        } else {
          // Logarithmic spiral arms
          const armIndex = i % g1.arms;
          const armOffset = (armIndex * (2 * Math.PI)) / g1.arms;
          r = Math.pow(Math.random(), 0.92) * g1.maxRadius + 14;
          const spiralAngle = Math.log(r / 14) * 1.85;
          const scatter = (Math.random() - 0.5) * g1.armSpread * (r / g1.maxRadius + 0.18);
          theta = armOffset + spiralAngle + scatter;
        }

        particles.push({
          galaxy: 1,
          r,
          theta,
          // Differential velocity: stars closer to core orbit faster
          speed: (0.16 / (Math.sqrt(r) + 4)) * g1.baseSpeed * 320,
          size: Math.random() < 0.08 ? 2.0 + Math.random() * 0.9 : 0.75 + Math.random() * 0.85,
          baseAlpha: Math.random() * 0.6 + 0.3,
          twinkleSpeed: 0.015 + Math.random() * 0.03,
          twinklePhase: Math.random() * Math.PI * 2,
          isProminent: Math.random() < 0.04, // Has diffraction spikes
          isSilver: Math.random() < 0.35,
        });
      }

      // 2. Generate Galaxy 2 Globular Satellite (220 particles)
      const numG2 = w > 900 ? 220 : 130;
      for (let i = 0; i < numG2; i++) {
        const r = Math.pow(Math.random(), 1.7) * g2.maxRadius;
        const theta = Math.random() * Math.PI * 2;

        particles.push({
          galaxy: 2,
          r,
          theta,
          speed: (0.10 / (Math.sqrt(r) + 5)) * g2.baseSpeed * 240,
          size: 0.7 + Math.random() * 0.9,
          baseAlpha: Math.random() * 0.5 + 0.2,
          twinkleSpeed: 0.012 + Math.random() * 0.02,
          twinklePhase: Math.random() * Math.PI * 2,
          isProminent: false,
          isSilver: true,
        });
      }

      // 3. Ambient Background Field Stars (100 stars)
      const numField = 100;
      for (let i = 0; i < numField; i++) {
        fieldStars.push({
          x: Math.random(),
          y: Math.random(),
          size: Math.random() < 0.12 ? 2.0 : (Math.random() < 0.4 ? 1.3 : 0.8),
          alpha: Math.random() * 0.55 + 0.25,
          twinkleSpeed: 0.01 + Math.random() * 0.025,
          twinklePhase: Math.random() * Math.PI * 2,
          isSilver: Math.random() < 0.4,
        });
      }
    };

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.resetTransform?.() || ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initSimulation(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // ==========================================
    // LIVE ANIMATION RENDER LOOP (60 FPS)
    // ==========================================
    let time = 0;
    const cosPhi1 = Math.cos(g1.tiltAngle);
    const sinPhi1 = Math.sin(g1.tiltAngle);

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      const c1 = g1.getCenter(width, height);
      const c2 = g2.getCenter(width, height);

      // ------------------------------------------
      // 1. Draw Primary Galactic Nucleus Glow
      // ------------------------------------------
      const coreR1 = g1.maxRadius * 0.65;
      const coreGrad1 = ctx.createRadialGradient(c1.x, c1.y, 0, c1.x, c1.y, coreR1);
      coreGrad1.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      coreGrad1.addColorStop(0.15, 'rgba(235, 240, 250, 0.22)');
      coreGrad1.addColorStop(0.40, 'rgba(190, 200, 220, 0.08)');
      coreGrad1.addColorStop(0.75, 'rgba(140, 150, 170, 0.02)');
      coreGrad1.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coreGrad1;
      ctx.beginPath();
      ctx.arc(c1.x, c1.y, coreR1, 0, Math.PI * 2);
      ctx.fill();

      // ------------------------------------------
      // 2. Draw Secondary Globular Core Glow
      // ------------------------------------------
      const coreR2 = g2.maxRadius * 0.55;
      const coreGrad2 = ctx.createRadialGradient(c2.x, c2.y, 0, c2.x, c2.y, coreR2);
      coreGrad2.addColorStop(0, 'rgba(240, 245, 255, 0.28)');
      coreGrad2.addColorStop(0.25, 'rgba(190, 200, 220, 0.09)');
      coreGrad2.addColorStop(0.70, 'rgba(140, 150, 170, 0.02)');
      coreGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coreGrad2;
      ctx.beginPath();
      ctx.arc(c2.x, c2.y, coreR2, 0, Math.PI * 2);
      ctx.fill();

      // ------------------------------------------
      // 3. Render Field Background Stars
      // ------------------------------------------
      for (let i = 0; i < fieldStars.length; i++) {
        const s = fieldStars[i];
        const twinkle = Math.sin(time * s.twinkleSpeed + s.twinklePhase) * 0.35 + 0.65;
        const alpha = Math.max(0, Math.min(1, s.alpha * twinkle));

        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.isSilver ? '#d8e0ec' : '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x * width, s.y * height, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // ------------------------------------------
      // 4. Render Live Orbiting Galaxy Particles
      // ------------------------------------------
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.theta += p.speed; // Keplerian orbital motion

        let px, py;
        if (p.galaxy === 1) {
          // 3D tilted elliptical orbital projection
          const xp = p.r * Math.cos(p.theta);
          const yp = p.r * Math.sin(p.theta) * g1.tiltRatio;
          // Apply orientation rotation
          px = c1.x + (xp * cosPhi1 - yp * sinPhi1);
          py = c1.y + (xp * sinPhi1 + yp * cosPhi1);
        } else {
          // Spherical globular projection
          px = c2.x + p.r * Math.cos(p.theta);
          py = c2.y + p.r * Math.sin(p.theta) * 0.85;
        }

        const twinkle = Math.sin(time * p.twinkleSpeed + p.twinklePhase) * 0.3 + 0.7;
        const alpha = Math.max(0, Math.min(1, p.baseAlpha * twinkle));

        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.isSilver ? '#e4ebf5' : '#ffffff';

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw delicate Hubble/JWST 4-point diffraction spike on prominent stars
        if (p.isProminent && alpha > 0.55) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.75})`;
          ctx.lineWidth = 0.8;
          const crossSize = p.size * 3.4;

          ctx.beginPath();
          ctx.moveTo(px - crossSize, py);
          ctx.lineTo(px + crossSize, py);
          ctx.moveTo(px, py - crossSize);
          ctx.lineTo(px, py + crossSize);
          ctx.stroke();
        }
      }

      // ------------------------------------------
      // 5. Cosmic Shooting Stars
      // ------------------------------------------
      // Spawn a new meteor occasionally (every ~500-800 frames)
      if (Math.random() < 0.003 && meteors.length < 2) {
        meteors.push({
          x: Math.random() * (width * 0.7) + width * 0.2,
          y: Math.random() * (height * 0.4) + 60,
          dx: -(Math.random() * 6 + 7),
          dy: Math.random() * 4 + 4,
          len: Math.random() * 60 + 60,
          life: 1.0,
          decay: Math.random() * 0.02 + 0.02,
        });
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.dx;
        m.y += m.dy;
        m.life -= m.decay;

        if (m.life <= 0) {
          meteors.splice(i, 1);
          continue;
        }

        const grad = ctx.createLinearGradient(
          m.x,
          m.y,
          m.x - (m.dx * m.len) / 10,
          m.y - (m.dy * m.len) / 10
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${m.life})`);
        grad.addColorStop(0.3, `rgba(210, 220, 240, ${m.life * 0.6})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - (m.dx * m.len) / 10, m.y - (m.dy * m.len) / 10);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="celestial-canvas-wrap" aria-hidden="true">
      {/* 100% Live Procedural Canvas Galaxy (Black & White) */}
      <canvas ref={canvasRef} className="live-galaxy-canvas" />

      {/* Atmospheric Cosmic Backdrop Vignettes */}
      <div className="nebula-cloud nebula-cloud--top" />
      <div className="nebula-cloud nebula-cloud--mid-left" />
      <div className="nebula-cloud nebula-cloud--bottom-right" />
    </div>
  );
}
