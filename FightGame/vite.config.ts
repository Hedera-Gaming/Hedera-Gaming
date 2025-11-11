import { defineConfig } from "vite";
// Use the standard React plugin (esbuild) to avoid native SWC binding issues on
// systems with Node versions that don't match prebuilt @swc/core binaries.
import react from "@vitejs/plugin-react";
import path from "path";
// removed lovable-tagger to prevent Lovable branding/logo from being injected

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
