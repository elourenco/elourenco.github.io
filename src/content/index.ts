import { enContent } from './en';
import { ptBRContent } from './pt-BR';
import type { Locale, PortfolioContent } from './schema';

export { enContent, ptBRContent };
export type { Locale, PortfolioContent, RouteKey } from './schema';

const contentByLocale: Record<Locale, PortfolioContent> = {
  en: enContent,
  'pt-BR': ptBRContent,
};

export function getContent(locale: Locale): PortfolioContent {
  return contentByLocale[locale];
}
