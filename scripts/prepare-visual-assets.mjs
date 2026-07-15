import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const [portraitInput, dashboardInput] = process.argv.slice(2);
if (!portraitInput || !dashboardInput) {
  throw new Error(
    'Usage: node scripts/prepare-visual-assets.mjs <portrait> <dashboard>',
  );
}

const { data, info } = await sharp(portraitInput)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let offset = 0; offset < data.length; offset += info.channels) {
  const red = data[offset];
  const green = data[offset + 1];
  const blue = data[offset + 2];
  const originalAlpha = data[offset + 3];
  const distance = Math.hypot(red - 255, green, blue - 255);
  const matte = Math.max(0, Math.min(1, (distance - 24) / 72));

  data[offset + 3] = Math.round(originalAlpha * matte);
  if (matte < 1) {
    const spill = Math.max(0, Math.min(red, blue) - green);
    data[offset] = Math.max(0, red - spill * (1 - matte));
    data[offset + 2] = Math.max(0, blue - spill * (1 - matte));
  }
}

await sharp(data, {
  raw: {
    width: info.width,
    height: info.height,
    channels: info.channels,
  },
})
  .resize(1024, 1240, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
    withoutEnlargement: true,
  })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(
    fileURLToPath(
      new URL('../src/assets/eduardo-portrait.png', import.meta.url),
    ),
  );

await sharp(dashboardInput)
  .resize(1120, 700, { fit: 'cover', position: 'centre' })
  .webp({ quality: 86, effort: 6 })
  .toFile(
    fileURLToPath(
      new URL('../src/assets/dona-events-dashboard.webp', import.meta.url),
    ),
  );
