import type { PortfolioContent } from '../../content';

export function ContactSection({ content }: { content: PortfolioContent }) {
  return (
    <section
      id="contact"
      className="contact-section section-shell"
      aria-labelledby="contact-title"
    >
      <div className="section-heading">
        <p className="eyebrow">OPEN CHANNEL // CONTACT</p>
        <h2 id="contact-title">{content.contact.title}</h2>
      </div>
      <p className="contact-section__summary">{content.contact.summary}</p>
      <div className="action-cluster">
        <a
          className="button button--primary"
          href="https://www.linkedin.com/in/dudulourenco"
        >
          LinkedIn
        </a>
        <a className="button" href="https://github.com/elourenco">
          GitHub
        </a>
      </div>
    </section>
  );
}
