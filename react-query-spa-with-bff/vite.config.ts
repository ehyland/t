import react from '@vitejs/plugin-react-swc';
import type { PluginOption } from 'vite';
import { denyImports } from 'vite-env-only';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

import * as constants from './src/app/constants';

// set env for html template
Object.entries(constants).map(([key, value]) => {
  process.env[`VITE_${key}`] = value;
});

const webManifestPlugin: PluginOption = VitePWA({
  strategies: 'generateSW',
  registerType: 'autoUpdate',
  injectRegister: 'auto',
  workbox: {
    runtimeCaching: [
      {
        urlPattern: ({ request }) =>
          request.url.startsWith(`${constants.PROD_BASE_URL}/trpc/`),
        handler: 'NetworkFirst',
      },
    ],
  },
  manifest: {
    name: constants.APP_NAME,
    short_name: constants.APP_NAME,
    description: constants.APP_DESCRIPTION,
    start_url: constants.PROD_BASE_URL,
    display: 'standalone',
    theme_color: constants.THEME_COLOR,
    background_color: constants.THEME_COLOR,
    icons: [
      {
        src: '/assets/app-icon-vbQGq2H8.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  },
});

export default defineConfig({
  build: {
    outDir: 'dist/client',
    assetsDir: 'assets/static',
  },
  plugins: [
    denyImports({
      client: {
        specifiers: ['fs-extra', /^node:/, '@prisma/*'],
        files: ['src/server/*', '**/.server/*', '**/*.server.*'],
      },
    }),
    react(),
    tsconfigPaths(),
    webManifestPlugin,
  ],
  resolve: {
    alias: {
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/app/vitest-setup.ts'],
    include: ['src/app/**/*.test.?(c|m)[jt]s?(x)'],
    passWithNoTests: true,
    env: {
      ENV: 'test',
    },
  },
});
