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
  test: {
    globals: true,
    environment: 'node',
    include: ['src/server/**/*.test.?(c|m)[jt]s?(x)'],
    setupFiles: ['./src/server/test-utils/vitest-setup.ts'],
    passWithNoTests: true,
    env: {
      ENV: 'test',
    },
  },
});
