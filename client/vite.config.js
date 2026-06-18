import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5273,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5050',
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            // Disable buffering for SSE streams
            if (proxyRes.headers['content-type']?.includes('text/event-stream')) {
              proxyRes.headers['X-Accel-Buffering'] = 'no';
            }
          });
        },
      },
    },
  },
});
