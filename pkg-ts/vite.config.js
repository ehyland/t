import { resolve } from 'node:path';
import { builtinModules } from 'node:module';
import { defineConfig } from 'vite';
import pkg from './package.json';
import dts from 'vite-plugin-dts';

const externals = [
  ...Object.keys({
    ...pkg.dependencies,
    ...pkg.devDependencies,
  }),
  ...builtinModules,
  ...builtinModules.map((m) => `node:${m}`),
];

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
