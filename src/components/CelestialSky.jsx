import React, { useEffect, useRef } from 'react';

/**
 * CelestialSky Component (Live Procedural Black & White Deep Space Simulation)
 * 
 * Features:
 * 1. Primary Swirling Spiral Galaxy (Upper Right) with Keplerian differential rotation.
 * 2. Supermassive Black Hole (Mid Right) with Einstein gravitational lensing arcs,
 *    an event horizon shadow, a razor-thin photon ring, and relativistic Doppler beaming.
 * 3. Secondary Globular Satellite Cluster (Lower Left) with spherical orbital dynamics.
 * 4. Ambient field stars with individual twinkling & periodic cosmic shooting stars.
 * 5. Pure high-contrast black & white aesthetic, 60 FPS hardware accelerated, retina ready.
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
        x: w > 900 ? w * 0.78 : w * 0.72,
        y: Math.min(h * 0.14, 380),
      }),
      arms: 2,
      armSpread: 0.44,
      tiltRatio: 0.58,
      tiltAngle: -0.42,
      maxRadius: 360,
      baseSpeed: 0.00065,
    };

    // Black Hole: Supermassive Relativistic Singularity (Mid-Right Pass)
    const bh = {
      getCenter: (w, h) => ({
        x: w > 900 ? w * 0.82 : w * 0.78,
        y: Math.min(Math.max(h * 0.45, 800), 1250),
      }),
      horizonRadius: 26,
      diskRadius: 155,
      tiltRatio: 0.35, // Flattened 3D accretion disk perspective
      tiltAngle: 0.32,  // Accretion disk slant
      baseSpeed: 0.0024,
    };

    // Galaxy 2: Secondary Globular Satellite Cluster (Lower Left)
    const g2 = {
      getCenter: (w, h) => ({
        x: w > 900 ? w * 0.16 : w * 0.22,
        y: h * 0.74,
      }),
      maxRadius: 210,
      baseSpeed: -0.00045,
    };

    const initSimulation = (w, h) => {
      particles = [];
      fieldStars = [];
      meteors = [];

      // Calculate responsive radii
      g1.maxRadius = Math.min(Math.max(w * 0.32, 240), 380);
      g2.maxRadius = Math.min(Math.max(w * 0.19, 150), 220);
      bh.diskRadius = Math.min(Math.max(w * 0.16, 110), 170);
      bh.horizonRadius = Math.max(bh.diskRadius * 0.17, 20);

      // ------------------------------------------
      // 1. Generate Galaxy 1 Spiral Particles (650 particles)
      // ------------------------------------------
      const numG1 = w > 900 ? 650 : 380;
      for (let i = 0; i < numG1; i++) {
        const isCore = Math.random() < 0.26;
        let r, theta;

        if (isCore) {
          r = Math.pow(Math.random(), 2.0) * (g1.maxRadius * 0.24);
          theta = Math.random() * Math.PI * 2;
        } else {
          const armIndex = i % g1.arms;
          const armOffset = (armIndex * (2 * Math.PI)) / g1.arms;
          r = Math.pow(Math.random(), 0.92) * g1.maxRadius + 14;
          const spiralAngle = Math.log(r / 14) * 1.85;
          const scatter = (Math.random() - 0.5) * g1.armSpread * (r / g1.maxRadius + 0.18);
          theta = armOffset + spiralAngle + scatter;
        }

        particles.push({
          type: 'galaxy1',
          r,
          theta,
          speed: (0.16 / (Math.sqrt(r) + 4)) * g1.baseSpeed * 320,
          size: Math.random() < 0.08 ? 2.0 + Math.random() * 0.9 : 0.75 + Math.random() * 0.85,
          baseAlpha: Math.random() * 0.6 + 0.3,
          twinkleSpeed: 0.015 + Math.random() * 0.03,
          twinklePhase: Math.random() * Math.PI * 2,
          isProminent: Math.random() < 0.04,
          isSilver: Math.random() < 0.35,
        });
      }

      // ------------------------------------------
      // 2. Generate Black Hole Accretion Disk Particles (340 particles)
      // ------------------------------------------
      const numBH = w > 900 ? 340 : 200;
      for (let i = 0; i < numBH; i++) {
        // High particle density concentrated near the event horizon
        const rNorm = Math.pow(Math.random(), 1.6);
        const r = bh.horizonRadius * 1.08 + rNorm * (bh.diskRadius - bh.horizonRadius * 1.08);
        const theta = Math.random() * Math.PI * 2;

        // Relativistic Keplerian velocity: inner matter orbits at blistering speeds
        const orbitalSpeed = (32 / Math.pow(r, 1.15)) * bh.baseSpeed;

        particles.push({
          type: 'blackhole',
          r,
          theta,
          speed: orbitalSpeed,
          size: Math.random() < 0.12 ? 1.8 + Math.random() * 0.7 : 0.75 + Math.random() * 0.75,
          baseAlpha: Math.random() * 0.65 + 0.35,
          twinkleSpeed: 0.03 + Math.random() * 0.05,
          twinklePhase: Math.random() * Math.PI * 2,
          isProminent: false,
          isSilver: Math.random() < 0.3,
        });
      }

      // ------------------------------------------
      // 3. Generate Galaxy 2 Globular Satellite (200 particles)
      // ------------------------------------------
      const numG2 = w > 900 ? 200 : 120;
      for (let i = 0; i < numG2; i++) {
        const r = Math.pow(Math.random(), 1.7) * g2.maxRadius;
        const theta = Math.random() * Math.PI * 2;

        particles.push({
          type: 'galaxy2',
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

      // ------------------------------------------
      // 4. Ambient Background Field Stars (100 stars)
      // ------------------------------------------
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

    const cosPhiBH = Math.cos(bh.tiltAngle);
    const sinPhiBH = Math.sin(bh.tiltAngle);

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      const c1 = g1.getCenter(width, height);
      const c2 = g2.getCenter(width, height);
      const cBH = bh.getCenter(width, height);

      // ------------------------------------------
      // 1. Draw Primary Spiral Galactic Nucleus Glow
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
      // 3. Draw Black Hole Gravitational Lensing Halo (Einstein Arcs)
      // ------------------------------------------
      // Outer diffuse gravitational glow
      const bhGlowR = bh.diskRadius * 1.1;
      const bhGrad = ctx.createRadialGradient(cBH.x, cBH.y, bh.horizonRadius, cBH.x, cBH.y, bhGlowR);
      bhGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
      bhGrad.addColorStop(0.2, 'rgba(220, 225, 240, 0.18)');
      bhGrad.addColorStop(0.55, 'rgba(160, 175, 205, 0.05)');
      bhGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = bhGrad;
      ctx.beginPath();
      ctx.arc(cBH.x, cBH.y, bhGlowR, 0, Math.PI * 2);
      ctx.fill();

      // Upper Gravitational Lensing Arc (Light bent over the top of the event horizon)
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(
        cBH.x,
        cBH.y - bh.horizonRadius * 0.35,
        bh.diskRadius * 0.68,
        bh.horizonRadius * 1.35,
        bh.tiltAngle * 0.5,
        Math.PI * 0.85,
        Math.PI * 2.15
      );
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Lower Lensing Arc
      ctx.beginPath();
      ctx.ellipse(
        cBH.x,
        cBH.y + bh.horizonRadius * 0.35,
        bh.diskRadius * 0.62,
        bh.horizonRadius * 1.1,
        bh.tiltAngle * 0.5,
        0,
        Math.PI * 1.0
      );
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.restore();

      // ------------------------------------------
      // 4. Render Background Field Stars
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
      // 5. Render Live Orbiting Galaxy & Black Hole Particles
      // ------------------------------------------
      // Separate black hole particles into background and foreground for 3D depth
      const bhForegroundParticles = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.theta += p.speed;

        let px, py;
        let alpha = p.baseAlpha;

        if (p.type === 'galaxy1') {
          const xp = p.r * Math.cos(p.theta);
          const yp = p.r * Math.sin(p.theta) * g1.tiltRatio;
          px = c1.x + (xp * cosPhi1 - yp * sinPhi1);
          py = c1.y + (xp * sinPhi1 + yp * cosPhi1);

          const twinkle = Math.sin(time * p.twinkleSpeed + p.twinklePhase) * 0.3 + 0.7;
          alpha = Math.max(0, Math.min(1, p.baseAlpha * twinkle));
        } else if (p.type === 'galaxy2') {
          px = c2.x + p.r * Math.cos(p.theta);
          py = c2.y + p.r * Math.sin(p.theta) * 0.85;

          const twinkle = Math.sin(time * p.twinkleSpeed + p.twinklePhase) * 0.3 + 0.7;
          alpha = Math.max(0, Math.min(1, p.baseAlpha * twinkle));
        } else if (p.type === 'blackhole') {
          const xp = p.r * Math.cos(p.theta);
          const yp = p.r * Math.sin(p.theta) * bh.tiltRatio;
          px = cBH.x + (xp * cosPhiBH - yp * sinPhiBH);
          py = cBH.y + (xp * sinPhiBH + yp * cosPhiBH);

          // Relativistic Doppler Beaming: Approaching matter on left is brighter
          const doppler = 1.0 + 0.5 * Math.sin(p.theta);
          const twinkle = Math.sin(time * p.twinkleSpeed + p.twinklePhase) * 0.2 + 0.8;
          alpha = Math.max(0, Math.min(1, p.baseAlpha * doppler * twinkle));

          // If particle passes in the foreground (below the event horizon in Y),
          // defer drawing until after the event horizon disk is rendered
          if (yp > 0) {
            bhForegroundParticles.push({ px, py, size: p.size, alpha, isSilver: p.isSilver });
            continue;
          }
        }

        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.isSilver ? '#e4ebf5' : '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();

        // 4-point diffraction spike on prominent galaxy stars
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
      // 6. Render Black Hole Event Horizon Shadow & Photon Sphere
      // ------------------------------------------
      ctx.globalAlpha = 1.0;

      // Event Horizon (Absolute Pitch-Black Shadow)
      ctx.fillStyle = '#050505';
      ctx.beginPath();
      ctx.arc(cBH.x, cBH.y, bh.horizonRadius, 0, Math.PI * 2);
      ctx.fill();

      // Brilliant Razor-Thin Photon Sphere Ring
      ctx.save();
      ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowBlur = 10;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(cBH.x, cBH.y, bh.horizonRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // ------------------------------------------
      // 7. Render Foreground Accretion Disk Particles
      // ------------------------------------------
      for (let i = 0; i < bhForegroundParticles.length; i++) {
        const fp = bhForegroundParticles[i];
        ctx.globalAlpha = fp.alpha;
        ctx.fillStyle = fp.isSilver ? '#e4ebf5' : '#ffffff';
        ctx.beginPath();
        ctx.arc(fp.px, fp.py, fp.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // ------------------------------------------
      // 8. Cosmic Shooting Stars
      // ------------------------------------------
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
      {/* 100% Live Procedural Canvas Deep Space (Galaxy + Black Hole) */}
      <canvas ref={canvasRef} className="live-galaxy-canvas" />

      {/* Atmospheric Cosmic Backdrop Vignettes */}
      <div className="nebula-cloud nebula-cloud--top" />
      <div className="nebula-cloud nebula-cloud--mid-left" />
      <div className="nebula-cloud nebula-cloud--bottom-right" />
    </div>
  );
}
