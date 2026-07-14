import type { PortfolioContent } from '../../content';
import { ParticleExperience } from '../../experience/ParticleExperience';
import {
  EXTERNAL_URLS,
  INTERNAL_DESTINATIONS,
  PUBLIC_ASSETS,
  SITE_ANCHORS,
} from '../../site-contract';
import { HeroPortrait } from './HeroPortrait';

function HeroActions({ content }: { content: PortfolioContent }) {
  return (
    <div className="action-cluster">
      <a
        className="button button--primary"
        href={INTERNAL_DESTINATIONS.fragment(SITE_ANCHORS.home.work)}
      >
        {content.hero.workCta}
      </a>
      <a className="button" href={EXTERNAL_URLS.linkedin}>
        {content.hero.linkedinCta}
      </a>
      <a className="button button--quiet" href={PUBLIC_ASSETS.resume} download>
        {content.hero.resumeCta}
      </a>
    </div>
  );
}

export function HomeHero({ content }: { content: PortfolioContent }) {
  const portraitAlt =
    content.locale === 'pt-BR'
      ? 'Retrato de Eduardo Lourenco'
      : 'Portrait of Eduardo Lourenco';

  return (
    <section
      className="home-hero section-shell"
      aria-labelledby={SITE_ANCHORS.home.heroTitle}
    >
      <div className="home-hero__content">
        <h1 id={SITE_ANCHORS.home.heroTitle} className="home-hero__title">
          <span className="home-hero__name">{content.hero.eyebrow}</span>{' '}
          <span className="home-hero__role">{content.hero.title}</span>
        </h1>
        <p className="home-hero__disciplines">{content.hero.disciplines}</p>
        <p className="home-hero__summary">{content.hero.summary}</p>
        <HeroActions content={content} />
      </div>
      <div className="home-hero__visual">
        <HeroPortrait alt={portraitAlt} priority />
        <ParticleExperience className="home-hero__particles" />
      </div>
    </section>
  );
}
