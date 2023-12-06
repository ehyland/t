import { unstable_vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [remix(), tsconfigPaths()],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      onLog(level, log, handler) {
        if (
          log.code === 'MODULE_LEVEL_DIRECTIVE' &&
          log.message.includes('use client')
        ) {
          return;
        }
        handler(level, log);
      },
    },
  },
});
