import { defineConfig } from 'vite';
export default defineConfig({
  root: 'app',
  base: './',
  publicDir: 'public',
  build: { outDir: '../dist', emptyOutDir: true, assetsInlineLimit: 0 },
  server: { host: true, port: 5173 },
});
