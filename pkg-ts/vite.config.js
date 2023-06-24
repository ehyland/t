import { resolve } from 'path';
import { defineConfig } from 'vite';
import pkg from './package.json';
import dts from 'vite-plugin-dts';

const externals = Object.keys({
  ...pkg.dependencies,
  ...pkg.devDependencies,
});

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'lib',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: externals,
    },
  },
});
