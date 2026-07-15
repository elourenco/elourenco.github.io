import { expect, test, type Locator, type Page } from '@playwright/test';

async function waitForDecodedImage(image: Locator) {
  await image.waitFor({ state: 'attached' });
  await image.evaluate(async (element: HTMLImageElement) => {
    if (!element.complete) {
      await new Promise<void>((resolve) => {
        element.addEventListener('load', () => resolve(), { once: true });
        element.addEventListener('error', () => resolve(), { once: true });
      });
    }

    if (element.naturalWidth > 0) await element.decode();
  });
}

async function waitForVisualReadiness(
  page: Page,
  { includeFeature = false }: { includeFeature?: boolean } = {},
) {
  await page.evaluate(() => document.fonts.ready);
  await waitForDecodedImage(page.locator('.hero-portrait img'));

  if (!includeFeature) return;

  await page.locator('.feature-card').scrollIntoViewIfNeeded();
  await waitForDecodedImage(page.locator('.feature-card__visual img'));
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
}

function trackHeavyParticleRequests(page: Page) {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (/\/(?:ParticleScene|three-vendor)-/.test(request.url())) {
      requests.push(request.url());
    }
  });
  return requests;
}

test.describe('responsive particle contracts', () => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1440, height: 1024 },
    { width: 1488, height: 1058 },
  ]) {
    test(`has no responsive horizontal overflow at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto('/en');
      await waitForVisualReadiness(page, { includeFeature: true });

      const geometry = await page.evaluate(() => ({
        viewportWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        offenders: [...document.querySelectorAll<HTMLElement>('body *')]
          .map((element) => {
            const bounds = element.getBoundingClientRect();
            return {
              className: element.className,
              left: Math.round(bounds.left),
              right: Math.round(bounds.right),
            };
          })
          .filter(
            ({ left, right }) => left < -1 || right > window.innerWidth + 1,
          )
          .slice(0, 12),
      }));

      expect(
        geometry.scrollWidth,
        JSON.stringify(geometry, null, 2),
      ).toBeLessThanOrEqual(geometry.viewportWidth);
    });
  }

  test('matches the reference viewport geometry at 1488px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1488, height: 1058 });
    await page.goto('/en');
    await waitForVisualReadiness(page, { includeFeature: true });

    const hero = await page.locator('.home-hero').boundingBox();
    const capability = await page.locator('.capability-strip').boundingBox();
    const project = await page.locator('.feature-card').boundingBox();
    const portrait = await page.locator('.hero-portrait').boundingBox();
    const rail = await page.locator('.site-header').boundingBox();
    const name = await page.locator('.home-hero__name').boundingBox();
    const summary = await page.locator('.home-hero__summary').boundingBox();
    const projectTitle = await page.locator('#work-title').boundingBox();
    const actions = await page
      .locator('.home-hero .action-cluster .button')
      .evaluateAll((links) =>
        links.map((link) => {
          const bounds = link.getBoundingClientRect();
          return {
            y: bounds.y,
            height: bounds.height,
            scrollWidth: link.scrollWidth,
            clientWidth: link.clientWidth,
          };
        }),
      );
    const railLinksFit = await page
      .locator('.desktop-section-rail .site-header__nav a')
      .evaluateAll((links) =>
        links.every((link) => link.getBoundingClientRect().right <= 132),
      );
    const railLabelGeometry = await page
      .locator('.desktop-section-rail__visible-label')
      .evaluateAll((labels) =>
        labels.map((label) => {
          const bounds = label.getBoundingClientRect();
          return {
            text: label.textContent,
            height: bounds.height,
            right: bounds.right,
            scrollWidth: label.scrollWidth,
            clientWidth: label.clientWidth,
          };
        }),
      );

    expect(hero).not.toBeNull();
    expect(capability).not.toBeNull();
    expect(project).not.toBeNull();
    expect(portrait).not.toBeNull();
    expect(rail).not.toBeNull();
    expect(name).not.toBeNull();
    expect(summary).not.toBeNull();
    expect(projectTitle).not.toBeNull();
    expect(name!.height).toBeGreaterThan(240);
    expect(summary!.width).toBeLessThanOrEqual(400);
    expect(projectTitle!.y).toBeGreaterThan(880);
    expect(projectTitle!.y).toBeLessThan(950);
    expect(actions).toHaveLength(3);
    expect(actions.every(({ height }) => height <= 48)).toBe(true);
    expect(actions[0]!.y).toBeGreaterThan(620);
    expect(actions[0]!.y).toBeLessThan(660);
    expect(new Set(actions.map(({ y }) => Math.round(y))).size).toBe(1);
    expect(
      actions.every(
        ({ scrollWidth, clientWidth }) => scrollWidth <= clientWidth,
      ),
    ).toBe(true);
    expect(railLinksFit).toBe(true);
    expect(railLabelGeometry.map(({ text }) => text)).toEqual([
      'Home',
      'Work',
      'Expertise',
      'Career',
      'Contact',
    ]);
    expect(
      railLabelGeometry.every(
        ({ height, right, scrollWidth, clientWidth }) =>
          height < 20 && right <= 132 && scrollWidth <= clientWidth,
      ),
    ).toBe(true);
    await expect(
      page
        .locator('.desktop-section-rail')
        .getByRole('link', { name: 'Selected work' }),
    ).toHaveAttribute('href', '#work');
    expect(project!.y).toBeLessThan(1058);
    expect(project!.y).toBeLessThan(900);
    expect(capability!.y).toBeLessThan(760);
    expect(capability!.y + capability!.height).toBeLessThan(1058);
    expect(portrait!.x).toBeGreaterThanOrEqual(680);
    expect(portrait!.x).toBeLessThanOrEqual(735);
    expect(portrait!.width).toBeGreaterThanOrEqual(680);
    expect(rail!.width).toBeLessThanOrEqual(132);
  });

  test('shows the compact header and hides the desktop rail at 1024px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/en');
    await waitForVisualReadiness(page);

    await expect(page.locator('.desktop-section-rail')).toBeHidden();
    await expect(page.locator('.mobile-site-header')).toBeVisible();
    await expect(page.locator('.site-header')).toHaveCSS('position', 'sticky');
  });

  test('keeps Portuguese rail labels single-line, accessible, and inside 132px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1488, height: 1058 });
    await page.goto('/pt-br');
    await waitForVisualReadiness(page);

    const rail = page.locator('.desktop-section-rail');
    const labels = await rail
      .locator('.desktop-section-rail__visible-label')
      .evaluateAll((elements) =>
        elements.map((element) => {
          const bounds = element.getBoundingClientRect();
          return {
            text: element.textContent,
            right: bounds.right,
            height: bounds.height,
            scrollWidth: element.scrollWidth,
            clientWidth: element.clientWidth,
          };
        }),
      );

    expect(labels.map(({ text }) => text)).toEqual([
      'Início',
      'Trabalhos',
      'Especialidades',
      'Carreira',
      'Contato',
    ]);
    expect(
      labels.every(
        ({ right, height, scrollWidth, clientWidth }) =>
          right <= 132 && height < 20 && scrollWidth <= clientWidth,
      ),
    ).toBe(true);
    await expect(
      rail.getByRole('link', { name: 'Trabalhos selecionados' }),
    ).toHaveAttribute('href', '#work');
  });

  test('keeps the responsive mobile menu visible and restores focus on Escape', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en');

    const toggle = page.locator('.mobile-site-header__toggle');
    await toggle.click();

    const primary = page.getByRole('navigation', { name: 'Primary' });
    await expect(primary).toBeVisible();
    const links = primary.getByRole('link');
    await expect(links).toHaveCount(5);
    for (const link of await links.all()) {
      await expect(link).toBeVisible();
    }

    await page.keyboard.press('Escape');
    await expect(primary).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test('does not mount the particle canvas with reduced motion', async ({
    page,
  }) => {
    const heavyParticleRequests = trackHeavyParticleRequests(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/en');

    await expect(page.getByTestId('particle-canvas')).toHaveCount(0);
    await expect(
      page.getByRole('link', { name: 'Connect on LinkedIn' }),
    ).toBeVisible();
    expect(heavyParticleRequests).toEqual([]);
  });

  for (const constrainedProfile of [
    {
      label: 'Save-Data',
      memoryGb: 8,
      saveData: true,
      viewport: { width: 390, height: 844 },
    },
    {
      label: 'low memory desktop',
      memoryGb: 2,
      saveData: false,
      viewport: { width: 1440, height: 1024 },
    },
  ]) {
    test(`keeps semantic hero available under the ${constrainedProfile.label} gate`, async ({
      page,
    }) => {
      const heavyParticleRequests = trackHeavyParticleRequests(page);
      await page.setViewportSize(constrainedProfile.viewport);
      await page.addInitScript(({ memoryGb, saveData }) => {
        Object.defineProperty(navigator, 'deviceMemory', {
          configurable: true,
          value: memoryGb,
        });
        Object.defineProperty(navigator, 'connection', {
          configurable: true,
          value: { saveData },
        });
      }, constrainedProfile);
      await page.goto('/en');
      await page.waitForTimeout(1_300);

      await expect(page.getByTestId('particle-canvas')).toHaveCount(0);
      await expect(
        page.getByRole('img', { name: 'Portrait of Eduardo Lourenco' }),
      ).toBeVisible();
      await expect(
        page.getByRole('link', { name: 'View selected work' }),
      ).toBeVisible();
      await expect(page.locator('.site-header')).toBeVisible();
      expect(heavyParticleRequests).toEqual([]);
    });
  }

  test('has zero application errors and request failures on the eligible home', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];
    const pageErrors: string[] = [];
    const requestFailures: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
      if (message.type() === 'warning') consoleWarnings.push(message.text());
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('requestfailed', (request) => {
      requestFailures.push(
        `${request.url()}: ${request.failure()?.errorText ?? 'unknown failure'}`,
      );
    });

    await page.setViewportSize({ width: 1440, height: 1024 });
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'deviceMemory', {
        configurable: true,
        value: 8,
      });
    });
    await page.goto('/en');
    await waitForVisualReadiness(page);
    await page.waitForTimeout(1_300);

    expect({ consoleErrors, pageErrors, requestFailures }).toEqual({
      consoleErrors: [],
      pageErrors: [],
      requestFailures: [],
    });
    expect(
      consoleWarnings.filter(
        (warning) =>
          !/GPU stall due to ReadPixels/.test(warning) &&
          !/THREE\.THREE\.Clock: This module has been deprecated/.test(warning),
      ),
    ).toEqual([]);
  });

  test('keeps primary calls to action visible without WebGL', async ({
    page,
  }) => {
    const heavyParticleRequests = trackHeavyParticleRequests(page);
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
    await expect(
      page.getByRole('img', { name: 'Portrait of Eduardo Lourenco' }),
    ).toBeVisible();
    await expect(page.locator('.site-header')).toBeVisible();
    await expect(page.getByTestId('particle-canvas')).toHaveCount(0);
    expect(heavyParticleRequests).toEqual([]);
  });

  test('preserves content and CTAs after WebGL context loss', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'desktop-chromium',
      'context loss requires the desktop WebGL-eligible profile',
    );
    await page.setViewportSize({ width: 1440, height: 1024 });
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'deviceMemory', {
        configurable: true,
        value: 8,
      });
    });
    await page.goto('/en');
    await page.locator('.home-hero__visual').scrollIntoViewIfNeeded();

    const webglAvailable = await page.evaluate(() => {
      const probe = document.createElement('canvas');
      return Boolean(probe.getContext('webgl2') ?? probe.getContext('webgl'));
    });
    test.skip(!webglAvailable, 'browser has no WebGL implementation');

    const canvas = page.locator('canvas');
    await expect(canvas).toHaveCount(1, { timeout: 5_000 });
    await expect
      .poll(
        async () => {
          if ((await canvas.count()) !== 1) return false;
          return canvas.evaluate((element) => {
            const contextLoss = new Event('webglcontextlost', {
              cancelable: true,
            });
            element.dispatchEvent(contextLoss);
            return contextLoss.defaultPrevented;
          });
        },
        { timeout: 5_000 },
      )
      .toBe(true);
    await expect(canvas).toHaveCount(0);

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /Principal Software Engineer/,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('img', { name: 'Portrait of Eduardo Lourenco' }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'View selected work' }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Connect on LinkedIn' }),
    ).toBeVisible();
    await expect(page.locator('.site-header')).toBeVisible();
  });

  test('mounts at most one canvas after the idle gate opens', async ({
    page,
  }) => {
    const heavyParticleRequests = trackHeavyParticleRequests(page);
    await page.setViewportSize({ width: 1440, height: 1024 });
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
      expect(heavyParticleRequests).toHaveLength(1);
      expect(heavyParticleRequests[0]).toContain('/ParticleScene-');

      const visual = await page.locator('.home-hero__visual').boundingBox();
      const host = await page.locator('.home-hero__particles').boundingBox();
      const content = await page.locator('.home-hero__content').boundingBox();
      expect(visual).not.toBeNull();
      expect(host).not.toBeNull();
      expect(content).not.toBeNull();
      expect(host!.width).toBeGreaterThan(0);
      expect(host!.height).toBeGreaterThan(0);
      expect(host!.x).toBeGreaterThan(visual!.x);
      expect(host!.width).toBeLessThan(visual!.width);
      expect(host!.x).toBeGreaterThanOrEqual(content!.x + content!.width);
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
