import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const portraitUrl = new URL(
  '../src/assets/eduardo-portrait.png',
  import.meta.url,
);
const dashboardUrl = new URL(
  '../src/assets/dona-events-dashboard.webp',
  import.meta.url,
);

test('portrait is a bounded raster with real alpha', async () => {
  const metadata = await sharp(fileURLToPath(portraitUrl)).metadata();
  const file = await stat(portraitUrl);

  assert.equal(metadata.format, 'png');
  assert.equal(metadata.hasAlpha, true);
  assert.ok((metadata.width ?? Infinity) <= 1100);
  assert.ok((metadata.height ?? Infinity) <= 1250);
  assert.ok(file.size <= 1_500_000);
});

test('portrait has no visible magenta-dominant edge pixels', async () => {
  const { data, info } = await sharp(fileURLToPath(portraitUrl))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let visibleMagentaPixels = 0;

  for (let offset = 0; offset < data.length; offset += info.channels) {
    const red = data[offset];
    const green = data[offset + 1];
    const blue = data[offset + 2];
    const alpha = data[offset + 3];
    const magentaDominance = Math.min(red, blue) - green;

    if (alpha > 8 && magentaDominance > 18) {
      visibleMagentaPixels += 1;
    }
  }

  assert.equal(
    visibleMagentaPixels,
    0,
    `portrait contains ${visibleMagentaPixels} visible magenta-dominant pixels`,
  );
});

test('Dona Events preview is a bounded webp', async () => {
  const metadata = await sharp(fileURLToPath(dashboardUrl)).metadata();
  const file = await stat(dashboardUrl);

  assert.equal(metadata.format, 'webp');
  assert.ok((metadata.width ?? Infinity) <= 1200);
  assert.ok((metadata.height ?? Infinity) <= 760);
  assert.ok(file.size <= 350_000);
});
