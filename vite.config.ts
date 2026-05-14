import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    port: 5173
  },
  preview: {
    host: true,
    port: 4173
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1300,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/phaser')) {
            return 'vendor-phaser';
          }

          if (id.includes('node_modules/@capacitor')) {
            return 'vendor-capacitor';
          }

          if (id.includes('node_modules')) {
            return 'vendor';
          }

          if (id.includes('/src/game/content/')) {
            return 'game-content';
          }
        }
      }
    }
  }
});
