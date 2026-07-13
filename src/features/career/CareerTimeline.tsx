import type { PortfolioContent } from '../../content';

export function CareerTimeline({ content }: { content: PortfolioContent }) {
  return (
    <section id="career" aria-labelledby="career-title">
      <h2 id="career-title">{content.career.title}</h2>
      <ol>
        {content.career.items.map((item) => (
          <li key={`${item.company}-${item.role}`}>
            <article>
              <p>{item.period}</p>
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
