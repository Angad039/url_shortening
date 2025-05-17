// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    // svgr(),      // uncomment if you need to import SVGs as React components
  ],
  server: {
    // force file-watch polling (ensures rebuild on every save)
    watch: {
      usePolling: true
    },
    // enable Hot Module Replacement
    hmr: true,
    // you can also tweak host/port here:
    // host: '0.0.0.0',
    // port: 3000,
  },
  build: {
    // bump the chunk-size warning limit to 1000 kB
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // example manual chunk splitting:
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion'],
        }
      }
    }
  }
})
