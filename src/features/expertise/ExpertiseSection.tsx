import type { PortfolioContent } from '../../content';

export function ExpertiseSection({ content }: { content: PortfolioContent }) {
  return (
    <section
      id="expertise"
      className="expertise-section section-shell"
      aria-labelledby="expertise-title"
    >
      <div className="section-heading">
        <p className="eyebrow" aria-hidden="true">
          // 02
        </p>
        <h2 id="expertise-title">{content.navigation.expertise}</h2>
      </div>
      <div className="expertise-grid">
        {content.expertise.map((item, index) => (
          <article className="expertise-card" key={item.id}>
            <span className="expertise-card__index" aria-hidden="true">
              0{index + 1}
            </span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <ul>
              {item.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
