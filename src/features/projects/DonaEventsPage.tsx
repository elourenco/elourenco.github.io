import type { PortfolioContent } from '../../content';
import { SiteHeader } from '../../components/SiteHeader';
import { SkipLink } from '../../components/SkipLink';
import { Seo } from '../../components/Seo';
import { EXTERNAL_URLS } from '../../site-contract';

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
      <main id="main-content" data-locale={content.locale}>
        <article>
          <header>
            <p>{content.dona.label}</p>
            <h1>{content.dona.title}</h1>
            <p>{content.dona.role}</p>
            <p>{content.dona.summary}</p>
            <p>{project.metric}</p>
          </header>

          <section aria-labelledby="dona-outcome-title">
            <h2 id="dona-outcome-title">{project.outcomeTitle}</h2>
            <p>{project.outcome}</p>
          </section>

          <section aria-labelledby="dona-ownership-title">
            <h2 id="dona-ownership-title">{project.ownershipTitle}</h2>
            <p>{project.ownership}</p>
          </section>

          <section aria-labelledby="dona-capabilities-title">
            <h2 id="dona-capabilities-title">{project.capabilitiesTitle}</h2>
            <ul>
              {project.capabilities.map((capability) => (
                <li key={capability}>{capability}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="dona-platforms-title">
            <h2 id="dona-platforms-title">{project.platformsTitle}</h2>
            <ul>
              {project.platforms.map((platform) => (
                <li key={platform}>{platform}</li>
              ))}
            </ul>
          </section>

          <a href={EXTERNAL_URLS.donaEvents} target="_blank" rel="noreferrer">
            {project.externalCta}
          </a>
        </article>
      </main>
    </>
  );
}
