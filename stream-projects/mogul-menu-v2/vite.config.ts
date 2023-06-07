import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSassToCss } from "./plugins/sass.js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteSassToCss()],
});
