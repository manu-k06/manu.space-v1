import React, { useRef, useState, useEffect } from 'react';

/**
 * MountainRoad Component
 * 
 * Renders an authentic mountain switchback pass with realistic curves,
 * stone curbs, asphalt roadbed, animated centerline dashes, and a
 * starlight traveler beacon that glides along the switchback on scroll.
 */
export function MountainRoad({ activeStep, setActiveStep }) {
  const pathRef = useRef(null);
  const [beaconPos, setBeaconPos] = useState({ x: 500, y: 40 });
  const [pathLength, setPathLength] = useState(0);

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
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);

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
      viewBox="0 0 1000 2400"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        {/* Soft mountain starlight glow */}
        <filter id="starlightGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <radialGradient id="beaconGlowGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#c4b5a4" stopOpacity="0.6" />
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

      {/* Layer 4: Switchback Hairpin Waypoints */}
      {waypoints.map((wp) => {
        const isActive = activeStep === wp.step;
        return (
          <g
            key={wp.step}
            className="waypoint-group"
            onClick={() => setActiveStep && setActiveStep(wp.step)}
            style={{ cursor: 'pointer' }}
          >
            {/* Pulsing halo */}
            <circle
              cx={wp.x}
              cy={wp.y}
              r={isActive ? 28 : 22}
              className="waypoint-node-ring"
            />
            {/* Core disk */}
            <circle
              cx={wp.x}
              cy={wp.y}
              r="14"
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

      {/* Layer 5: Traveling Starlight Beacon (Tracks Scroll along road) */}
      <g transform={`translate(${beaconPos.x}, ${beaconPos.y})`}>
        <circle
          cx="0"
          cy="0"
          r="26"
          fill="url(#beaconGlowGradient)"
        />
        <circle
          cx="0"
          cy="0"
          r="5"
          className="traveler-beacon-core"
        />
      </g>
    </svg>
  );
}
