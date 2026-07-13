import type { PortfolioContent } from '../../content';
import { SITE_ANCHORS } from '../../site-contract';

export function CareerTimeline({ content }: { content: PortfolioContent }) {
  return (
    <section
      id={SITE_ANCHORS.home.career}
      className="career-section section-shell"
      aria-labelledby={SITE_ANCHORS.home.careerTitle}
    >
      <div className="section-heading">
        <p className="eyebrow" aria-hidden="true">
          // 03
        </p>
        <h2 id={SITE_ANCHORS.home.careerTitle}>{content.career.title}</h2>
      </div>
      <ol className="timeline">
        {content.career.items.map((item) => (
          <li key={`${item.company}-${item.role}`}>
            <article className="timeline__entry">
              <p className="timeline__period">{item.period}</p>
              <h3>{item.company}</h3>
              <p>{item.role}</p>
              <p>{item.summary}</p>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
