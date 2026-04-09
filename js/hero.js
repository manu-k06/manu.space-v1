document.addEventListener('DOMContentLoaded', () => {
  const heroImage = document.querySelector('.hero-image');
  const heroWrapper = document.querySelector('.hero-parallax-wrapper');
  const typeWriterEl = document.querySelector('.hero-typewriter');

  // --- Film Exposure Effect ---
  // Image starts with high brightness/contrast or opacity in CSS and we reset it here.
  if (heroImage) {
    // A slight delay to let the page fade in first
    setTimeout(() => {
      heroImage.classList.add('exposed');
    }, 400);
  }

  // --- Parallax Effect ---
  // Only apply parallax if user has a pointing device (e.g. mouse), disable on touch
  if (heroWrapper && heroImage) {
    const isTouchDevice = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));

    // We can also use CSS media queries (hover: hover) and (pointer: fine) but JS gives more control.
    // Ensure we only listen to mousemove on non-touch
    if (!isTouchDevice) {
      document.addEventListener('mousemove', (e) => {
        // Calculate mouse position relative to center of screen (-1 to 1)
        const xPos = (e.clientX / window.innerWidth - 0.5) * 2;
        const yPos = (e.clientY / window.innerHeight - 0.5) * 2;

        // Very subtle translation (max 15px shift)
        const moveX = xPos * -15;
        const moveY = yPos * -15;

        // Use transform on the wrapper to keep the grain canvas absolute and independent
        // We apply a scale to prevent edges from showing during parallax translation
        heroWrapper.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.05)`;
      });
    }
  }

  // --- Typewriter Effect ---
  if (typeWriterEl) {
    const textToType = typeWriterEl.getAttribute('data-text') || "A developer and space enthusiast.";
    typeWriterEl.textContent = "";
    typeWriterEl.classList.add('typing-active');

    let i = 0;
    // Delay typewriting until the exposure and fade-in effects are settled
    setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (i < textToType.length) {
          typeWriterEl.textContent += textToType.charAt(i);
          i++;
        } else {
          clearInterval(typeInterval);
          // Optional: remove blinking cursor class after done
          setTimeout(() => {
            typeWriterEl.classList.remove('typing-active');
            typeWriterEl.classList.add('typing-done');
          }, 3000);
        }
      }, 70); // Slow, deliberate typing speed
    }, 1500);
  }
});
