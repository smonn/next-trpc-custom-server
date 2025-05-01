import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/server.ts"],
  format: ["esm"],
  target: "node20",
  clean: true,
  sourcemap: true,
  minify: !options.watch,
  ignoreWatch: [".next"],
  tsconfig: "tsconfig.server.json",
  onSuccess: options.watch
    ? "node --enable-source-maps ./dist/server.js"
    : undefined,
  ...options,
}));
