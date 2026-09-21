import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'https://portofolio-ecru-alpha.vercel.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    // Don't inline large images - keep them as separate files for quality
    assetsInlineLimit: 0,
    // Optimize bundle size using built-in esbuild
    minify: "esbuild",
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ["vue"],
        },
      },
    },
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
});
