import { lazy, Suspense } from 'react';
import type { PortfolioContent } from '../../content';
import { SiteHeader } from '../../components/SiteHeader';
import { SkipLink } from '../../components/SkipLink';
import { CareerTimeline } from '../career/CareerTimeline';
import { ContactSection } from '../contact/ContactSection';
import { ExpertiseSection } from '../expertise/ExpertiseSection';
import { FeaturedProject } from '../projects/FeaturedProject';
import { HeroSection } from '../profile/HeroSection';
import type { SceneSection } from '../../experience/scene-state';
import { useSectionObserver } from '../../experience/useSectionObserver';
import { Seo } from '../../components/Seo';
import { HOME_SECTION_ANCHORS, SITE_ANCHORS } from '../../site-contract';

const OBSERVED_SECTION_IDS = [
  SITE_ANCHORS.main,
  ...HOME_SECTION_ANCHORS,
] as const;

const SCENE_BY_SECTION_ID: Record<
  (typeof OBSERVED_SECTION_IDS)[number],
  SceneSection
> = {
  [SITE_ANCHORS.main]: 'arrival',
  [SITE_ANCHORS.home.work]: 'ai-core',
  [SITE_ANCHORS.home.expertise]: 'systems',
  [SITE_ANCHORS.home.career]: 'career',
  [SITE_ANCHORS.home.contact]: 'contact',
};

const AdaptiveCanvas = lazy(() =>
  import('../../experience/AdaptiveCanvas').then(({ AdaptiveCanvas }) => ({
    default: AdaptiveCanvas,
  })),
);

export function HomePage({ content }: { content: PortfolioContent }) {
  const isPortuguese = content.locale === 'pt-BR';
  const activeSectionId = useSectionObserver(OBSERVED_SECTION_IDS);
  const sceneSection = SCENE_BY_SECTION_ID[activeSectionId];

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
        <HeroSection content={content} />
        <FeaturedProject content={content} />
        <ExpertiseSection content={content} />
        <CareerTimeline content={content} />
        <ContactSection content={content} />
      </main>
      <Suspense fallback={null}>
        <AdaptiveCanvas section={sceneSection} />
      </Suspense>
    </>
  );
}
