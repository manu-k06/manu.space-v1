import React, { useEffect, useRef } from 'react';

// Seeded randomness keeps the sky coherent across resizes and React remounts.
function randomSource(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function makeSprite(color) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const glow = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  glow.addColorStop(0, `rgba(${color},1)`);
  glow.addColorStop(0.12, `rgba(${color},0.6)`);
  glow.addColorStop(0.4, `rgba(${color},0.15)`);
  glow.addColorStop(1, `rgba(${color},0)`);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 64, 64);
  return canvas;
}

// These are generated canvas buffers, never downloaded image assets. Thousands
// of diffuse particles are cached once; independent layers evolve during rendering.
function makeDisk(seed, dust = false) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 900;
  const ctx = canvas.getContext('2d');
  const random = randomSource(seed);
  const sprite = makeSprite(dust ? '4,7,12' : '190,203,219');
  const gaussian = () =>
    Math.sqrt(-2 * Math.log(Math.max(0.0001, random()))) *
    Math.cos(random() * Math.PI * 2);
  for (let i = 0; i < (dust ? 1800 : 18000); i++) {
    const radius = Math.pow(random(), 0.8) * 390;
    const arm = random() > 0.52 ? Math.PI : 0;
    const angle =
      radius * 0.013 +
      arm +
      gaussian() * (dust ? 0.16 : 0.36) +
      Math.sin(radius * 0.024) * 0.16;
    // A diffuse disc fills the gaps rather than drawing two dotted curves.
    const theta = !dust && random() < 0.43 ? random() * Math.PI * 2 : angle;
    const x = 450 + Math.cos(theta) * radius;
    const y = 450 + Math.sin(theta) * radius;
    const falloff = Math.pow(1 - radius / 410, 1.5);
    const size = dust ? 12 + random() * 38 : 2 + random() * 15;
    ctx.globalAlpha = (dust ? 0.12 : 0.1) * falloff;
    ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size);
    if (!dust && random() < 0.055) {
      ctx.globalAlpha = 0.1 + random() * 0.23;
      ctx.fillStyle = '#dde1e8';
      ctx.fillRect(x, y, 0.55 + random() * 0.6, 0.55 + random() * 0.6);
    }
  }
  return canvas;
}

export function CelestialSky({ paused = false }) {
  const canvasRef = useRef(null);
  const pauseRef = useRef(paused);
  const wakeRef = useRef(() => {});
  useEffect(() => {
    pauseRef.current = paused;
    wakeRef.current();
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!ctx) return;
    const section = canvas.parentElement;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const random = randomSource(2026);
    const disk = makeDisk(84);
    const dust = makeDisk(84, true);
    const starSprite = makeSprite('218,225,235');
    const coreSprite = makeSprite('243,232,210');
    const stars = Array.from({ length: 220 }, () => ({
      x: random(),
      y: random(),
      size: 0.45 + Math.pow(random(), 5) * 1.5,
      alpha: 0.12 + random() * 0.4,
      phase: random() * Math.PI * 2,
      twinkle: random() < 0.16,
    }));
    let width = 0,
      height = 0,
      sectionHeight = 0,
      dpr = 1;
    let frame = 0,
      last = 0,
      time = 0,
      lastPaint = 0;
    let inView = true,
      nextMeteor = 18,
      meteor = null;

    const render = () => {
      if (!width || !height) return;
      const rect = section.getBoundingClientRect();
      const mobile = width < 700;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      // A viewport-sized canvas avoids a multi-thousand-pixel animated surface.
      for (const star of stars) {
        const y = star.y * sectionHeight + rect.top;
        if (y < -5 || y > height + 5) continue;
        const twinkle = star.twinkle
          ? 0.85 + Math.sin(time * 0.45 + star.phase) * 0.15
          : 1;
        ctx.globalAlpha = star.alpha * twinkle;
        const size = star.size * 3;
        ctx.drawImage(
          starSprite,
          star.x * width - size / 2,
          y - size / 2,
          size,
          size
        );
      }
      // One dominant, inclined galaxy; the lower page stays deliberately quiet.
      const radius = Math.min(width * (mobile ? 0.66 : 0.33), 470);
      const centerX = width * (mobile ? 0.9 : 0.81);
      const centerY = (mobile ? 290 : 270) + rect.top;
      if (centerY + radius > 0 && centerY - radius < height) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(-0.48);
        ctx.scale(1, 0.58);
        ctx.globalAlpha = mobile ? 0.48 : 0.85;
        ctx.rotate(time * 0.004);
        ctx.drawImage(disk, -radius, -radius, radius * 2, radius * 2);
        ctx.rotate(Math.sin(time * 0.025) * 0.025);
        ctx.globalAlpha = 0.8;
        ctx.drawImage(dust, -radius, -radius, radius * 2, radius * 2);
        ctx.globalAlpha = mobile ? 0.22 : 0.4;
        ctx.drawImage(
          coreSprite,
          -radius * 0.23,
          -radius * 0.23,
          radius * 0.46,
          radius * 0.46
        );
        ctx.globalAlpha = mobile ? 0.35 : 0.65;
        ctx.drawImage(coreSprite, -10, -10, 20, 20);
        ctx.restore();
      }
      // A rare, short meteor crosses an empty part of the sky (at most one).
      if (meteor) {
        const age = time - meteor.start;
        const x = meteor.x - age * 160;
        const y = meteor.y + rect.top + age * 70;
        ctx.globalAlpha = Math.sin(Math.min(1, age / 1.6) * Math.PI) * 0.45;
        const trail = ctx.createLinearGradient(x, y, x + 65, y - 28);
        trail.addColorStop(0, '#dce3ec');
        trail.addColorStop(1, 'transparent');
        ctx.strokeStyle = trail;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 65, y - 28);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      // Keep the introductory copy quiet, particularly on narrow screens.
      const shade = ctx.createLinearGradient(0, 0, width, 0);
      shade.addColorStop(0, 'rgba(14,14,14,0.8)');
      shade.addColorStop(mobile ? 0.45 : 0.38, 'rgba(14,14,14,0.28)');
      shade.addColorStop(1, 'rgba(14,14,14,0)');
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, width, height);
    };
    const canAnimate = () =>
      inView && !document.hidden && !pauseRef.current && !reduced.matches;
    const tick = (now) => {
      frame = 0;
      if (!canAnimate()) return;
      time += Math.min((now - last) / 1000, 0.1);
      last = now;
      if (time > nextMeteor) {
        meteor = {
          start: time,
          x: width * 0.8,
          y: -section.getBoundingClientRect().top + height * 0.22,
        };
        nextMeteor = time + 24 + random() * 18;
      }
      if (meteor && time - meteor.start > 1.6) meteor = null;
      // Atmospheric motion is slow: 30 painted frames/sec is ample, irrespective of refresh rate.
      if (now - lastPaint >= 1000 / 30) {
        render();
        lastPaint = now;
      }
      frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (reduced.matches) meteor = null;
      render();
      if (canAnimate()) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    wakeRef.current = wake;
    const resize = () => {
      width = document.documentElement.clientWidth;
      height = window.innerHeight;
      sectionHeight = section.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, width < 700 ? 1.5 : 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      wake();
    };
    const onScroll = () => {
      if (!canAnimate() && inView) render();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(section);
    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      wake();
    });
    intersection.observe(section);
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', wake);
    reduced.addEventListener('change', wake);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', wake);
      reduced.removeEventListener('change', wake);
      wakeRef.current = () => {};
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="live-galaxy-canvas" aria-hidden="true" />
  );
}
