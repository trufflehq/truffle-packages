import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSassToCss } from "./plugins/sass.js";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [react(), viteSassToCss()],
});
