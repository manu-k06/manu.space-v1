import React, { useRef, useState, useEffect } from 'react';

/**
 * MountainRoad Component
 * 
 * Renders an authentic winding mountain road down the center corridor,
 * weaving smoothly between alternating milestone cards without overlapping.
 */
export function MountainRoad({ activeStep, setActiveStep }) {
  const pathRef = useRef(null);
  const [beaconPos, setBeaconPos] = useState({ x: 500, y: 30 });

  // Central corridor waypoints anchored to each card
  const waypoints = [
    { step: '01', x: 450, y: 240, cardX: 410, cardY: 240 },
    { step: '02', x: 550, y: 640, cardX: 590, cardY: 640 },
    { step: '03', x: 450, y: 1040, cardX: 410, cardY: 1040 },
    { step: '04', x: 550, y: 1440, cardX: 590, cardY: 1440 },
    { step: '05', x: 500, y: 1740, cardX: 500, cardY: 1800 },
  ];

  // Center-corridor serpentine path with genuine switchback curvature
  const roadD = `
    M 500,20
    C 490,90 450,150 450,240
    C 450,380 550,490 550,640
    C 550,780 450,890 450,1040
    C 450,1180 550,1290 550,1440
    C 550,1580 500,1660 500,1740
  `;

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();

      const handleScroll = () => {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(Math.max(scrollY / (maxScroll || 1), 0), 1);
        
        // Calculate point along the mountain pass
        const point = pathRef.current.getPointAtLength(progress * len);
        setBeaconPos({ x: point.x, y: point.y });
      };

      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <svg
      className="switchback-svg-canvas"
      viewBox="0 0 1000 1850"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="beaconGlowGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#c4b5a4" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#c4b5a4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Layer 1: Road Curb / Outer Shoulder */}
      <path d={roadD} className="road-curb" />

      {/* Layer 2: Main Asphalt Road Bed */}
      <path d={roadD} className="road-asphalt" />

      {/* Layer 3: Painted Center Dashed Line */}
      <path
        ref={pathRef}
        d={roadD}
        className="road-centerline"
      />

      {/* Layer 4: Card Connector Lines */}
      {waypoints.map((wp) => (
        <line
          key={`line-${wp.step}`}
          x1={wp.x}
          y1={wp.y}
          x2={wp.cardX}
          y2={wp.cardY}
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          opacity={activeStep === wp.step ? 0.9 : 0.4}
          transition="opacity 0.2s ease"
        />
      ))}

      {/* Layer 5: Waypoint Pins */}
      {waypoints.map((wp) => {
        const isActive = activeStep === wp.step;
        return (
          <g
            key={wp.step}
            className="waypoint-group"
            onClick={() => setActiveStep && setActiveStep(wp.step)}
            style={{ cursor: 'pointer' }}
          >
            {/* Ambient Pulse Ring */}
            <circle
              cx={wp.x}
              cy={wp.y}
              r={isActive ? 22 : 16}
              className="waypoint-node-ring"
            />
            {/* Core Disk */}
            <circle
              cx={wp.x}
              cy={wp.y}
              r="12"
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

      {/* Layer 6: Traveling Starlight Beacon */}
      <g transform={`translate(${beaconPos.x}, ${beaconPos.y})`}>
        <circle
          cx="0"
          cy="0"
          r="22"
          fill="url(#beaconGlowGradient)"
        />
        <circle
          cx="0"
          cy="0"
          r="4.5"
          className="traveler-beacon-core"
        />
      </g>
    </svg>
  );
}
