import React, { useEffect, useRef, useState } from 'react';
import '../styles/station.css';

export function SpaceStation({ paused }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting)
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <figure
      ref={ref}
      className="station-scene"
      style={{
        '--station-play-state': paused || !visible ? 'paused' : 'running',
      }}
    >
      <svg
        className="station-drift"
        viewBox="0 0 600 380"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="iss-metal" x2="0.3" y2="1">
            <stop stopColor="#e3e5e6" />
            <stop offset=".45" stopColor="#858d96" />
            <stop offset="1" stopColor="#323b48" />
          </linearGradient>
          <linearGradient id="iss-solar" x2="1" y2="1">
            <stop stopColor="#b19864" />
            <stop offset=".45" stopColor="#5d533e" />
            <stop offset="1" stopColor="#292c35" />
          </linearGradient>
          <pattern
            id="iss-cells"
            width="9"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M9 0H0V12"
              fill="none"
              stroke="#d8bf87"
              strokeOpacity=".4"
              strokeWidth=".65"
            />
          </pattern>
        </defs>
        <g transform="translate(300 190) rotate(-23) skewX(12) translate(-300 -190)">
          <path d="M63 185H537V196H63Z" fill="#67717b" stroke="#a9aeb3" />
          <path
            d="M65 196L89 185L113 196L137 185L161 196L185 185L209 196L233 185L257 196M343 196L367 185L391 196L415 185L439 196L463 185L487 196L511 185L535 196"
            fill="none"
            stroke="#c3c8cb"
            strokeWidth="1.5"
          />
          {[88, 153, 447, 512].map((x) => (
            <g key={x}>
              <path d={`M${x} 71V308`} stroke="#9b9a90" strokeWidth="3" />
              {[75, 213].map((y) => (
                <g key={y}>
                  <rect
                    x={x - 25}
                    y={y}
                    width="50"
                    height="91"
                    rx="1"
                    fill="url(#iss-solar)"
                    stroke="#b6a57b"
                  />
                  <rect
                    x={x - 25}
                    y={y}
                    width="50"
                    height="91"
                    fill="url(#iss-cells)"
                  />
                  <path
                    className="station-glint"
                    d={`M${x - 24} ${y + 1}H${x + 24}`}
                    stroke="#f2dda9"
                    strokeWidth="2"
                  />
                </g>
              ))}
            </g>
          ))}
          {[219, 354].map((x) => (
            <path
              key={x}
              d={`M${x} 137h27v39h-27z M${x} 207h27v39h-27z`}
              fill="#b9c1c7"
              stroke="#5a6672"
            />
          ))}
          <g fill="url(#iss-metal)" stroke="#a6afb7" strokeWidth="1">
            <rect x="285" y="119" width="30" height="146" rx="10" />
            <rect x="259" y="177" width="83" height="27" rx="9" />
            <rect x="288" y="93" width="24" height="34" rx="6" />
            <rect x="279" y="220" width="42" height="29" rx="7" />
            <path d="M287 265h26l-6 24h-14z" />
          </g>
          <path
            d="M289 149h22M289 160h22M290 256h20M300 94V79"
            stroke="#dee2e5"
            strokeWidth="2"
          />
          <circle
            cx="300"
            cy="233"
            r="7"
            fill="#222f3d"
            stroke="#d0d7dd"
            strokeWidth="2"
          />
          <path
            d="M330 181l16-29 29-13 13 9"
            fill="none"
            stroke="#c6cbd0"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <circle cx="346" cy="152" r="4" fill="#e4dfd1" />
        </g>
      </svg>
      <figcaption>
        <span aria-hidden="true">✦</span> A connection in orbit{' '}
        <span className="station-caption-detail">
          International Space Station
        </span>
      </figcaption>
    </figure>
  );
}
