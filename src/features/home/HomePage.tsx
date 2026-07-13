import type { PortfolioContent } from '../../content';
import { SiteHeader } from '../../components/SiteHeader';
import { SkipLink } from '../../components/SkipLink';
import { CareerTimeline } from '../career/CareerTimeline';
import { ContactSection } from '../contact/ContactSection';
import { ExpertiseSection } from '../expertise/ExpertiseSection';
import { FeaturedProject } from '../projects/FeaturedProject';
import { HeroSection } from '../profile/HeroSection';

export function HomePage({ content }: { content: PortfolioContent }) {
  const isPortuguese = content.locale === 'pt-BR';

  return (
    <>
      <SkipLink
        label={isPortuguese ? 'Pular para o conteúdo' : 'Skip to content'}
      />
      <SiteHeader content={content} route="home" />
      <main id="main-content" data-locale={content.locale}>
        <HeroSection content={content} />
        <ExpertiseSection content={content} />
        <FeaturedProject content={content} />
        <CareerTimeline content={content} />
        <ContactSection content={content} />
      </main>
    </>
  );
}
