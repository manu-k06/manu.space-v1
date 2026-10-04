import React, { useEffect, useRef } from 'react';

/**
 * CelestialSky Component (Live Procedural Deep Space Cosmos)
 * 
 * Features:
 * 1. Galaxy 1 (Upper Right): Grand Face-On Spiral Galaxy with differential Keplerian rotation.
 * 2. Galaxy 2 (Mid Right): Edge-On "Sombrero" Galaxy (Messier 104) with a blazing vertical core
 *    and a razor-sharp horizontal disk bisected by a dramatic dark silhouette dust lane.
 * 3. Galaxy 3 (Lower Left): Globular Satellite Cluster adding depth to the lower mountain pass.
 * 4. Rich Multi-Comet System: Frequent, simultaneous shooting stars & grand comets
 *    with glowing nucleus cores and long sweeping ion dust tails.
 * 5. Ambient Field Stars: Shimmering background stars with independent twinkle cycles.
 * 6. 100% High-Contrast Black & White / Silver aesthetic, 60 FPS hardware-accelerated.
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
    let comets = [];

    // Galaxy 1: Primary Grand Spiral Galaxy (Upper Right)
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

    // Galaxy 2: Edge-On Sombrero Galaxy (Messier 104, Mid-Right Pass)
    const g2 = {
      getCenter: (w, h) => ({
        x: w > 900 ? w * 0.82 : w * 0.78,
        y: Math.min(Math.max(h * 0.46, 800), 1250),
      }),
      diskRadius: 280,   // Wide horizontal span
      tiltRatio: 0.13,    // Razor-thin edge-on aspect ratio
      tiltAngle: -0.14,   // Slight cinematic slant (~ -8 degrees)
      bulgeRadiusX: 105,  // Broad nuclear bulge
      bulgeRadiusY: 62,   // Vertical bulge extension
      baseSpeed: 0.00075,
    };

    // Galaxy 3: Globular Satellite Cluster (Lower Left)
    const g3 = {
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
      comets = [];

      // Calculate responsive dimensions
      g1.maxRadius = Math.min(Math.max(w * 0.32, 240), 380);
      g2.diskRadius = Math.min(Math.max(w * 0.28, 200), 320);
      g2.bulgeRadiusX = g2.diskRadius * 0.38;
      g2.bulgeRadiusY = g2.diskRadius * 0.22;
      g3.maxRadius = Math.min(Math.max(w * 0.18, 140), 220);

      // ------------------------------------------
      // 1. Generate Galaxy 1 Spiral Particles (580 particles)
      // ------------------------------------------
      const numG1 = w > 900 ? 580 : 350;
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
      // 2. Generate Galaxy 2 Edge-On Sombrero Particles (520 particles)
      // ------------------------------------------
      const numG2 = w > 900 ? 520 : 320;
      for (let i = 0; i < numG2; i++) {
        const isBulge = Math.random() < 0.32;
        let r, theta;

        if (isBulge) {
          // Central spherical/elliptical stellar halo
          r = Math.pow(Math.random(), 1.6) * g2.bulgeRadiusX;
          theta = Math.random() * Math.PI * 2;
        } else {
          // Razor-thin luminous outer disk rim
          r = g2.bulgeRadiusX * 0.75 + Math.pow(Math.random(), 1.2) * (g2.diskRadius - g2.bulgeRadiusX * 0.75);
          theta = Math.random() * Math.PI * 2;
        }

        particles.push({
          type: 'sombrero',
          isBulge,
          r,
          theta,
          speed: (0.14 / (Math.sqrt(r) + 4)) * g2.baseSpeed * 280,
          size: Math.random() < 0.10 ? 1.8 + Math.random() * 0.8 : 0.7 + Math.random() * 0.75,
          baseAlpha: isBulge ? Math.random() * 0.65 + 0.35 : Math.random() * 0.75 + 0.25,
          twinkleSpeed: 0.014 + Math.random() * 0.025,
          twinklePhase: Math.random() * Math.PI * 2,
          isProminent: Math.random() < 0.03,
          isSilver: Math.random() < 0.3,
        });
      }

      // ------------------------------------------
      // 3. Generate Galaxy 3 Globular Satellite (180 particles)
      // ------------------------------------------
      const numG3 = w > 900 ? 180 : 110;
      for (let i = 0; i < numG3; i++) {
        const r = Math.pow(Math.random(), 1.7) * g3.maxRadius;
        const theta = Math.random() * Math.PI * 2;

        particles.push({
          type: 'galaxy3',
          r,
          theta,
          speed: (0.10 / (Math.sqrt(r) + 5)) * g3.baseSpeed * 240,
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

    const cosPhiSombrero = Math.cos(g2.tiltAngle);
    const sinPhiSombrero = Math.sin(g2.tiltAngle);

    // Helper to spawn a dynamic comet
    const spawnComet = () => {
      const isGrandComet = Math.random() < 0.25;
      const startX = Math.random() * (width * 0.85) + width * 0.15;
      const startY = Math.random() * (height * 0.65) + 30;
      const speed = isGrandComet ? Math.random() * 4 + 5 : Math.random() * 7 + 8;
      const angle = (Math.random() * 0.25 + 0.52);

      comets.push({
        x: startX,
        y: startY,
        dx: -Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        len: isGrandComet ? Math.random() * 90 + 110 : Math.random() * 50 + 55,
        headSize: isGrandComet ? 2.5 : 1.5,
        life: 1.0,
        decay: isGrandComet ? 0.012 : 0.022,
        isGrand: isGrandComet,
      });
    };

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      const c1 = g1.getCenter(width, height);
      const c2 = g2.getCenter(width, height);
      const c3 = g3.getCenter(width, height);

      // ------------------------------------------
      // 1. Draw Galaxy 1 Spiral Galactic Core Glow
      // ------------------------------------------
      const coreR1 = g1.maxRadius * 0.65;
      const coreGrad1 = ctx.createRadialGradient(c1.x, c1.y, 0, c1.x, c1.y, coreR1);
      coreGrad1.addColorStop(0, 'rgba(255, 255, 255, 0.48)');
      coreGrad1.addColorStop(0.15, 'rgba(235, 240, 250, 0.24)');
      coreGrad1.addColorStop(0.40, 'rgba(190, 200, 220, 0.08)');
      coreGrad1.addColorStop(0.75, 'rgba(140, 150, 170, 0.02)');
      coreGrad1.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coreGrad1;
      ctx.beginPath();
      ctx.arc(c1.x, c1.y, coreR1, 0, Math.PI * 2);
      ctx.fill();

      // ------------------------------------------
      // 2. Draw Sombrero Galaxy (M104) Blazing Nuclear Bulge & Disk
      // ------------------------------------------
      ctx.save();
      ctx.translate(c2.x, c2.y);
      ctx.rotate(g2.tiltAngle);

      // Blazing central vertical elliptical bulge glow
      const bulgeGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, g2.bulgeRadiusX);
      bulgeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
      bulgeGrad.addColorStop(0.18, 'rgba(240, 245, 255, 0.35)');
      bulgeGrad.addColorStop(0.45, 'rgba(190, 205, 230, 0.12)');
      bulgeGrad.addColorStop(0.85, 'rgba(130, 145, 175, 0.02)');
      bulgeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = bulgeGrad;
      ctx.beginPath();
      ctx.scale(1.0, g2.bulgeRadiusY / g2.bulgeRadiusX);
      ctx.arc(0, 0, g2.bulgeRadiusX, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Sombrero Outer Disk Glowing Rim (Luminous Razor-Thin Base)
      ctx.save();
      ctx.translate(c2.x, c2.y);
      ctx.rotate(g2.tiltAngle);
      const diskGrad = ctx.createLinearGradient(-g2.diskRadius, 0, g2.diskRadius, 0);
      diskGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      diskGrad.addColorStop(0.2, 'rgba(220, 230, 250, 0.25)');
      diskGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
      diskGrad.addColorStop(0.8, 'rgba(220, 230, 250, 0.25)');
      diskGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.strokeStyle = diskGrad;
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.ellipse(0, 0, g2.diskRadius * 0.96, g2.diskRadius * g2.tiltRatio, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // ------------------------------------------
      // 3. Draw Galaxy 3 Globular Core Glow
      // ------------------------------------------
      const coreR3 = g3.maxRadius * 0.55;
      const coreGrad3 = ctx.createRadialGradient(c3.x, c3.y, 0, c3.x, c3.y, coreR3);
      coreGrad3.addColorStop(0, 'rgba(240, 245, 255, 0.28)');
      coreGrad3.addColorStop(0.25, 'rgba(190, 200, 220, 0.09)');
      coreGrad3.addColorStop(0.70, 'rgba(140, 150, 170, 0.02)');
      coreGrad3.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coreGrad3;
      ctx.beginPath();
      ctx.arc(c3.x, c3.y, coreR3, 0, Math.PI * 2);
      ctx.fill();

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
      // 5. Render Live Orbiting Particles (Galaxy 1, Sombrero Background, Galaxy 3)
      // ------------------------------------------
      const sombreroForeground = [];

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
        } else if (p.type === 'sombrero') {
          // Sombrero Edge-On Coordinates
          const xp = p.r * Math.cos(p.theta);
          const yTilt = p.isBulge ? (g2.bulgeRadiusY / g2.bulgeRadiusX) : g2.tiltRatio;
          const yp = p.r * Math.sin(p.theta) * yTilt;

          px = c2.x + (xp * cosPhiSombrero - yp * sinPhiSombrero);
          py = c2.y + (xp * sinPhiSombrero + yp * cosPhiSombrero);

          const twinkle = Math.sin(time * p.twinkleSpeed + p.twinklePhase) * 0.25 + 0.75;
          alpha = Math.max(0, Math.min(1, p.baseAlpha * twinkle));

          // If in the foreground (below the disk midline), draw after the dark dust lane!
          if (yp > 0) {
            sombreroForeground.push({ px, py, size: p.size, alpha, isSilver: p.isSilver });
            continue;
          }
        } else if (p.type === 'galaxy3') {
          px = c3.x + p.r * Math.cos(p.theta);
          py = c3.y + p.r * Math.sin(p.theta) * 0.85;

          const twinkle = Math.sin(time * p.twinkleSpeed + p.twinklePhase) * 0.3 + 0.7;
          alpha = Math.max(0, Math.min(1, p.baseAlpha * twinkle));
        }

        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.isSilver ? '#e4ebf5' : '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();

        // 4-point diffraction cross spikes on prominent stars
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
      // 6. Draw Sombrero Iconic Dark Dust Lane (Silhouette Absorption)
      // ------------------------------------------
      ctx.save();
      ctx.translate(c2.x, c2.y);
      ctx.rotate(g2.tiltAngle);

      // Dark dust lane slicing right through the lower-center of the bright core
      ctx.beginPath();
      ctx.ellipse(0, 3.5, g2.diskRadius * 0.94, g2.diskRadius * g2.tiltRatio * 0.55, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(7, 7, 8, 0.94)';
      ctx.lineWidth = 4.8;
      ctx.stroke();

      // Secondary fine interstellar dust filament
      ctx.beginPath();
      ctx.ellipse(0, 5.5, g2.diskRadius * 0.85, g2.diskRadius * g2.tiltRatio * 0.40, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(9, 9, 11, 0.75)';
      ctx.lineWidth = 2.4;
      ctx.stroke();
      ctx.restore();

      // ------------------------------------------
      // 7. Render Sombrero Foreground Starlight Rim
      // ------------------------------------------
      for (let i = 0; i < sombreroForeground.length; i++) {
        const fp = sombreroForeground[i];
        ctx.globalAlpha = fp.alpha;
        ctx.fillStyle = fp.isSilver ? '#e4ebf5' : '#ffffff';
        ctx.beginPath();
        ctx.arc(fp.px, fp.py, fp.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // ------------------------------------------
      // 8. Active Multi-Comet System (Frequent & Luminous)
      // ------------------------------------------
      if (Math.random() < 0.024 && comets.length < 4) {
        spawnComet();
      }

      for (let i = comets.length - 1; i >= 0; i--) {
        const m = comets[i];
        m.x += m.dx;
        m.y += m.dy;
        m.life -= m.decay;

        if (m.life <= 0 || m.x < -100 || m.y > height + 100) {
          comets.splice(i, 1);
          continue;
        }

        const tailX = m.x - (m.dx * m.len) / 10;
        const tailY = m.y - (m.dy * m.len) / 10;

        // Coma / Ion Dust Tail
        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${m.life * 0.95})`);
        grad.addColorStop(0.2, `rgba(220, 230, 250, ${m.life * 0.65})`);
        grad.addColorStop(0.6, `rgba(180, 195, 225, ${m.life * 0.25})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = m.isGrand ? 2.4 : 1.6;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Luminous Comet Nucleus Head
        ctx.globalAlpha = m.life;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.headSize, 0, Math.PI * 2);
        ctx.fill();

        // Soft outer coma glow on grand comets
        if (m.isGrand) {
          ctx.fillStyle = `rgba(220, 230, 255, ${m.life * 0.4})`;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.headSize * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
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
      {/* 100% Live Procedural Canvas Deep Space (Galaxies & Comets) */}
      <canvas ref={canvasRef} className="live-galaxy-canvas" />

      {/* Atmospheric Cosmic Backdrop Vignettes */}
      <div className="nebula-cloud nebula-cloud--top" />
      <div className="nebula-cloud nebula-cloud--mid-left" />
      <div className="nebula-cloud nebula-cloud--bottom-right" />
    </div>
  );
}
