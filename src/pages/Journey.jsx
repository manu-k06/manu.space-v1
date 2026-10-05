import React, { useState, useRef, useEffect } from 'react';
import { journeyMilestones } from '../data/journeyData';
import { MountainRoad } from '../components/MountainRoad';
import { MilestoneCard } from '../components/MilestoneCard';
import { CelestialSky } from '../components/CelestialSky';
import '../styles/journey.css';

// Default calibrated positions aligned with SVG road checkpoints
const DEFAULT_POSITIONS = {
  '01': { x: 320, y: 420 },
  '02': { x: 670, y: 1090 },
  '03': { x: 10, y: 1600 },
  '04': { x: 665, y: 2060 },
  '05': { x: 335, y: 2440 },
};

/**
 * Journey Page Component (Mountain Switchback Pass).
 * 
 * Features:
 * - Authentic mountain road with realistic hairpin switchbacks, stone curbs & dashed stripes.
 * - Dynamic scroll-tracking starlight beacon traveling along the curves.
 * - Living animated celestial background with breathing nebulas, stars & meteor streaks.
 * - Live in-browser drag-and-drop visual layout editor to calibrate card positions.
 */
export function Journey() {
  const [activeStep, setActiveStep] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);
  const draggingRef = useRef(null);

  // Load custom positions from localStorage if available
  const [positions, setPositions] = useState(() => {
    try {
      const saved = localStorage.getItem('journey_card_positions');
      return saved ? JSON.parse(saved) : DEFAULT_POSITIONS;
    } catch {
      return DEFAULT_POSITIONS;
    }
  });

  // Track dragging in real-time
  useEffect(() => {
    if (!isEditMode) return;

    const handleMouseMove = (e) => {
      if (!draggingRef.current || !containerRef.current) return;
      const { step, startClientX, startClientY, initialX, initialY } = draggingRef.current;
      const deltaX = e.clientX - startClientX;
      const deltaY = e.clientY - startClientY;

      const containerRect = containerRef.current.getBoundingClientRect();
      const maxX = Math.max(0, containerRect.width - 320);

      const nextX = Math.round(Math.min(Math.max(0, initialX + deltaX), maxX));
      const nextY = Math.round(Math.min(Math.max(0, initialY + deltaY), 2750));

      setPositions((prev) => {
        const updated = { ...prev, [step]: { x: nextX, y: nextY } };
        return updated;
      });
    };

    const handleMouseUp = () => {
      if (draggingRef.current) {
        draggingRef.current = null;
        setPositions((current) => {
          localStorage.setItem('journey_card_positions', JSON.stringify(current));
          return current;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isEditMode]);

  const handleStartDrag = (e, step) => {
    if (!isEditMode) return;
    e.preventDefault();
    const currentPos = positions[step] || DEFAULT_POSITIONS[step] || { x: 0, y: 0 };
    draggingRef.current = {
      step,
      startClientX: e.clientX,
      startClientY: e.clientY,
      initialX: currentPos.x,
      initialY: currentPos.y,
    };
  };

  const handleReset = () => {
    setPositions(DEFAULT_POSITIONS);
    localStorage.removeItem('journey_card_positions');
  };

  const handleCopyCss = () => {
    const css = `/* Milestone Card Positions (Calibrated in Live Drag Mode) */
.milestone-row--01 { top: ${positions['01']?.y ?? 420}px; left: ${positions['01']?.x ?? 320}px; }
.milestone-row--02 { top: ${positions['02']?.y ?? 1090}px; left: ${positions['02']?.x ?? 670}px; right: auto; }
.milestone-row--03 { top: ${positions['03']?.y ?? 1600}px; left: ${positions['03']?.x ?? 10}px; }
.milestone-row--04 { top: ${positions['04']?.y ?? 2060}px; left: ${positions['04']?.x ?? 665}px; right: auto; }
.milestone-row--05 { top: ${positions['05']?.y ?? 2440}px; left: ${positions['05']?.x ?? 335}px; transform: none; }`;

    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Layout assignment for alternating switchback bends
  const getRowClass = (index) => {
    if (index === 4) return 'milestone-row--summit';
    return index % 2 === 0 ? 'milestone-row--left' : 'milestone-row--right';
  };

  return (
    <section className="section journey-section">
      {/* Living animated celestial background */}
      <CelestialSky />

      <div className="container">
        {/* Header */}
        <div className="fade-in" style={{ marginBottom: 'var(--space-xl)' }}>
          <span className="label">Journey</span>
          <h2 style={{ margin: 'var(--space-sm) 0 var(--space-md)' }}>
            A steady exposure.
          </h2>
          <p style={{ maxWidth: '64ch', color: 'var(--text-secondary)' }}>
            The milestones, detours, and orbits that shaped the path so far.
          </p>
        </div>

        {/* Mountain Switchback Roadmap Area */}
        <div ref={containerRef} className={`mountain-roadmap-wrap ${isEditMode ? 'mountain-roadmap-wrap--editing' : ''}`}>
          {/* Authentic Switchback Road SVG with Scroll-Driven Traveler Beacon */}
          <MountainRoad
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />

          {/* Milestone Cards Flow along the Switchback Bends */}
          <div className="milestones-flow">
            {journeyMilestones.map((milestone, index) => {
              const pos = positions[milestone.step] || DEFAULT_POSITIONS[milestone.step];
              return (
                <div
                  key={milestone.id}
                  className={`milestone-row milestone-row--${milestone.step} ${getRowClass(index)} fade-in`}
                  style={{
                    top: `${pos?.y ?? 0}px`,
                    left: `${pos?.x ?? 0}px`,
                    right: 'auto',
                    transform: 'none',
                  }}
                >
                  {isEditMode && (
                    <div
                      className="card-drag-indicator"
                      onMouseDown={(e) => handleStartDrag(e, milestone.step)}
                    >
                      <span>⠿ Drag Card {milestone.step}</span>
                      <span className="card-drag-coords">
                        X: {pos?.x}px | Y: {pos?.y}px
                      </span>
                    </div>
                  )}
                  <MilestoneCard
                    milestone={milestone}
                    isActive={activeStep === milestone.step}
                    onMouseEnter={() => !isEditMode && setActiveStep(milestone.step)}
                    onMouseLeave={() => !isEditMode && setActiveStep(null)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Live Calibration Dev Toolbar */}
      <aside className="journey-editor-toolbar" aria-label="Layout Calibration Tools">
        <button
          type="button"
          className={`journey-editor-btn ${isEditMode ? 'journey-editor-btn--primary' : ''}`}
          onClick={() => setIsEditMode((prev) => !prev)}
          title="Toggle live draggable layout editor"
        >
          <span>{isEditMode ? '✓ Done Editing' : '🛠️ Drag to Position'}</span>
        </button>

        {isEditMode && (
          <>
            <button
              type="button"
              className="journey-editor-btn"
              onClick={handleCopyCss}
              title="Copy current positions as CSS"
            >
              <span>{copied ? '✓ Copied CSS!' : '📋 Copy CSS'}</span>
            </button>
            <button
              type="button"
              className="journey-editor-btn"
              onClick={handleReset}
              title="Reset to recommended coordinates"
            >
              <span>↺ Reset</span>
            </button>
          </>
        )}
      </aside>
    </section>
  );
}
