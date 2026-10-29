import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Nexora Digital Asset Exchange',
        short_name: 'Nexora',
        description: 'Secure digital asset trading experience',
        theme_color: '#0b0e14',
        background_color: '#0b0e14',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/pwa-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: '/pwa-512.svg', sizes: '512x512', type: 'image/svg+xml' },
        ],
      },
      workbox: {
        globIgnores: ['**/runtime-config.json'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/market'),
            handler: 'NetworkFirst',
            options: { cacheName: 'market-data', networkTimeoutSeconds: 3 },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@app': '/src/app',
      '@features': '/src/features',
      '@shared': '/src/shared',
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
      '/ws': { target: 'ws://localhost:4000', changeOrigin: true, ws: true },
    },
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
          query: ['@tanstack/react-query', 'axios'],
          forms: ['react-hook-form', 'yup', '@hookform/resolvers'],
          motion: ['framer-motion'],
          state: ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          i18n: ['i18next', 'react-i18next'],
          icons: ['lucide-react'],
          virtual: ['react-virtuoso'],
        },
      },
    },
  },
});
