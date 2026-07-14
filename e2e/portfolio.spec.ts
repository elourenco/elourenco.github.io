import { expect, test } from '@playwright/test';

test.describe('responsive particle contracts', () => {
  test('shows the desktop rail and constructed-reality hero', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1024 });
    await page.goto('/en');

    await expect(page.locator('.desktop-section-rail')).toBeVisible();
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /Principal Software Engineer/,
      }),
    ).toBeVisible();
  });

  test('shows the mobile header without horizontal overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en');

    await expect(page.locator('.mobile-site-header')).toBeVisible();
    await expect(page.locator('.desktop-section-rail')).toBeHidden();
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      )
      .toBe(true);
  });

  test('does not mount the particle canvas with reduced motion', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/en');

    await expect(page.getByTestId('particle-canvas')).toHaveCount(0);
    await expect(
      page.getByRole('link', { name: 'Connect on LinkedIn' }),
    ).toBeVisible();
  });

  test('keeps primary calls to action visible without WebGL', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
        configurable: true,
        value(contextId: string, ...args: unknown[]) {
          if (contextId === 'webgl' || contextId === 'webgl2') return null;
          return originalGetContext.call(this, contextId, ...args);
        },
      });
    });
    await page.goto('/en');

    await expect(
      page.getByRole('link', { name: 'View selected work' }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Connect on LinkedIn' }),
    ).toBeVisible();
    await expect(page.getByTestId('particle-canvas')).toHaveCount(0);
  });

  test('mounts at most one canvas after the idle gate opens', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'deviceMemory', {
        configurable: true,
        value: 8,
      });
    });
    await page.goto('/en');
    await page.locator('.home-hero__visual').scrollIntoViewIfNeeded();

    await expect
      .poll(() => page.locator('canvas').count(), { timeout: 5_000 })
      .toBeLessThanOrEqual(1);

    const webglAvailable = await page.evaluate(() => {
      const probe = document.createElement('canvas');
      return Boolean(probe.getContext('webgl2') ?? probe.getContext('webgl'));
    });
    if (webglAvailable) {
      await expect.poll(() => page.locator('canvas').count()).toBe(1);
    }
  });

  test('keeps semantic content interactive below the hero', async ({
    page,
  }) => {
    await page.goto('/en');
    const projectLink = page.getByRole('link', { name: 'Explore Dona Events' });

    await projectLink.scrollIntoViewIfNeeded();
    await expect(projectLink).toBeVisible();
    await projectLink.click();
    await expect(page).toHaveURL('/en/projects/dona-events');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Dona Events' }),
    ).toBeVisible();
  });
});

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
  await page.getByRole('link', { name: 'PT-BR', exact: true }).click();
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

test('keeps one localized description across route navigation', async ({
  page,
}) => {
  await page.goto('/en');
  const descriptions = page.locator('meta[name="description"]');
  await expect(descriptions).toHaveCount(1);
  await expect(descriptions).toHaveAttribute('content', /focused on AI/);

  await page.getByRole('link', { name: 'PT-BR', exact: true }).click();
  await expect(page).toHaveURL('/pt-br');
  await expect(descriptions).toHaveCount(1);
  await expect(descriptions).toHaveAttribute('content', /com foco em IA/);
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
