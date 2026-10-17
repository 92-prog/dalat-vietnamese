/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages에서는 /<저장소 이름>/ 아래에서 열리므로 배포할 때 BASE_PATH로 넘겨 준다.
const base = process.env.BASE_PATH ?? '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/apple-touch-icon.png'],
      manifest: {
        name: '달랏 베트남어',
        short_name: '달랏 베트남어',
        description: '달랏 생활을 위한 베트남어 — 성조, 생활 문장, 간격 반복 복습',
        lang: 'ko',
        theme_color: '#1f6f5c',
        background_color: '#f6f4ef',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,webmanifest,m4a}'],
      },
    }),
  ],
  test: {
    include: ['tests/**/*.test.ts'],
  },
})
