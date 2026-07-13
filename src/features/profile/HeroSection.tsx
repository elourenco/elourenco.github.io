import type { PortfolioContent } from '../../content';

const LINKEDIN_URL = 'https://www.linkedin.com/in/dudulourenco';

export function HeroSection({ content }: { content: PortfolioContent }) {
  return (
    <section aria-labelledby="hero-title">
      <p>{content.hero.eyebrow}</p>
      <h1 id="hero-title">{content.hero.title}</h1>
      <p>{content.hero.disciplines}</p>
      <p>{content.hero.summary}</p>
      <a href="#work">{content.hero.workCta}</a>
      <a href={LINKEDIN_URL}>{content.hero.linkedinCta}</a>
    </section>
  );
}
