import type { PortfolioContent } from '../../content';
import { SITE_ANCHORS } from '../../site-contract';

export function ExpertiseSection({ content }: { content: PortfolioContent }) {
  return (
    <section
      id={SITE_ANCHORS.home.expertise}
      className="expertise-section section-shell"
      aria-labelledby={SITE_ANCHORS.home.expertiseTitle}
    >
      <div className="section-heading expertise-section__heading">
        <p className="eyebrow" aria-hidden="true">
          // 02
        </p>
        <h2 id={SITE_ANCHORS.home.expertiseTitle}>
          {content.navigation.expertise}
        </h2>
      </div>
      <div className="expertise-grid expertise-section__list">
        {content.expertise.map((item, index) => (
          <article className="expertise-card" key={item.id}>
            <span className="expertise-card__index" aria-hidden="true">
              0{index + 1}
            </span>
            <h3 className="expertise-card__title">{item.title}</h3>
            <p className="expertise-card__description">{item.description}</p>
            <ul className="expertise-card__skills">
              {item.skills.map((skill) => (
                <li className="expertise-card__skill" key={skill}>
                  {skill}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
