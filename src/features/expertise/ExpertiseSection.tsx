import type { PortfolioContent } from '../../content';
import { SITE_ANCHORS } from '../../site-contract';

export function ExpertiseSection({ content }: { content: PortfolioContent }) {
  return (
    <section
      id={SITE_ANCHORS.home.expertise}
      className="expertise-section section-shell"
      aria-labelledby={SITE_ANCHORS.home.expertiseTitle}
    >
      <div className="section-heading">
        <p className="eyebrow" aria-hidden="true">
          // 02
        </p>
        <h2 id={SITE_ANCHORS.home.expertiseTitle}>
          {content.navigation.expertise}
        </h2>
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
