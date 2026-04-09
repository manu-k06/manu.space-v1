document.addEventListener('DOMContentLoaded', () => {
  // --- Page Reveal Transition ---
  // The base.css has body { opacity: 0 } which is slowly transitioned to 1.
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);

  // --- Soft Page Navigation ---
  const overlay = document.querySelector('.page-transition-overlay');
  const links = document.querySelectorAll('a');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      // Check if link is to an external site or a mailto/tel link
      if (link.host !== window.location.host || link.href.startsWith('mailto:') || link.href.startsWith('tel:')) {
        return;
      }
      
      e.preventDefault();
      const targetUrl = link.href;
      
      // Trigger out-animation if overlay exists
      if (overlay) {
        overlay.classList.add('active');
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 400); // Wait for .page-transition-overlay transition (0.4s)
      } else {
        window.location.href = targetUrl;
      }
    });
  });

  // --- Intersection Observer for Fade-Ins ---
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    fadeElements.forEach(el => observer.observe(el));
  }
});
