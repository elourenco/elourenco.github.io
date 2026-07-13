import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { enContent, ptBRContent } from '../../content';
import { DonaEventsPage } from './DonaEventsPage';

afterEach(cleanup);

describe('DonaEventsPage', () => {
  it('renders the public English case without proprietary disclosures', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/en/projects/dona-events']}>
        <DonaEventsPage content={enContent} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Dona Events' }),
    ).toBeVisible();
    expect(screen.getByText('Creator & Principal Engineer')).toBeVisible();
    expect(screen.getByText(/35k\+ events created/i)).toBeVisible();
    expect(
      screen.getByRole('link', { name: 'Visit Dona Events' }),
    ).toHaveAttribute('href', 'https://dona.events');
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    expect(container).not.toHaveTextContent(
      /provider|model latency|internal architecture|private metric/i,
    );
  });

  it('renders the equivalent public Portuguese case on its canonical locale', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/pt-br/projetos/dona-events']}>
        <DonaEventsPage content={ptBRContent} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Dona Events' }),
    ).toBeVisible();
    expect(screen.getByText('Creator & Principal Engineer')).toBeVisible();
    expect(screen.getByText(/35 mil\+ eventos criados/i)).toBeVisible();
    expect(
      screen.getByRole('link', { name: 'Visitar Dona Events' }),
    ).toHaveAttribute('href', 'https://dona.events');
    expect(
      screen.getByRole('navigation', { name: 'Navegação principal' }),
    ).toBeVisible();
    expect(container).not.toHaveTextContent(
      /provedor|latência de modelo|arquitetura interna|métrica privada/i,
    );
  });
});
