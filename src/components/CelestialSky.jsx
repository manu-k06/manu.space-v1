import React, { useEffect, useRef } from 'react';

// Original procedural spiral galaxies, starbursts, nebulae and comets.
// Drawing is limited to the viewport; motion respects pause and reduced motion.
export function CelestialSky({ paused = false }) {
  const canvasRef = useRef(null);
  const pausedRef = useRef(paused);
  const wakeRef = useRef(() => {});
  useEffect(() => {
    pausedRef.current = paused;
    wakeRef.current();
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const wrapper = canvas.parentElement;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let animationFrameId = 0;
    let inView = false;
    let previousTime = 0;
    let viewportHeight = window.innerHeight;
    let sceneTop = 0;
    let canvasTop = 0;
    const overscan = 180;
    let initialized = false;
    let width = 0;
    let height = 0;
    // Match the original particle appearance without a full-page backing buffer.
    const dpr = 1.0;

    // ==========================================
    // PROCEDURAL SIMULATION SETUP
    // ==========================================
    let particles = [];
    let fieldStars = [];
    let comets = [];

    // Pre-cached gradients to eliminate 360 dynamic allocations per second in 60 FPS loop
    let cachedCoreGrad1 = null;
    let cachedDiscGrad2 = null;
    let cachedDustRing2 = null;
    let cachedBarGrad2 = null;
    let cachedNucleusGrad2 = null;
    let cachedCoreGrad3 = null;

    // Layout-owned viewing areas keep the animated subjects out of card/text bounds.
    const anchorElements = ['galaxy1', 'galaxy2', 'galaxy3'].map((name) =>
      wrapper.parentElement.querySelector(`[data-galaxy="${name}"]`)
    );
    let galaxyLayout = [
      { x: 0, y: 0, radius: 1 },
      { x: 0, y: 0, radius: 1 },
      { x: 0, y: 0, radius: 1 },
    ];
    const journeyElement = wrapper.parentElement.querySelector('#journey');
    let journeyBounds = { top: 0, height: 0 };
    const measureGalaxies = () => {
      const origin = wrapper.getBoundingClientRect();
      if (journeyElement) {
        const rect = journeyElement.getBoundingClientRect();
        journeyBounds = { top: rect.top - origin.top, height: rect.height };
      }
      galaxyLayout = anchorElements.map((element) => {
        if (!element) return { x: 0, y: 0, radius: 1 };
        const rect = element.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - origin.left,
          y: rect.top + rect.height / 2 - origin.top,
          radius: Math.max(1, Math.min(rect.width * 0.43, rect.height * 0.57)),
        };
      });
    };

    // Galaxy 1: Primary Grand Spiral Galaxy (Upper Right)
    const g1 = {
      getCenter: () => galaxyLayout[0],
      arms: 3,
      armSpread: 0.44,
      tiltRatio: 0.58,
      tiltAngle: -0.42,
      maxRadius: 360,
      baseSpeed: 0.00065,
    };

    // Galaxy 2: Companion 3-Arm Pinwheel Spiral Galaxy (Mid-Right Pass)
    // Distinct from Galaxy 1: 3 sweeping arms, clockwise counter-rotation, complementary 3D tilt
    const g2 = {
      getCenter: () => galaxyLayout[1],
      arms: 3,
      armSpread: 0.48,
      tiltRatio: 0.5,
      tiltAngle: 0.38,
      maxRadius: 275,
      baseSpeed: -0.00055,
    };

    // Galaxy 3: Globular Satellite Cluster (Lower Left)
    const g3 = {
      getCenter: () => galaxyLayout[2],
      maxRadius: 210,
      baseSpeed: -0.00045,
    };

    const updateGalaxySizes = () => {
      const previousRadii = {
        galaxy1: g1.maxRadius,
        galaxy2: g2.maxRadius,
        galaxy3: g3.maxRadius,
      };
      // Calculate responsive dimensions
      g1.maxRadius = galaxyLayout[0].radius;
      g2.maxRadius = galaxyLayout[1].radius;
      g3.maxRadius = galaxyLayout[2].radius;

      // Pre-compile radial gradients once during resize/init
      const coreR1 = g1.maxRadius * 0.65;
      cachedCoreGrad1 = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR1);
      cachedCoreGrad1.addColorStop(0, 'rgba(255, 255, 255, 0.48)');
      cachedCoreGrad1.addColorStop(0.15, 'rgba(235, 240, 250, 0.24)');
      cachedCoreGrad1.addColorStop(0.4, 'rgba(190, 200, 220, 0.08)');
      cachedCoreGrad1.addColorStop(0.75, 'rgba(140, 150, 170, 0.02)');
      cachedCoreGrad1.addColorStop(1, 'rgba(0, 0, 0, 0)');

      const coreR2 = g2.maxRadius * 0.62;
      cachedDiscGrad2 = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR2);
      cachedDiscGrad2.addColorStop(0, 'rgba(255, 255, 255, 0.42)');
      cachedDiscGrad2.addColorStop(0.18, 'rgba(230, 240, 255, 0.20)');
      cachedDiscGrad2.addColorStop(0.48, 'rgba(185, 200, 225, 0.065)');
      cachedDiscGrad2.addColorStop(0.82, 'rgba(140, 150, 175, 0.015)');
      cachedDiscGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');

      cachedDustRing2 = ctx.createRadialGradient(
        0,
        0,
        coreR2 * 0.26,
        0,
        0,
        coreR2 * 0.42
      );
      cachedDustRing2.addColorStop(0, 'rgba(0, 0, 0, 0)');
      cachedDustRing2.addColorStop(0.5, 'rgba(10, 14, 22, 0.24)');
      cachedDustRing2.addColorStop(1, 'rgba(0, 0, 0, 0)');

      cachedBarGrad2 = ctx.createRadialGradient(0, 0, 0, 0, 0, 36);
      cachedBarGrad2.addColorStop(0, 'rgba(255, 255, 255, 0.70)');
      cachedBarGrad2.addColorStop(0.35, 'rgba(235, 242, 255, 0.35)');
      cachedBarGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');

      cachedNucleusGrad2 = ctx.createRadialGradient(0, 0, 0, 0, 0, 16);
      cachedNucleusGrad2.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      cachedNucleusGrad2.addColorStop(0.4, 'rgba(240, 246, 255, 0.50)');
      cachedNucleusGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');

      const coreR3 = g3.maxRadius * 0.55;
      cachedCoreGrad3 = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR3);
      cachedCoreGrad3.addColorStop(0, 'rgba(240, 245, 255, 0.28)');
      cachedCoreGrad3.addColorStop(0.25, 'rgba(190, 200, 220, 0.09)');
      cachedCoreGrad3.addColorStop(0.7, 'rgba(140, 150, 170, 0.02)');
      cachedCoreGrad3.addColorStop(1, 'rgba(0, 0, 0, 0)');

      // Keep every particle's identity and angular position through layout changes.
      const radii = {
        galaxy1: g1.maxRadius,
        galaxy2: g2.maxRadius,
        galaxy3: g3.maxRadius,
      };
      particles.forEach((particle) => {
        particle.r *= radii[particle.type] / previousRadii[particle.type];
      });
    };

    const initSimulation = (w) => {
      // ------------------------------------------
      // 1. Generate Galaxy 1 Spiral Particles (Three-arm grand design)
      // ------------------------------------------
      const numG1 = w > 900 ? 810 : 480;
      for (let i = 0; i < numG1; i++) {
        const isCore = Math.random() < 0.26;
        let r, theta;

        if (isCore) {
          r = Math.pow(Math.random(), 2.0) * (g1.maxRadius * 0.24);
          theta = Math.random() * Math.PI * 2;
        } else {
          const armIndex = i % g1.arms;
          const armOffset = (armIndex * (2 * Math.PI)) / g1.arms;
          // Define the arms in proportions of the disc, not fixed pixel radii.
          r = (0.12 + Math.pow(Math.random(), 0.92) * 0.84) * g1.maxRadius;
          const spiralAngle = Math.log(r / (g1.maxRadius * 0.12)) * 1.85;
          const scatter =
            (Math.random() - 0.5) * g1.armSpread * (r / g1.maxRadius + 0.18);
          theta = armOffset + spiralAngle + scatter;
        }

        particles.push({
          type: 'galaxy1',
          r,
          theta,
          speed: g1.baseSpeed,
          size:
            Math.random() < 0.08
              ? 2.0 + Math.random() * 0.9
              : 0.75 + Math.random() * 0.85,
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
            theta =
              armOffset + spiralAngle - 0.16 + (Math.random() - 0.5) * 0.12;
          } else if (i % 14 === 1) {
            // Prominent starburst cluster nodes along arm ridges
            isStarburst = true;
            const fraction = 0.3 + ((i % 5) / 5) * 0.6;
            r = g2.maxRadius * fraction + (Math.random() - 0.5) * 8;
            const spiralAngle = Math.log(r / 12) * 2.15;
            theta = armOffset + spiralAngle + (Math.random() - 0.5) * 0.08;
          } else {
            r = Math.pow(Math.random(), 0.9) * g2.maxRadius + 12;
            const spiralAngle = Math.log(r / 12) * 2.15;
            const scatter =
              (Math.random() - 0.5) * g2.armSpread * (r / g2.maxRadius + 0.2);
            theta = armOffset + spiralAngle + scatter;
          }
        }

        particles.push({
          type: 'galaxy2',
          r,
          theta,
          speed: g2.baseSpeed,
          size: isDust
            ? Math.random() * 2.2 + 3.4
            : isStarburst
              ? Math.random() * 1.0 + 2.5
              : Math.random() < 0.09
                ? 1.9 + Math.random() * 0.9
                : 0.7 + Math.random() * 0.85,
          baseAlpha: isDust
            ? Math.random() * 0.1 + 0.08
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
          speed: (0.1 / (Math.sqrt(r) + 5)) * g3.baseSpeed * 240,
          size: 0.7 + Math.random() * 0.9,
          baseAlpha: Math.random() * 0.5 + 0.2,
          twinkleSpeed: 0.012 + Math.random() * 0.02,
          twinklePhase: Math.random() * Math.PI * 2,
          isProminent: false,
          isSilver: true,
        });
      }

      // ------------------------------------------
      // 4. Ambient stars with an additional field anchored to Journey
      // ------------------------------------------
      const numField = w > 900 ? 480 : 240;
      const journeyCount = w > 900 ? 200 : 120;
      for (let i = 0; i < numField + journeyCount; i++) {
        fieldStars.push({
          journey: i >= numField,
          x: Math.random(),
          y: Math.random(),
          size: Math.random() < 0.12 ? 2.0 : Math.random() < 0.4 ? 1.3 : 0.8,
          alpha: Math.random() * 0.4 + 0.4,
          twinkleSpeed: 0.008 + Math.random() * 0.012,
          twinklePhase: Math.random() * Math.PI * 2,
          isSilver: Math.random() < 0.4,
        });
      }
    };

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;

      viewportHeight = window.innerHeight;
      const bufferWidth = Math.round(width * dpr);
      const bufferHeight = Math.round((viewportHeight + overscan * 2) * dpr);
      // Assigning either canvas dimension clears its contents and drawing state.
      if (canvas.width !== bufferWidth) canvas.width = bufferWidth;
      if (canvas.height !== bufferHeight) canvas.height = bufferHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${viewportHeight + overscan * 2}px`;

      measureGalaxies();
      const sizeChanged = [g1, g2, g3].some(
        (galaxy, index) => galaxy.maxRadius !== galaxyLayout[index].radius
      );
      if (!initialized || sizeChanged) updateGalaxySizes();
      if (!initialized) {
        initSimulation(width);
        initialized = true;
      }
      updateViewport();
      wake();
    };

    // ==========================================
    // VIEWPORT CULLING SYSTEM (Eliminates off-screen rendering)
    // ==========================================
    let viewTop = 0;
    let viewBottom = 1200;

    const updateViewport = () => {
      if (!canvas) return;
      sceneTop = wrapper.getBoundingClientRect().top;
      canvasTop = Math.max(0, Math.floor(-sceneTop) - overscan);
      viewTop = canvasTop;
      viewBottom = canvasTop + viewportHeight + overscan * 2;
    };

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
      const speed = isGrandComet
        ? Math.random() * 4 + 5
        : Math.random() * 7 + 8;
      const angle = Math.random() * 0.25 + 0.52;

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

    const render = (delta = 0) => {
      time += delta;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // The tile belongs to the document, so browser/compositor scrolling moves
      // it with the cards even before a new JS animation frame is available.
      canvas.style.transform = `translateY(${canvasTop}px)`;
      ctx.clearRect(0, 0, width, viewportHeight + overscan * 2);
      ctx.save();
      ctx.translate(0, -canvasTop);
      ctx.beginPath();
      ctx.rect(0, 0, width, height);
      ctx.clip();

      const c1 = g1.getCenter(width, height);
      const c2 = g2.getCenter(width, height);
      const c3 = g3.getCenter(width, height);

      // ------------------------------------------
      // 1. Draw Galaxy 1 Galactic Core Glow (Culled if off-screen)
      // ------------------------------------------
      const coreR1 = g1.maxRadius * 0.65;
      if (
        c1.y + coreR1 >= viewTop &&
        c1.y - coreR1 <= viewBottom &&
        cachedCoreGrad1
      ) {
        ctx.save();
        ctx.translate(c1.x, c1.y);
        ctx.rotate(g1.tiltAngle);
        ctx.scale(1, g1.tiltRatio);
        ctx.fillStyle = cachedCoreGrad1;
        ctx.beginPath();
        ctx.arc(0, 0, coreR1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ------------------------------------------
      // 2. Draw Galaxy 2 Companion Spiral Core & Disc Glow (Culled if off-screen)
      // ------------------------------------------
      const coreR2 = g2.maxRadius * 0.62;
      if (
        c2.y + coreR2 >= viewTop &&
        c2.y - coreR2 <= viewBottom &&
        cachedDiscGrad2
      ) {
        ctx.save();
        ctx.translate(c2.x, c2.y);
        ctx.rotate(g2.tiltAngle);
        ctx.scale(1.0, g2.tiltRatio);

        // Diffuse elliptical galactic disk glow
        ctx.fillStyle = cachedDiscGrad2;
        ctx.beginPath();
        ctx.arc(0, 0, coreR2, 0, Math.PI * 2);
        ctx.fill();

        // Interstellar dust absorption ring inside core disk
        ctx.fillStyle = cachedDustRing2;
        ctx.beginPath();
        ctx.arc(0, 0, coreR2 * 0.42, 0, Math.PI * 2);
        ctx.fill();

        // Inner galactic bar / oval condensation
        ctx.fillStyle = cachedBarGrad2;
        ctx.beginPath();
        ctx.save();
        ctx.scale(1.35, 0.72);
        ctx.arc(0, 0, 36, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Brilliant central galactic nucleus
        ctx.fillStyle = cachedNucleusGrad2;
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ------------------------------------------
      // 3. Draw Galaxy 3 Globular Core Glow (Culled if off-screen)
      // ------------------------------------------
      const coreR3 = g3.maxRadius * 0.55;
      if (
        c3.y + coreR3 >= viewTop &&
        c3.y - coreR3 <= viewBottom &&
        cachedCoreGrad3
      ) {
        ctx.save();
        ctx.translate(c3.x, c3.y);
        ctx.fillStyle = cachedCoreGrad3;
        ctx.beginPath();
        ctx.arc(0, 0, coreR3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ------------------------------------------
      // 4. Render Background Field Stars (Culled)
      // ------------------------------------------
      for (let i = 0; i < fieldStars.length; i++) {
        const s = fieldStars[i];
        const sy = s.journey
          ? journeyBounds.top + s.y * journeyBounds.height
          : s.y * height;
        if (sy < viewTop || sy > viewBottom) continue;

        const twinkle =
          Math.sin(time * s.twinkleSpeed + s.twinklePhase) * 0.22 + 0.78;
        const alpha = Math.max(0, Math.min(1, s.alpha * twinkle));

        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.isSilver ? '#d8e0ec' : '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x * width, sy, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // ------------------------------------------
      // 5. Render Live Orbiting Particles (with Viewport Culling)
      // ------------------------------------------
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.theta += p.speed * delta;

        let px, py;
        if (p.type === 'galaxy1') {
          const xp = p.r * Math.cos(p.theta);
          const yp = p.r * Math.sin(p.theta) * g1.tiltRatio;
          px = c1.x + (xp * cosPhi1 - yp * sinPhi1);
          py = c1.y + (xp * sinPhi1 + yp * cosPhi1);
        } else if (p.type === 'galaxy2') {
          const xp = p.r * Math.cos(p.theta);
          const yp = p.r * Math.sin(p.theta) * g2.tiltRatio;
          px = c2.x + (xp * cosPhi2 - yp * sinPhi2);
          py = c2.y + (xp * sinPhi2 + yp * cosPhi2);
        } else if (p.type === 'galaxy3') {
          px = c3.x + p.r * Math.cos(p.theta);
          py = c3.y + p.r * Math.sin(p.theta) * 0.85;
        }

        // VIEWPORT CULLING: Skip drawing off-screen particles
        if (py < viewTop || py > viewBottom || px < -40 || px > width + 40) {
          continue;
        }

        let alpha = p.baseAlpha;

        if (p.type === 'galaxy1' || p.type === 'galaxy3') {
          const twinkle =
            Math.sin(time * p.twinkleSpeed + p.twinklePhase) * 0.3 + 0.7;
          alpha = Math.max(0, Math.min(1, p.baseAlpha * twinkle));
        } else if (p.type === 'galaxy2') {
          // Handle dark interstellar dust clouds
          if (p.isDust) {
            const dustTwinkle =
              Math.sin(time * p.twinkleSpeed + p.twinklePhase) * 0.2 + 0.8;
            ctx.globalAlpha = Math.max(
              0,
              Math.min(1, p.baseAlpha * dustTwinkle)
            );
            ctx.fillStyle = 'rgba(150, 165, 195, 0.40)';
            ctx.beginPath();
            ctx.arc(px, py, p.size, 0, Math.PI * 2);
            ctx.fill();
            continue;
          }

          const twinkle =
            Math.sin(time * p.twinkleSpeed + p.twinklePhase) * 0.3 + 0.7;
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

          const twinkle =
            Math.sin(time * p.twinkleSpeed + p.twinklePhase) * 0.3 + 0.7;
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
      if (
        delta > 0 &&
        comets.length < 4 &&
        Math.random() < 1 - Math.pow(1 - 0.024, delta)
      ) {
        spawnComet();
      }

      for (let i = comets.length - 1; i >= 0; i--) {
        const m = comets[i];
        m.x += m.dx * delta;
        m.y += m.dy * delta;
        m.life -= m.decay * delta;

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
      ctx.restore();
    };

    const canAnimate = () =>
      inView && !document.hidden && !pausedRef.current && !reduced.matches;
    const animate = (now) => {
      animationFrameId = 0;
      if (!canAnimate()) return;
      const delta = Math.min((now - previousTime) / 1000, 0.05) * 60;
      previousTime = now;
      render(delta);
      animationFrameId = requestAnimationFrame(animate);
    };
    const wake = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
      wrapper.style.setProperty(
        '--sky-play-state',
        canAnimate() ? 'running' : 'paused'
      );
      updateViewport();
      render();
      if (canAnimate()) {
        previousTime = performance.now();
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    wakeRef.current = wake;
    const onScroll = () => {
      updateViewport();
      if (!canAnimate()) render();
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(wrapper);
    anchorElements.forEach((element) => {
      if (element) resizeObserver.observe(element);
    });
    wrapper.parentElement
      .querySelectorAll('section')
      .forEach((element) => resizeObserver.observe(element));
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      wake();
    });
    observer.observe(wrapper);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', wake);
    reduced.addEventListener('change', wake);
    handleResize();

    return () => {
      resizeObserver.disconnect();
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', wake);
      reduced.removeEventListener('change', wake);
      cancelAnimationFrame(animationFrameId);
      wakeRef.current = () => {};
    };
  }, []);

  return (
    <div className="celestial-canvas-wrap" aria-hidden="true">
      {/* Live procedural galaxies and comets; no image assets. */}
      <canvas ref={canvasRef} className="live-galaxy-canvas" />

      {/* Atmospheric Cosmic Backdrop Vignettes */}
      <div className="nebula-cloud nebula-cloud--top" />
      <div className="nebula-cloud nebula-cloud--mid-left" />
      <div className="nebula-cloud nebula-cloud--bottom-right" />
    </div>
  );
}
