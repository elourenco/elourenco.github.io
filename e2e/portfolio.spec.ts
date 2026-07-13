import { expect, test } from '@playwright/test';

const routes = [
  '/en',
  '/en/projects/dona-events',
  '/pt-br',
  '/pt-br/projetos/dona-events',
] as const;

for (const route of routes) {
  test(`loads ${route} directly`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://elourenco.github.io${route}`,
    );
  });
}

test('switches locale without losing the Dona route', async ({ page }) => {
  await page.goto('/en/projects/dona-events');
  await page.getByRole('link', { name: 'PT-BR' }).click();
  await expect(page).toHaveURL('/pt-br/projetos/dona-events');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Dona Events',
  );
});

test('round-trips equivalent project routes', async ({ page }) => {
  await page.goto('/pt-br/projetos/dona-events');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL('/en/projects/dona-events');
  await page.getByRole('link', { name: 'PT-BR' }).click();
  await expect(page).toHaveURL('/pt-br/projetos/dona-events');
});

test('renders a localized wildcard page', async ({ page }) => {
  await page.goto('/pt-br/rota-inexistente');
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  await expect(page.getByText('Página não encontrada.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'English' })).toHaveAttribute(
    'href',
    '/en',
  );
});

test('restores a transported GitHub Pages deep link', async ({ page }) => {
  await page.goto('/?p=%2Fpt-br%2Fprojetos%2Fdona-events');
  await expect(page).toHaveURL('/pt-br/projetos/dona-events');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Dona Events',
  );
});

test('remains usable without WebGL', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: () => null,
    });
  });
  await page.goto('/en');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Connect on LinkedIn' }),
  ).toBeVisible();
});
