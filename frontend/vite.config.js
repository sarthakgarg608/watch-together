// vite.config.js
// ------------------------------------------------------
// Vite configuration.
// Tailwind CSS is integrated through the Vite plugin.
// ------------------------------------------------------

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
});