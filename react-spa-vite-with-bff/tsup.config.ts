import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/.server/index.ts'],
  splitting: true,
  sourcemap: true,
  clean: true,
  target: 'node20',
  format: 'esm',
  outDir: 'dist/server',
  treeshake: true,
  env: {
    NODE_ENV: 'production',
  },
});
