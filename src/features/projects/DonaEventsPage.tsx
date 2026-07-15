import type { PortfolioContent } from '../../content';
import { SiteHeader } from '../../components/SiteHeader';
import { SkipLink } from '../../components/SkipLink';
import { Seo } from '../../components/Seo';
import { EXTERNAL_URLS, SITE_ANCHORS } from '../../site-contract';

export function DonaEventsPage({ content }: { content: PortfolioContent }) {
  const isPortuguese = content.locale === 'pt-BR';
  const project = content.donaCase;

  return (
    <>
      <Seo locale={content.locale} route="donaEvents" />
      <SkipLink
        label={isPortuguese ? 'Pular para o conteúdo' : 'Skip to content'}
      />
      <SiteHeader content={content} route="donaEvents" />
      <main
        id={SITE_ANCHORS.main}
        className="dona-page"
        data-locale={content.locale}
      >
        <article className="dona-case">
          <header className="dona-case__hero">
            <p className="dona-case__label">{content.dona.label}</p>
            <h1 className="dona-case__title">{content.dona.title}</h1>
            <p className="dona-case__role">{content.dona.role}</p>
            <p className="dona-case__summary">{content.dona.summary}</p>
            <p className="dona-case__metric">{project.metric}</p>
          </header>

          <section
            className="dona-case__section"
            aria-labelledby={SITE_ANCHORS.donaEvents.outcomeTitle}
          >
            <h2 id={SITE_ANCHORS.donaEvents.outcomeTitle}>
              {project.outcomeTitle}
            </h2>
            <p>{project.outcome}</p>
          </section>

          <section
            className="dona-case__section"
            aria-labelledby={SITE_ANCHORS.donaEvents.ownershipTitle}
          >
            <h2 id={SITE_ANCHORS.donaEvents.ownershipTitle}>
              {project.ownershipTitle}
            </h2>
            <p>{project.ownership}</p>
          </section>

          <section
            className="dona-case__section"
            aria-labelledby={SITE_ANCHORS.donaEvents.capabilitiesTitle}
          >
            <h2 id={SITE_ANCHORS.donaEvents.capabilitiesTitle}>
              {project.capabilitiesTitle}
            </h2>
            <ul className="dona-case__list">
              {project.capabilities.map((capability) => (
                <li className="dona-case__list-item" key={capability}>
                  {capability}
                </li>
              ))}
            </ul>
          </section>

          <section
            className="dona-case__section"
            aria-labelledby={SITE_ANCHORS.donaEvents.platformsTitle}
          >
            <h2 id={SITE_ANCHORS.donaEvents.platformsTitle}>
              {project.platformsTitle}
            </h2>
            <ul className="dona-case__list">
              {project.platforms.map((platform) => (
                <li className="dona-case__list-item" key={platform}>
                  {platform}
                </li>
              ))}
            </ul>
          </section>

          <a
            className="dona-case__cta button button--primary"
            href={EXTERNAL_URLS.donaEvents}
            target="_blank"
            rel="noreferrer"
          >
            {project.externalCta}
          </a>
        </article>
      </main>
    </>
  );
}
