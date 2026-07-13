import { Link } from 'react-router-dom';
import type { PortfolioContent } from '../../content';
import { toLocalePath } from '../../i18n/locale-paths';

export function FeaturedProject({ content }: { content: PortfolioContent }) {
  return (
    <section
      id="work"
      className="feature-section section-shell"
      aria-labelledby="work-title"
    >
      <div className="section-heading">
        <p className="eyebrow" aria-hidden="true">
          // 01
        </p>
        <p>{content.dona.label}</p>
        <h2 id="work-title">{content.dona.title}</h2>
      </div>
      <div className="feature-panel">
        <p className="feature-panel__role">{content.dona.role}</p>
        <p>{content.dona.summary}</p>
        <p className="metric">{content.dona.metric}</p>
      </div>
      <Link
        className="button button--primary"
        to={toLocalePath(content.locale, 'donaEvents')}
      >
        {content.dona.cta}
      </Link>
    </section>
  );
}
