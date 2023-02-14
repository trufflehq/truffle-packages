import { defineConfig } from 'tsup';

export default defineConfig({
  globalName: 'TruffleSDK',
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  minify: false,
  skipNodeModulesBundle: true,
  sourcemap: true,
  target: 'es2021',
  tsconfig: './tsconfig.json',
  keepNames: true,
  treeshake: true,
});
