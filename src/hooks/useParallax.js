import { useEffect, useRef } from 'react';

/**
 * Custom hook for smooth mouse parallax translation.
 * 
 * Tracks mouse movement across the viewport and applies a subtle 3D translation
 * to the referenced DOM element. Uses requestAnimationFrame for silky 60fps
 * updates without triggering React re-renders.
 * 
 * @param {number} maxOffset - Maximum pixel shift in either direction (default: 20px)
 * @returns {React.RefObject} - Ref to attach to the target container element
 */
export function useParallax(maxOffset = 20) {
  const targetRef = useRef(null);

  useEffect(() => {
    let rafId = null;

    const handleMouseMove = (e) => {
      if (!targetRef.current) return;

      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        if (!targetRef.current) return;

        // Calculate mouse position relative to center of screen (-1 to 1)
        const xPos = (e.clientX / window.innerWidth - 0.5) * 2;
        const yPos = (e.clientY / window.innerHeight - 0.5) * 2;

        // Subtle opposite direction shift
        const moveX = xPos * -maxOffset;
        const moveY = yPos * -maxOffset;

        targetRef.current.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0) scale(1.08)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [maxOffset]);

  return targetRef;
}
