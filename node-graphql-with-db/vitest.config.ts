import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths() as any],
  resolve: {
    alias: {
      graphql: "graphql/index.js",
    },
  },
  test: {
    env: {
      ENV: "test",
      PORT: "3000",
    },
    // ...
  },
});
