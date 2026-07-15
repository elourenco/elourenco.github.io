import { useRevealOnView } from '../../components/useRevealOnView';
import type { PortfolioContent } from '../../content';
import { SITE_ANCHORS } from '../../site-contract';

export function CareerTimeline({ content }: { content: PortfolioContent }) {
  const { ref, revealed } = useRevealOnView<HTMLElement>();

  return (
    <section
      ref={ref}
      id={SITE_ANCHORS.home.career}
      className="career-section section-shell"
      aria-labelledby={SITE_ANCHORS.home.careerTitle}
      data-revealed={revealed}
    >
      <div className="section-heading career-section__heading">
        <p className="eyebrow" aria-hidden="true">
          // 03
        </p>
        <h2 id={SITE_ANCHORS.home.careerTitle}>{content.career.title}</h2>
      </div>
      <ol className="timeline">
        {content.career.items.map((item) => (
          <li className="timeline__item" key={`${item.company}-${item.role}`}>
            <article className="timeline__entry">
              <p className="timeline__period">{item.period}</p>
              <h3 className="timeline__company">{item.company}</h3>
              <p className="timeline__role">{item.role}</p>
              <p className="timeline__summary">{item.summary}</p>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
