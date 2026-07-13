import type { PortfolioContent } from '../../content';
import { ProfilePortrait } from '../../components/ProfilePortrait';
import {
  EXTERNAL_URLS,
  INTERNAL_DESTINATIONS,
  PUBLIC_ASSETS,
  SITE_ANCHORS,
} from '../../site-contract';

export function HeroSection({ content }: { content: PortfolioContent }) {
  const portraitAlt =
    content.locale === 'pt-BR'
      ? 'Retrato de Eduardo Lourenco'
      : 'Portrait of Eduardo Lourenco';

  return (
    <section
      className="hero section-shell"
      aria-labelledby={SITE_ANCHORS.home.heroTitle}
    >
      <div className="hero__content">
        <p className="eyebrow">{content.hero.eyebrow}</p>
        <h1 id={SITE_ANCHORS.home.heroTitle}>{content.hero.title}</h1>
        <p className="hero__disciplines">{content.hero.disciplines}</p>
        <p className="hero__summary">{content.hero.summary}</p>
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
