import React, { useRef, useEffect, useState } from 'react';

// Measure the actual cards: fonts, text length and resizing share one coordinate system.
export function MountainRoad({ containerRef, activeStep, paused }) {
  const [geometry, setGeometry] = useState(null);
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const progressRef = useRef(null);
  const beaconRef = useRef(null);
  const activeRef = useRef(activeStep);
  const pausedRef = useRef(paused);
  const wakeRef = useRef(() => {});
  useEffect(() => {
    activeRef.current = activeStep;
    pausedRef.current = paused;
    wakeRef.current();
  }, [activeStep, paused]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => {
      const width = container.clientWidth;
      const rows = [...container.querySelectorAll('.milestone-row')];
      const points = rows.map((row, index) => ({
        step: row.dataset.step,
        x: width * (index % 2 === 0 ? 0.46 : 0.54),
        y: row.offsetTop + 42,
        bottom: row.offsetTop + row.offsetHeight,
        top: row.offsetTop,
      }));
      if (!points.length) return;
      let d = `M ${width * 0.52} 0 Q ${width * 0.52} ${points[0].y} ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const previous = points[i - 1];
        const point = points[i];
        const middle = (previous.bottom + point.top) / 2;
        const bend = width * (i % 2 === 1 ? 0.79 : 0.21);
        d += ` C ${previous.x} ${previous.y + 80}, ${bend} ${middle - 40}, ${width / 2} ${middle}`;
        d += ` C ${width - bend} ${middle + 40}, ${point.x} ${point.y - 25}, ${point.x} ${point.y}`;
      }
      const last = points[points.length - 1];
      d += ` Q ${width / 2} ${last.y + 50} ${width / 2} ${last.y + 95}`;
      setGeometry({ width, height: container.clientHeight, points, d });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    container
      .querySelectorAll('.milestone-row')
      .forEach((row) => observer.observe(row));
    measure();
    return () => observer.disconnect();
  }, [containerRef]);

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!geometry || !path) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = matchMedia('(min-width: 1001px)');
    const length = path.getTotalLength();
    const samples = Array.from({ length: 501 }, (_, index) =>
      path.getPointAtLength((length * index) / 500)
    );
    const checkpoints = Object.fromEntries(
      geometry.points.map((point) => {
        let nearest = 0;
        samples.forEach((sample, index) => {
          if (
            Math.hypot(sample.x - point.x, sample.y - point.y) <
            Math.hypot(
              samples[nearest].x - point.x,
              samples[nearest].y - point.y
            )
          )
            nearest = index;
        });
        return [point.step, nearest / 500];
      })
    );
    progressRef.current.style.strokeDasharray = `${length} ${length}`;
    let frame = 0,
      previousTime = 0,
      current = 0,
      target = 0;
    let visible = true;
    const paint = () => {
      const point = path.getPointAtLength(current * length);
      beaconRef.current.setAttribute(
        'transform',
        `translate(${point.x}, ${point.y})`
      );
      progressRef.current.style.strokeDashoffset = length * (1 - current);
    };
    const animate = (now) => {
      frame = 0;
      const elapsed = Math.min((now - previousTime) / 1000 || 1 / 60, 0.05);
      previousTime = now;
      // Ease toward the reading position gently (about two seconds to cover 95%).
      current += (target - current) * (1 - Math.exp(-1.5 * elapsed));
      if (Math.abs(target - current) < 0.0001) current = target;
      paint();
      if (current !== target) frame = requestAnimationFrame(animate);
    };
    const update = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!desktop.matches || !visible || document.hidden || pausedRef.current)
        return;
      const readingY =
        window.innerHeight * 0.42 - svg.getBoundingClientRect().top;
      let nearest = 0;
      samples.forEach((point, index) => {
        if (
          Math.abs(point.y - readingY) < Math.abs(samples[nearest].y - readingY)
        )
          nearest = index;
      });
      target = checkpoints[activeRef.current] ?? nearest / 500;
      if (reduced.matches) {
        current = target;
        paint();
        return;
      }
      previousTime = performance.now();
      frame = requestAnimationFrame(animate);
    };
    wakeRef.current = update;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(svg);
    window.addEventListener('scroll', update, { passive: true });
    document.addEventListener('visibilitychange', update);
    reduced.addEventListener('change', update);
    desktop.addEventListener('change', update);
    paint();
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', update);
      document.removeEventListener('visibilitychange', update);
      reduced.removeEventListener('change', update);
      desktop.removeEventListener('change', update);
      wakeRef.current = () => {};
    };
  }, [geometry]);

  if (!geometry) return null;
  return (
    <svg
      ref={svgRef}
      className="switchback-svg-canvas"
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      aria-hidden="true"
    >
      <path d={geometry.d} className="road-curb" />
      <path d={geometry.d} className="road-asphalt" />
      <path ref={pathRef} d={geometry.d} className="road-centerline" />
      <path ref={progressRef} d={geometry.d} className="road-traveled-light" />
      {geometry.points.map((point) => (
        <g
          key={point.step}
          className={`waypoint-group ${activeStep === point.step ? 'waypoint-group--active' : ''}`}
        >
          <circle
            cx={point.x}
            cy={point.y}
            r="17"
            className="waypoint-node-disk"
          />
          <text x={point.x} y={point.y} className="waypoint-node-number">
            {point.step}
          </text>
        </g>
      ))}
      <g ref={beaconRef} className="traveler-beacon">
        <circle r="11" fill="#c4b5a4" opacity="0.1" />
        <circle r="5" fill="#e2d8ca" opacity="0.3" />
        <circle r="2.5" fill="#fff5e5" />
      </g>
    </svg>
  );
}
