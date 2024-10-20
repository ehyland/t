import { denyImports } from 'vite-env-only';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    outDir: 'dist/server',
    target: 'node20',
  },
  define: {
    // vite is only used for production build
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  plugins: [
    denyImports({
      server: {
        files: ['src/app/*'],
        specifiers: ['vite'],
      },
    }),
    tsconfigPaths(),
  ],
});
