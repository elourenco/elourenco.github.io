import type { PortfolioContent } from '../../content';

export function CareerTimeline({ content }: { content: PortfolioContent }) {
  return (
    <section
      id="career"
      className="career-section section-shell"
      aria-labelledby="career-title"
    >
      <div className="section-heading">
        <p className="eyebrow" aria-hidden="true">
          // 03
        </p>
        <h2 id="career-title">{content.career.title}</h2>
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
