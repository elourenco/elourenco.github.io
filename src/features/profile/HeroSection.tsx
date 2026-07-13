import type { PortfolioContent } from '../../content';
import { ProfilePortrait } from '../../components/ProfilePortrait';
import { EXTERNAL_URLS, PUBLIC_ASSETS } from '../../site-contract';

export function HeroSection({ content }: { content: PortfolioContent }) {
  const portraitAlt =
    content.locale === 'pt-BR'
      ? 'Retrato de Eduardo Lourenco'
      : 'Portrait of Eduardo Lourenco';

  return (
    <section className="hero section-shell" aria-labelledby="hero-title">
      <div className="hero__content">
        <p className="eyebrow">{content.hero.eyebrow}</p>
        <h1 id="hero-title">{content.hero.title}</h1>
        <p className="hero__disciplines">{content.hero.disciplines}</p>
        <p className="hero__summary">{content.hero.summary}</p>
        <div className="action-cluster">
          <a className="button button--primary" href="#work">
            {content.hero.workCta}
          </a>
          <a className="button" href={EXTERNAL_URLS.linkedin}>
            {content.hero.linkedinCta}
          </a>
          <a
            className="button button--quiet"
            href={PUBLIC_ASSETS.resume}
            download
          >
            {content.hero.resumeCta}
          </a>
        </div>
      </div>
      <ProfilePortrait alt={portraitAlt} priority />
    </section>
  );
}
