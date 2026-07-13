import type { PortfolioContent } from '../../content';
import { EXTERNAL_URLS } from '../../site-contract';

export function ContactSection({ content }: { content: PortfolioContent }) {
  return (
    <section
      id="contact"
      className="contact-section section-shell"
      aria-labelledby="contact-title"
    >
      <div className="section-heading">
        <p className="eyebrow" aria-hidden="true">
          // 04
        </p>
        <h2 id="contact-title">{content.contact.title}</h2>
      </div>
      <p className="contact-section__summary">{content.contact.summary}</p>
      <div className="action-cluster">
        <a className="button button--primary" href={EXTERNAL_URLS.linkedin}>
          LinkedIn
        </a>
        <a className="button" href={EXTERNAL_URLS.github}>
          GitHub
        </a>
      </div>
    </section>
  );
}
