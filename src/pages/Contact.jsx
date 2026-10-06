import React from 'react';

const contactLinks = [
  {
    label: 'manu.k.rajan06@gmail.com',
    href: 'mailto:manu.k.rajan06@gmail.com',
  },
  { label: 'GitHub', href: 'https://github.com/manu-k06', external: true },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/manu-k-rajan',
    external: true,
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/manukraaj_',
    external: true,
  },
];

/**
 * Contact Page Component.
 */
export function Contact() {
  return (
    <section
      id="contact"
      tabIndex={-1}
      className="section portfolio-section contact-section"
      aria-labelledby="contact-title"
    >
      <div className="container">
        <div className="contact-content">
          <span className="label">04 / The next chapter</span>
          <h2 id="contact-title" style={{ margin: 'var(--space-sm) 0 0' }}>
            Let’s build something.
          </h2>
          <p className="contact-intro">
            Interested in working together? I’m looking for software engineering
            internships and people to build with.
          </p>

          <div className="contact-wrapper">
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="contact-link"
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
