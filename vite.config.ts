import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import type { Plugin } from 'vite';
import { enContent } from './src/content/en';
import { ptBRContent } from './src/content/pt-BR';
import { toLocalePath } from './src/i18n/locale-paths';
import {
  DONA_EVENTS_ANCHORS,
  EXTERNAL_URLS,
  HOME_ANCHORS,
  pageInternalLinks,
  PUBLIC_ASSETS,
} from './src/site-contract';

function publicationManifest(): Plugin {
  return {
    name: 'publication-manifest',
    generateBundle() {
      const pages = [
        {
          pathname: toLocalePath('en', 'home'),
          anchors: HOME_ANCHORS,
          internalLinks: pageInternalLinks('en', 'home'),
          externalLinks: [
            EXTERNAL_URLS.linkedin,
            EXTERNAL_URLS.linkedin,
            EXTERNAL_URLS.github,
          ],
        },
        {
          pathname: toLocalePath('en', 'donaEvents'),
          anchors: DONA_EVENTS_ANCHORS,
          internalLinks: pageInternalLinks('en', 'donaEvents'),
          externalLinks: [EXTERNAL_URLS.donaEvents],
        },
        {
          pathname: toLocalePath('pt-BR', 'home'),
          anchors: HOME_ANCHORS,
          internalLinks: pageInternalLinks('pt-BR', 'home'),
          externalLinks: [
            EXTERNAL_URLS.linkedin,
            EXTERNAL_URLS.linkedin,
            EXTERNAL_URLS.github,
          ],
        },
        {
          pathname: toLocalePath('pt-BR', 'donaEvents'),
          anchors: DONA_EVENTS_ANCHORS,
          internalLinks: pageInternalLinks('pt-BR', 'donaEvents'),
          externalLinks: [EXTERNAL_URLS.donaEvents],
        },
      ];
      this.emitFile({
        type: 'asset',
        fileName: 'build-manifest.json',
        source: `${JSON.stringify(
          {
            schemaVersion: 1,
            content: { en: enContent, 'pt-BR': ptBRContent },
            pages,
            assets: Object.values(PUBLIC_ASSETS),
          },
          null,
          2,
        )}\n`,
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), publicationManifest()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'three-vendor',
              test: /node_modules\/(?:three|@react-three)\//,
            },
          ],
        },
      },
    },
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
