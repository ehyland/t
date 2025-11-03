import viteTsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig(() => ({
  plugins: [viteTsconfigPaths()],
  resolve: {
    alias: {
      graphql: "graphql/index.js",
    },
  },
  mode: "server",
  build: {
    ssr: true,
    outDir: "dist/server",
    copyPublicDir: false,
    emptyOutDir: true,
    rollupOptions: {
      input: "src/server/index.ts",
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
  test: {
    env: {
      ENV: "test",
      PORT: "3000",
    },
    // ...
  },
}));
