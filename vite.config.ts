import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'] },
      manifest: {
        name: 'ICTOB Prep Lab — আইসিটি প্রস্তুতি ল্যাব',
        short_name: 'ICTOB Prep',
        description: 'Free offline Bangla + English practice lab for ICT Olympiad Bangladesh: MCQ practice, timed mock tests and interactive algorithm labs.',
        theme_color: '#4338ca',
        background_color: '#eef2ff',
        display: 'standalone',
        lang: 'bn',
        start_url: '/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
