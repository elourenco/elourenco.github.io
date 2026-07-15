import { Link } from 'react-router-dom';
import dashboardUrl from '../../assets/dona-events-dashboard.webp';
import { useRevealOnView } from '../../components/useRevealOnView';
import type { PortfolioContent } from '../../content';
import { INTERNAL_DESTINATIONS, SITE_ANCHORS } from '../../site-contract';

export function FeaturedProject({ content }: { content: PortfolioContent }) {
  const { ref, revealed } = useRevealOnView<HTMLElement>();
  const destination = INTERNAL_DESTINATIONS.route(content.locale, 'donaEvents');

  return (
    <section
      ref={ref}
      id={SITE_ANCHORS.home.work}
      className="feature-section section-shell"
      aria-labelledby={SITE_ANCHORS.home.workTitle}
      data-revealed={revealed}
    >
      <div className="section-heading feature-section__heading">
        <p className="eyebrow" aria-hidden="true">
          // 01
        </p>
        <p className="feature-section__label">{content.dona.label}</p>
      </div>
      <div className="feature-card">
        <div className="feature-card__copy">
          <p className="feature-panel__role">{content.dona.role}</p>
          <h2 id={SITE_ANCHORS.home.workTitle}>{content.dona.title}</h2>
          <p className="metric">{content.donaCase.metric}</p>
          <p className="feature-panel__summary">{content.dona.summary}</p>
          <Link className="button button--primary" to={destination}>
            {content.dona.cta}
          </Link>
        </div>
        <figure className="feature-card__visual" aria-hidden="true">
          <img
            src={dashboardUrl}
            alt=""
            width={1120}
            height={700}
            loading="lazy"
          />
        </figure>
      </div>
    </section>
  );
}
