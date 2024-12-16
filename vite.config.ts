import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      buffer: "buffer", // Alias correcto para la biblioteca `buffer`
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Define las variables globales necesarias
      define: {
        global: "globalThis", // Polyfill para `global`
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true, // Activa el polyfill de Buffer
        }),
      ],
    },
  },
  base: "/",
  server: {
    open: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
});
