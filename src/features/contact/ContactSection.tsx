import { useRevealOnView } from '../../components/useRevealOnView';
import type { PortfolioContent } from '../../content';
import { EXTERNAL_URLS, SITE_ANCHORS } from '../../site-contract';

export function ContactSection({ content }: { content: PortfolioContent }) {
  const { ref, revealed } = useRevealOnView<HTMLElement>();

  return (
    <section
      ref={ref}
      id={SITE_ANCHORS.home.contact}
      className="contact-section section-shell"
      aria-labelledby={SITE_ANCHORS.home.contactTitle}
      data-revealed={revealed}
    >
      <div className="section-heading contact-section__heading">
        <p className="eyebrow" aria-hidden="true">
          // 04
        </p>
        <h2 id={SITE_ANCHORS.home.contactTitle}>{content.contact.title}</h2>
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
