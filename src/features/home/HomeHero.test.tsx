import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { enContent, ptBRContent } from '../../content';
import { HomeHero } from './HomeHero';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('HomeHero', () => {
  it('combines the English name and role in the accessible heading', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

    render(<HomeHero content={enContent} />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Eduardo Lourenco Principal Software Engineer',
      }),
    ).toBeVisible();
  });

  it('preserves Portuguese disciplines and the three destination contracts', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

    render(<HomeHero content={ptBRContent} />);

    expect(
      screen.getByText('IA · Mobile · Arquitetura de Software'),
    ).toBeVisible();

    const hero = screen.getByRole('region', {
      name: 'Eduardo Lourenco Principal Software Engineer',
    });
    expect(
      within(hero).getByRole('link', { name: 'Ver trabalhos' }),
    ).toHaveAttribute('href', '#work');
    expect(
      within(hero).getByRole('link', { name: 'Conectar no LinkedIn' }),
    ).toHaveAttribute('href', 'https://www.linkedin.com/in/dudulourenco');
    expect(
      within(hero).getByRole('link', { name: 'Baixar currículo' }),
    ).toHaveAttribute('href', '/cv-eduardo-lourenco-pt-br.pdf');
    expect(
      within(hero).getByRole('link', { name: 'Baixar currículo' }),
    ).toHaveAttribute('download');
  });

  it('keeps the particle surface outside the portrait figure', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

    const { container } = render(<HomeHero content={enContent} />);
    const visual = container.querySelector('.home-hero__visual');
    const portrait = visual?.querySelector('figure');
    const particles = visual?.querySelector('.home-hero__particles');

    expect(visual).toBeInTheDocument();
    expect(portrait).toBeInTheDocument();
    expect(particles).toBeInTheDocument();
    expect(portrait).not.toContainElement(particles as HTMLElement);
  });
});
