import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    // Frame PNGs/WebPs are served from /public. Keep the dev server from
    // trying to watch or transform them (restart Vite after replacing frames).
    watch: {
      ignored: [
        '**/public/hodu-frames/**',
        '**/public/hodu-frames-lite/**',
        '**/public/stills/**',
      ],
    },
  },
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap'],
        },
      },
    },
  },
});
