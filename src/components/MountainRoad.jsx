import React, { useRef, useEffect } from 'react';

/**
 * MountainRoad Component
 * 
 * Renders an authentic mountain switchback pass with realistic curves,
 * stone curbs, asphalt roadbed, animated centerline dashes, a luminous
 * traveled road illumination trail, and an interactive 60/120 FPS
 * RAF-interpolated starlight beacon.
 * 
 * Interactive behavior:
 * - On scroll: beacon smoothly glides down the mountain pass.
 * - On hover (checkpoint node or milestone card): beacon smoothly glides
 *   directly to the hovered checkpoint along the road curve.
 * - On mouse leave: beacon smoothly glides back to scroll position.
 */
export function MountainRoad({ activeStep, setActiveStep }) {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const progressPathRef = useRef(null);
  const beaconRef = useRef(null);

  // Keep a ref to activeStep so RAF loop reads it without re-mounting
  const activeStepRef = useRef(activeStep);
  useEffect(() => {
    activeStepRef.current = activeStep;
  }, [activeStep]);

  // Switchback Hairpin Waypoints along the mountain pass
  const waypoints = [
    { step: '01', x: 220, y: 440, label: 'Base Camp' },
    { step: '02', x: 780, y: 960, label: 'Launchpad' },
    { step: '03', x: 220, y: 1500, label: 'First Orbit' },
    { step: '04', x: 760, y: 1980, label: 'Alpine Ridge' },
    { step: '05', x: 500, y: 2320, label: 'Summit Peak' },
  ];

  // Mountain Switchback Path definition with authentic hairpin loops
  const roadD = `
    M 500,40
    C 520,130 680,190 670,300
    C 650,410 320,330 220,440
    C 130,540 210,680 460,750
    C 710,810 860,830 780,960
    C 710,1080 470,1130 320,1250
    C 170,1350 130,1430 220,1500
    C 300,1580 620,1650 760,1780
    C 850,1880 840,1950 760,1980
    C 640,2050 510,2120 500,2320
  `;

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    const beacon = beaconRef.current;
    const progressPath = progressPathRef.current;
    if (!path || !beacon || !svg) return;

    const len = path.getTotalLength();
    if (progressPath) {
      progressPath.style.strokeDasharray = `${len} ${len}`;
      progressPath.style.strokeDashoffset = `${len}`;
    }

    // Pre-calculate exact progress fraction along path for each waypoint
    const waypointProgressMap = {};
    const samples = 400;
    for (const wp of waypoints) {
      let bestDist = Infinity;
      let bestT = 0;
      for (let s = 0; s <= samples; s++) {
        const t = s / samples;
        const pt = path.getPointAtLength(t * len);
        const d = Math.hypot(pt.x - wp.x, pt.y - wp.y);
        if (d < bestDist) {
          bestDist = d;
          bestT = t;
        }
      }
      waypointProgressMap[wp.step] = bestT;
    }

    let currentProgress = 0;
    let scrollProgress = 0;
    let animationFrameId;

    const handleScroll = () => {
      const rect = svg.getBoundingClientRect();
      const vh = window.innerHeight;
      // Start tracking smoothly as the road enters the viewport
      const totalDistance = rect.height - vh * 0.35;
      const scrolled = vh * 0.40 - rect.top;
      scrollProgress = Math.min(Math.max(scrolled / (totalDistance || 1), 0), 1);
    };

    // Continuous 60-120 FPS RAF lerp loop: converts discrete scroll notches & hover jumps into buttery smooth motion
    const animate = () => {
      // If hovering over a milestone or waypoint, prioritize gliding to that checkpoint
      let targetProgress;
      const hoveredStep = activeStepRef.current;
      if (hoveredStep && waypointProgressMap[hoveredStep] !== undefined) {
        targetProgress = waypointProgressMap[hoveredStep];
      } else {
        targetProgress = scrollProgress;
      }

      const lerpSpeed = hoveredStep ? 0.095 : 0.085;
      currentProgress += (targetProgress - currentProgress) * lerpSpeed;

      const point = path.getPointAtLength(currentProgress * len);
      beacon.setAttribute('transform', `translate(${point.x.toFixed(2)}, ${point.y.toFixed(2)})`);

      if (progressPath) {
        progressPath.style.strokeDashoffset = `${(len * (1 - currentProgress)).toFixed(1)}`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    handleScroll();
    animate();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="switchback-svg-canvas"
      viewBox="0 0 1000 2400"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="beaconGlowGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#c4b5a4" stopOpacity="0.65" />
          <stop offset="70%" stopColor="#c4b5a4" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#c4b5a4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Layer 1: Outer Stone Curb / Shoulder */}
      <path d={roadD} className="road-curb" />

      {/* Layer 2: Main Asphalt Road Surface */}
      <path d={roadD} className="road-asphalt" />

      {/* Layer 3: Painted Center Dashed Line */}
      <path
        ref={pathRef}
        d={roadD}
        className="road-centerline"
      />

      {/* Layer 3b: Traveled Road Illuminated Starlight Line */}
      <path
        ref={progressPathRef}
        d={roadD}
        className="road-traveled-light"
      />

      {/* Layer 4: Switchback Hairpin Waypoints */}
      {waypoints.map((wp) => {
        const isActive = activeStep === wp.step;
        return (
          <g
            key={wp.step}
            className={`waypoint-group ${isActive ? 'waypoint-group--active' : ''}`}
            onClick={() => setActiveStep && setActiveStep(wp.step)}
            onMouseEnter={() => setActiveStep && setActiveStep(wp.step)}
            onMouseLeave={() => setActiveStep && setActiveStep(null)}
            style={{ cursor: 'pointer' }}
          >
            {/* Pulsing halo */}
            <circle
              cx={wp.x}
              cy={wp.y}
              r={isActive ? 30 : 22}
              className="waypoint-node-ring"
            />
            {/* Core disk */}
            <circle
              cx={wp.x}
              cy={wp.y}
              r={isActive ? 16 : 14}
              className="waypoint-node-disk"
              style={{
                stroke: isActive ? '#ffffff' : 'var(--accent)',
                fill: isActive ? 'var(--accent)' : '#141414',
              }}
            />
            {/* Number */}
            <text
              x={wp.x}
              y={wp.y}
              className="waypoint-node-number"
              style={{ fill: isActive ? '#0e0e0e' : '#ffffff' }}
            >
              {wp.step}
            </text>
          </g>
        );
      })}

      {/* Layer 5: Traveling Starlight Beacon (Silky 60/120 FPS RAF tracking with zero React re-renders) */}
      <g ref={beaconRef} transform="translate(500, 40)" className="traveler-beacon-glow">
        <circle
          cx="0"
          cy="0"
          r="30"
          fill="url(#beaconGlowGradient)"
        />
        <circle
          cx="0"
          cy="0"
          r="6"
          className="traveler-beacon-core"
        />
      </g>
    </svg>
  );
}
