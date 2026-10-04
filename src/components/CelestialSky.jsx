import React, { useEffect, useRef } from 'react';

/**
 * CelestialSky Component (High-Performance 2D Canvas with 3D Orbital Astrophysics)
 * 
 * Features:
 * 1. Galaxy 1 (Upper Right): Grand 3D Tilted Spiral Galaxy (2-arm grand design, counter-clockwise).
 * 2. Galaxy 2 (Mid Right): Companion 3-Arm Pinwheel Spiral Galaxy (Pinwheel / Triangulum morphology,
 *    clockwise counter-rotation, complementary 3D inclination tilt angle, and radiant starlight core).
 * 3. Galaxy 3 (Lower Left): Distant Globular Satellite Cluster
 * 4. Rich Multi-Comet System: Frequent, simultaneous shooting stars & grand comets
 * 5. 100% Lightweight, Zero-Dependency Canvas 2D running at locked 60 FPS hardware acceleration.
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
    let nebulaFilaments = [];

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

    // Galaxy 2: Companion 3-Arm Pinwheel Spiral Galaxy (Mid-Right Pass)
    // Distinct from Galaxy 1: 3 sweeping arms, clockwise counter-rotation, complementary 3D tilt
    const g2 = {
      getCenter: (w, h) => ({
        x: w > 900 ? w * 0.82 : w * 0.78,
        y: Math.min(Math.max(h * 0.46, 800), 1250),
      }),
      arms: 3,
      armSpread: 0.48,
      tiltRatio: 0.50,
      tiltAngle: 0.38,
      maxRadius: 275,
      baseSpeed: -0.00055,
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
      g2.maxRadius = Math.min(Math.max(w * 0.24, 180), 280);
      g3.maxRadius = Math.min(Math.max(w * 0.18, 140), 220);

      // ------------------------------------------
      // 1. Generate Galaxy 1 Spiral Particles (580 particles, 2-Arm Grand Design)
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
      // 2. Generate Galaxy 2 Companion Spiral Particles (3-Arm Pinwheel with Starburst Nodes & Dust Lanes)
      // ------------------------------------------
      const numG2 = w > 900 ? 540 : 330;
      for (let i = 0; i < numG2; i++) {
        const isCore = Math.random() < 0.22;
        let r, theta;
        let isStarburst = false;
        let isDust = false;

        if (isCore) {
          r = Math.pow(Math.random(), 2.1) * (g2.maxRadius * 0.22);
          theta = Math.random() * Math.PI * 2;
        } else {
          const armIndex = i % g2.arms;
          const armOffset = (armIndex * (2 * Math.PI)) / g2.arms;

          // 12% interstellar dark dust absorption lane particles along inner arm edges
          if (i % 8 === 0) {
            isDust = true;
            r = Math.pow(Math.random(), 0.95) * (g2.maxRadius * 0.88) + 18;
            const spiralAngle = Math.log(r / 12) * 2.15;
            theta = armOffset + spiralAngle - 0.16 + (Math.random() - 0.5) * 0.12;
          } else if (i % 14 === 1) {
            // Prominent starburst cluster nodes along arm ridges
            isStarburst = true;
            const fraction = 0.30 + ((i % 5) / 5) * 0.60;
            r = g2.maxRadius * fraction + (Math.random() - 0.5) * 8;
            const spiralAngle = Math.log(r / 12) * 2.15;
            theta = armOffset + spiralAngle + (Math.random() - 0.5) * 0.08;
          } else {
            r = Math.pow(Math.random(), 0.90) * g2.maxRadius + 12;
            const spiralAngle = Math.log(r / 12) * 2.15;
            const scatter = (Math.random() - 0.5) * g2.armSpread * (r / g2.maxRadius + 0.20);
            theta = armOffset + spiralAngle + scatter;
          }
        }

        particles.push({
          type: 'galaxy2',
          r,
          theta,
          speed: (0.15 / (Math.sqrt(r) + 4.2)) * g2.baseSpeed * 300,
          size: isDust 
            ? Math.random() * 2.2 + 3.4 
            : isStarburst 
              ? Math.random() * 1.0 + 2.5 
              : Math.random() < 0.09 ? 1.9 + Math.random() * 0.9 : 0.7 + Math.random() * 0.85,
          baseAlpha: isDust 
            ? Math.random() * 0.10 + 0.08 
            : isStarburst 
              ? Math.random() * 0.25 + 0.75 
              : Math.random() * 0.6 + 0.3,
          twinkleSpeed: 0.014 + Math.random() * 0.028,
          twinklePhase: Math.random() * Math.PI * 2,
          isProminent: isStarburst || Math.random() < 0.045,
          isSilver: isDust ? false : Math.random() < 0.35,
          isDust,
          isStarburst,
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

    const cosPhi2 = Math.cos(g2.tiltAngle);
    const sinPhi2 = Math.sin(g2.tiltAngle);

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
      // 2. Draw Galaxy 2 Companion Spiral Core & Disc Glow
      // ------------------------------------------
      const coreR2 = g2.maxRadius * 0.62;
      ctx.save();
      ctx.translate(c2.x, c2.y);
      ctx.rotate(g2.tiltAngle);
      ctx.scale(1.0, g2.tiltRatio);

      // Diffuse elliptical galactic disk glow
      const discGrad2 = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR2);
      discGrad2.addColorStop(0, 'rgba(255, 255, 255, 0.42)');
      discGrad2.addColorStop(0.18, 'rgba(230, 240, 255, 0.20)');
      discGrad2.addColorStop(0.48, 'rgba(185, 200, 225, 0.065)');
      discGrad2.addColorStop(0.82, 'rgba(140, 150, 175, 0.015)');
      discGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = discGrad2;
      ctx.beginPath();
      ctx.arc(0, 0, coreR2, 0, Math.PI * 2);
      ctx.fill();

      // Interstellar dust absorption ring inside core disk
      const dustRing = ctx.createRadialGradient(0, 0, coreR2 * 0.26, 0, 0, coreR2 * 0.42);
      dustRing.addColorStop(0, 'rgba(0, 0, 0, 0)');
      dustRing.addColorStop(0.5, 'rgba(10, 14, 22, 0.24)');
      dustRing.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = dustRing;
      ctx.beginPath();
      ctx.arc(0, 0, coreR2 * 0.42, 0, Math.PI * 2);
      ctx.fill();

      // Inner galactic bar / oval condensation
      const barGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 36);
      barGrad.addColorStop(0, 'rgba(255, 255, 255, 0.70)');
      barGrad.addColorStop(0.35, 'rgba(235, 242, 255, 0.35)');
      barGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = barGrad;
      ctx.beginPath();
      ctx.save();
      ctx.scale(1.35, 0.72);
      ctx.arc(0, 0, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Brilliant central galactic nucleus
      const nucleusGrad2 = ctx.createRadialGradient(0, 0, 0, 0, 0, 16);
      nucleusGrad2.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      nucleusGrad2.addColorStop(0.40, 'rgba(240, 246, 255, 0.50)');
      nucleusGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = nucleusGrad2;
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();
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
      // 5. Render Live Orbiting Particles (Galaxy 1, Galaxy 2, Galaxy 3)
      // ------------------------------------------
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
          const xp = p.r * Math.cos(p.theta);
          const yp = p.r * Math.sin(p.theta) * g2.tiltRatio;
          px = c2.x + (xp * cosPhi2 - yp * sinPhi2);
          py = c2.y + (xp * sinPhi2 + yp * cosPhi2);

          // Handle dark interstellar dust clouds
          if (p.isDust) {
            const dustTwinkle = Math.sin(time * p.twinkleSpeed + p.twinklePhase) * 0.2 + 0.8;
            ctx.globalAlpha = Math.max(0, Math.min(1, p.baseAlpha * dustTwinkle));
            ctx.fillStyle = 'rgba(150, 165, 195, 0.40)';
            ctx.beginPath();
            ctx.arc(px, py, p.size, 0, Math.PI * 2);
            ctx.fill();
            continue;
          }

          const twinkle = Math.sin(time * p.twinkleSpeed + p.twinklePhase) * 0.3 + 0.7;
          alpha = Math.max(0, Math.min(1, p.baseAlpha * twinkle));

          // Soft luminous aura around starburst cluster nodes
          if (p.isStarburst && alpha > 0.4) {
            ctx.globalAlpha = alpha * 0.45;
            ctx.fillStyle = 'rgba(215, 235, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(px, py, p.size * 2.5, 0, Math.PI * 2);
            ctx.fill();
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

        // 4-point diffraction cross spikes on prominent stars & starburst clusters
        if (p.isProminent && alpha > 0.55) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.75})`;
          ctx.lineWidth = 0.8;
          const crossSize = p.isStarburst ? p.size * 3.8 : p.size * 3.4;

          ctx.beginPath();
          ctx.moveTo(px - crossSize, py);
          ctx.lineTo(px + crossSize, py);
          ctx.moveTo(px, py - crossSize);
          ctx.lineTo(px, py + crossSize);
          ctx.stroke();
        }
      }

      // ------------------------------------------
      // 6. Active Multi-Comet System (Frequent & Luminous)
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
      {/* 100% Live Procedural Canvas Deep Space (Galaxies + Comets) */}
      <canvas ref={canvasRef} className="live-galaxy-canvas" />

      {/* Atmospheric Cosmic Backdrop Vignettes */}
      <div className="nebula-cloud nebula-cloud--top" />
      <div className="nebula-cloud nebula-cloud--mid-left" />
      <div className="nebula-cloud nebula-cloud--bottom-right" />
    </div>
  );
}
