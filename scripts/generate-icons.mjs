import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const publicUrl = new URL('../public/', import.meta.url);
const logo = await readFile(new URL('logo.svg', publicUrl), 'utf8');
const favicon = logo.replace(
  /(<svg\b[^>]*>)/,
  '$1\n  <path fill="#020503" d="M0 0h1254v1254H0z" />',
);
await writeFile(new URL('favicon.svg', publicUrl), favicon);

const variants = [
  ['favicon-16x16.png', 16],
  ['favicon-32x32.png', 32],
  ['apple-touch-icon.png', 180],
  ['android-chrome-192x192.png', 192],
  ['android-chrome-512x512.png', 512],
];

function render(size) {
  return sharp(Buffer.from(favicon), { density: 192 })
    .resize(size, size)
    .png()
    .toBuffer();
}

await Promise.all(
  variants.map(async ([name, size]) => {
    await writeFile(new URL(name, publicUrl), await render(size));
  }),
);

// ICO directory followed by PNG frames, supported by modern Windows browsers.
const sizes = [16, 32, 48];
const frames = await Promise.all(sizes.map(render));
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;

frames.forEach((frame, index) => {
  const entry = 6 + index * 16;
  directory[entry] = sizes[index];
  directory[entry + 1] = sizes[index];
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(frame.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
});

await writeFile(
  new URL('favicon.ico', publicUrl),
  Buffer.concat([directory, ...frames]),
);
console.log(
  'Generated SVG, ICO (16/32/48), and PNG icons (16/32/180/192/512).',
);
