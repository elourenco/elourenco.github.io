import { Link } from 'react-router-dom';
import type { PortfolioContent } from '../../content';
import { INTERNAL_DESTINATIONS, SITE_ANCHORS } from '../../site-contract';

export function FeaturedProject({ content }: { content: PortfolioContent }) {
  return (
    <section
      id={SITE_ANCHORS.home.work}
      className="feature-section section-shell"
      aria-labelledby={SITE_ANCHORS.home.workTitle}
    >
      <div className="section-heading feature-section__heading">
        <p className="eyebrow" aria-hidden="true">
          // 01
        </p>
        <p className="feature-section__label">{content.dona.label}</p>
        <h2 id={SITE_ANCHORS.home.workTitle}>{content.dona.title}</h2>
      </div>
      <div className="feature-panel">
        <p className="feature-panel__role">{content.dona.role}</p>
        <p className="feature-panel__summary">{content.dona.summary}</p>
        <p className="metric">{content.dona.metric}</p>
      </div>
      <Link
        className="button button--primary"
        to={INTERNAL_DESTINATIONS.route(content.locale, 'donaEvents')}
      >
        {content.dona.cta}
      </Link>
    </section>
  );
}
