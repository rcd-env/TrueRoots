import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Some third-party packages (e.g., wallet connect libs) may reference `global` (Node) in browser.
// We map it to `globalThis` and provide minimal shims.

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
    "process.env": {},
  },
  resolve: {
    alias: {
      // Add Buffer polyfill only if later needed:
      // buffer: 'buffer'
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
        },
      },
    },
  },
  base: "/",
});
