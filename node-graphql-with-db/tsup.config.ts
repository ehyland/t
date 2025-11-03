import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server/index.ts"],
  outDir: "dist/server",
  format: "esm",
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: false,
});
