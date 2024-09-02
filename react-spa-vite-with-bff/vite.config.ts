import react from '@vitejs/plugin-react-swc';
import { denyImports } from 'vite-env-only';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const vars = {
  THEME_COLOR: '#656558',
  APP_NAME: 'Example',
  APP_DESCRIPTION: 'My example PWA app',
};

// set env for html template
Object.entries(vars).map(([key, value]) => {
  process.env[`VITE_${key}`] = value;
});

export default defineConfig({
  build: {
    outDir: 'dist/client',
    assetsDir: 'assets/static',
  },
  server: {
    proxy: {
      '/trpc': 'http://localhost:4000',
    },
  },
  plugins: [
    denyImports({
      client: {
        specifiers: ['fs-extra', /^node:/, '@prisma/*'],
        files: ['**/.server/*', '**/*.server.*'],
      },
    }),
    react(),
    tsconfigPaths(),
    VitePWA({
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.url.startsWith('https://example.eamon.sh/trpc/'),
            handler: 'NetworkFirst',
          },
        ],
      },
      manifest: {
        name: vars.APP_NAME,
        description: vars.APP_DESCRIPTION,
        start_url: 'https://example.eamon.sh',
        display: 'standalone',
        theme_color: vars.THEME_COLOR,
        background_color: vars.THEME_COLOR,
        icons: [
          {
            src: '/icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/vitest-setup.ts'],
    include: ['src/**/*.test.?(c|m)[jt]s?(x)'],
  },
});
