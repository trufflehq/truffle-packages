import { defineConfig } from "tsup";

export default defineConfig({
  globalName: "TrufflePermissions",
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  minify: false,
  skipNodeModulesBundle: true,
  sourcemap: true,
  target: "es2021",
  tsconfig: "./tsconfig.json",
  keepNames: false, // keepNames: true can do some weird stuff (search keepNames in our discord)
  treeshake: true,
});
