import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  outExtension: () => ({ js: `.mjs` }),
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: false,
});
