import React from 'react';

const contactLinks = [
  { label: 'manu.k.rajan06@gmail.com', href: 'mailto:manu.k.rajan06@gmail.com' },
  { label: 'GitHub', href: 'https://github.com/manu-k06', external: true },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/manu-k-rajan', external: true },
  { label: 'Instagram', href: 'https://instagram.com/manukraaj_', external: true },
];

/**
 * Contact Page Component.
 */
export function Contact() {
  return (
    <section className="section section--full">
      <div className="container">
        <div className="fade-in">
          <span className="label">Contact</span>
          <h2 style={{ margin: 'var(--space-sm) 0 0' }}>Reach out.</h2>

          <div className="contact-wrapper">
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="contact-link fade-in"
                {...(link.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
