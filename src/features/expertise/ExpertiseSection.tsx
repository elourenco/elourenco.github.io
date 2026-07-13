import type { PortfolioContent } from '../../content';

export function ExpertiseSection({ content }: { content: PortfolioContent }) {
  return (
    <section id="expertise" aria-labelledby="expertise-title">
      <h2 id="expertise-title">{content.navigation.expertise}</h2>
      {content.expertise.map((item) => (
        <article key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <ul>
            {item.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
