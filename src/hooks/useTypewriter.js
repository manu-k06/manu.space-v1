import { useState, useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Custom hook that creates a typewriter effect for text.
 *
 * @param {string} text - The full string to type out.
 * @param {number} speed - Typing interval in milliseconds (default: 70ms).
 * @param {number} startDelay - Initial pause before typing starts (default: 1500ms).
 * @returns {{ displayText: string, isTyping: boolean, isDone: boolean }}
 */
export function useTypewriter(text, speed = 70, startDelay = 1500) {
  const reduced = useReducedMotion();
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (reduced) return;
    // Reset states when input text changes
    setDisplayText('');
    setIsTyping(false);
    setIsDone(false);

    let charIndex = 0;
    let typeInterval;
    let doneTimeout;

    // Start typing after initial delay
    const startTimeout = setTimeout(() => {
      setIsTyping(true);

      typeInterval = setInterval(() => {
        if (charIndex < text.length) {
          setDisplayText(text.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);

          // Fade out cursor after 3 seconds
          doneTimeout = setTimeout(() => {
            setIsDone(true);
          }, 3000);
        }
      }, speed);
    }, startDelay);

    // Cleanup timers if component unmounts or text changes
    return () => {
      clearTimeout(startTimeout);
      clearInterval(typeInterval);
      clearTimeout(doneTimeout);
    };
  }, [text, speed, startDelay, reduced]);

  return reduced
    ? { displayText: text, isTyping: false, isDone: true }
    : { displayText, isTyping, isDone };
}
