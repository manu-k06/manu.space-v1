import React, { useMemo } from 'react';
import galaxyClusterImg from '../assets/galaxy-cluster.jpg';

/**
 * CelestialSky Component
 * 
 * Renders an authentic celestial night sky behind the mountain road:
 * - High-definition deep space galaxy cluster arm (matching reference design)
 * - Deterministically generated multi-layered twinkling micro-stars
 * - Slowly breathing cosmic nebula auroras (warm champagne & deep obsidian tones)
 * - Staggered periodic shooting star / meteor streaks
 * - 100% GPU-accelerated and non-blocking (pointer-events: none)
 */
export function CelestialSky() {
  // Generate 85 organic stars with varying sizes, twinkle durations, and delays
  const stars = useMemo(() => {
    const starList = [];
    const count = 85;

    for (let i = 0; i < count; i++) {
      // Deterministic distribution across the entire vertical journey
      const x = ((i * 37 + 13) % 98) + 1; // 1% to 99%
      const y = ((i * 59 + 7) % 98) + 1;  // 1% to 99%
      const size = (i % 6 === 0) ? 2.5 : (i % 2 === 0 ? 1.8 : 1.2);
      const duration = 2.8 + (i % 7) * 0.7; // 2.8s to 7.0s
      const delay = (i % 11) * 0.5; // 0s to 5.5s
      const isWarm = i % 3 === 0;

      starList.push({
        id: i,
        x,
        y,
        size,
        duration,
        delay,
        color: isWarm ? 'rgba(238, 226, 210, 0.92)' : 'rgba(255, 255, 255, 0.95)',
        glow: isWarm ? 'rgba(196, 181, 164, 0.7)' : 'rgba(255, 255, 255, 0.45)',
      });
    }
    return starList;
  }, []);

  return (
    <div className="celestial-canvas-wrap" aria-hidden="true">
      {/* Primary Deep Space Galaxy Cluster Arm (Top-Right as in reference image) */}
      <div className="galaxy-cluster-wrap galaxy-cluster-wrap--primary">
        <img
          src={galaxyClusterImg}
          alt=""
          className="galaxy-cluster-img"
          loading="lazy"
        />
      </div>

      {/* Secondary Soft Satellite Galaxy Cluster (Lower-Left Horizon) */}
      <div className="galaxy-cluster-wrap galaxy-cluster-wrap--secondary">
        <img
          src={galaxyClusterImg}
          alt=""
          className="galaxy-cluster-img"
          loading="lazy"
        />
      </div>

      {/* Living Nebula Aura 1 (Top Champagne Cloud) */}
      <div className="nebula-cloud nebula-cloud--top" />

      {/* Living Nebula Aura 2 (Mid-Left Warm Glow) */}
      <div className="nebula-cloud nebula-cloud--mid-left" />

      {/* Living Nebula Aura 3 (Lower-Right Cosmic Ember) */}
      <div className="nebula-cloud nebula-cloud--bottom-right" />

      {/* Twinkling Starfield */}
      <div className="starfield">
        {stars.map((star) => (
          <span
            key={star.id}
            className="celestial-star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              boxShadow: `0 0 ${star.size * 2}px ${star.glow}`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Periodic Cosmic Shooting Stars */}
      <div className="shooting-star shooting-star--1" />
      <div className="shooting-star shooting-star--2" />
    </div>
  );
}
