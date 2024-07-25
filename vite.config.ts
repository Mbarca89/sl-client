import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { resolve } from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window', // Polyfill global variable
    Buffer: ['buffer', 'Buffer'], // Polyfill Buffer
  },
  resolve: {
    alias: {
      buffer: resolve(__dirname, 'node_modules/buffer/'),
    },
  },
  base:"/",
  server: {
    open: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
})
