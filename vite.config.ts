import path from 'node:path'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  cacheDir: './.vite-cache',

  plugins: [vue()],

  // 경로, 조건
  resolve: {
    conditions: ['browser'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~': path.resolve(__dirname, 'src'),
    },
  },

  // 서버 옵션 (필요하면 주석 풀어서 사용)
  server: {
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8081',
    //     changeOrigin: true,
    //   },
    // },
  },
  optimizeDeps: {
    include: ['pinia', 'axios'],
  },
})
