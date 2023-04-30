import { defineConfig } from "tsup";
import { relative, resolve as resolveDir } from "node:path";
import { esbuildPluginFilePathExtensions } from "esbuild-plugin-file-path-extensions";

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/**/*.ts"],
  format: ["esm", "cjs"],
  minify: false,
  skipNodeModulesBundle: true,
  sourcemap: true,
  target: "es2020",
  tsconfig: relative(__dirname, resolveDir(process.cwd(), "tsconfig.json")),
  keepNames: false, // keepNames: true can do some weird stuff (search keepNames in our discord)
  treeshake: true,
  bundle: true,
  esbuildPlugins: [esbuildPluginFilePathExtensions()],
});
