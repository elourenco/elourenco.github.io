import { Link } from 'react-router-dom';
import type { PortfolioContent } from '../../content';
import { toLocalePath } from '../../i18n/locale-paths';

export function FeaturedProject({ content }: { content: PortfolioContent }) {
  return (
    <section id="work" aria-labelledby="work-title">
      <p>{content.dona.label}</p>
      <h2 id="work-title">{content.dona.title}</h2>
      <p>{content.dona.role}</p>
      <p>{content.dona.summary}</p>
      <p>{content.dona.metric}</p>
      <Link to={toLocalePath(content.locale, 'donaEvents')}>
        {content.dona.cta}
      </Link>
    </section>
  );
}
