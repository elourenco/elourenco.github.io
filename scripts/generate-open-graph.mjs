import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const publicUrl = new URL('../public/', import.meta.url);
const logo = (await readFile(new URL('logo.svg', publicUrl), 'utf8')).replace(
  '<svg ',
  '<svg x="878" y="158" width="260" height="260" ',
);

const cards = [
  {
    file: 'og-home.png',
    label: 'SOFTWARE ARCHITECTURE / AI / MOBILE',
    title: ['EDUARDO', 'LOURENCO'],
    subtitle: 'Principal AI System Architect',
    footer: 'SYSTEMS THINKING. PRODUCTION ENGINEERING.',
  },
  {
    file: 'og-dona-events.png',
    label: 'SELECTED WORK / AI-POWERED EVENT PLATFORM',
    title: ['DONA', 'EVENTS'],
    subtitle: 'Creator &amp; Principal Engineer',
    footer: 'BUILT END TO END BY EDUARDO LOURENCO',
  },
];

for (const card of cards) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <radialGradient id="glow"><stop stop-color="#a8ff3e" stop-opacity=".13"/><stop offset="1" stop-color="#a8ff3e" stop-opacity="0"/></radialGradient>
      <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M42 0H0V42" fill="none" stroke="#a8ff3e" stroke-opacity=".055"/></pattern>
    </defs>
    <path fill="#020503" d="M0 0h1200v630H0z"/>
    <path fill="url(#grid)" d="M0 0h1200v630H0z"/>
    <circle cx="1005" cy="290" r="335" fill="url(#glow)"/>
    <path stroke="#a8ff3e" stroke-width="4" d="M64 64h56"/>
    <text x="64" y="111" font-family="Arial, Helvetica, sans-serif" font-size="15" letter-spacing="2" fill="#a8ff3e">${card.label}</text>
    <text x="58" y="259" font-family="Arial, Helvetica, sans-serif" font-size="100" font-weight="800" letter-spacing="-4" fill="#f2f0e9">${card.title[0]}</text>
    <text x="58" y="361" font-family="Arial, Helvetica, sans-serif" font-size="100" font-weight="800" letter-spacing="-4" fill="#f2f0e9">${card.title[1]}</text>
    <text x="64" y="421" font-family="Arial, Helvetica, sans-serif" font-size="29" fill="#a8ff3e">${card.subtitle}</text>
    <path d="M824 158v272" stroke="#a8ff3e" stroke-opacity=".2"/>
    ${logo}
    <path d="M64 508h1072" stroke="#f2f0e9" stroke-opacity=".16"/>
    <text x="64" y="552" font-family="Arial, Helvetica, sans-serif" font-size="12" letter-spacing="1.5" fill="#a5aaa3">${card.footer}</text>
    <text x="1136" y="552" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="19" fill="#f2f0e9">eduardolourenco.dev</text>
  </svg>`;
  await writeFile(
    new URL(card.file, publicUrl),
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer(),
  );
  console.log(`Generated ${card.file} (1200 × 630).`);
}
