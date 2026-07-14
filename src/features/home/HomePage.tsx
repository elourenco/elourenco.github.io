import type { PortfolioContent } from '../../content';
import { SiteHeader } from '../../components/SiteHeader';
import { SkipLink } from '../../components/SkipLink';
import { CareerTimeline } from '../career/CareerTimeline';
import { ContactSection } from '../contact/ContactSection';
import { ExpertiseSection } from '../expertise/ExpertiseSection';
import { FeaturedProject } from '../projects/FeaturedProject';
import { Seo } from '../../components/Seo';
import { SITE_ANCHORS } from '../../site-contract';
import { HomeHero } from './HomeHero';

export function HomePage({ content }: { content: PortfolioContent }) {
  const isPortuguese = content.locale === 'pt-BR';
  return (
    <>
      <Seo locale={content.locale} route="home" />
      <SkipLink
        label={isPortuguese ? 'Pular para o conteúdo' : 'Skip to content'}
      />
      <SiteHeader content={content} route="home" />
      <main
        id={SITE_ANCHORS.main}
        className="site-main"
        data-locale={content.locale}
      >
        <HomeHero content={content} />
        <FeaturedProject content={content} />
        <ExpertiseSection content={content} />
        <CareerTimeline content={content} />
        <ContactSection content={content} />
      </main>
    </>
  );
}
