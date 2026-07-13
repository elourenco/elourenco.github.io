export type Locale = 'en' | 'pt-BR';
export type RouteKey = 'home' | 'donaEvents';

export interface PortfolioContent {
  locale: Locale;
  navigation: {
    expertise: string;
    work: string;
    career: string;
    contact: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    disciplines: string;
    summary: string;
    workCta: string;
    linkedinCta: string;
    resumeCta: string;
  };
  expertise: Array<{
    id: 'ai' | 'mobile' | 'architecture';
    title: string;
    description: string;
    skills: string[];
  }>;
  dona: {
    label: string;
    title: string;
    role: string;
    summary: string;
    metric: string;
    cta: string;
  };
  career: {
    title: string;
    items: Array<{
      period: string;
      company: string;
      role: string;
      summary: string;
    }>;
  };
  contact: { title: string; summary: string };
}
