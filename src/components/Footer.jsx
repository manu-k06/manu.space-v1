import React from 'react';

/**
 * Global Site Footer Component.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer fade-in">
      <div className="container">
        <span>© {currentYear} Manu. All rights reserved.</span>
        <span>Somewhere online.</span>
      </div>
    </footer>
  );
}
