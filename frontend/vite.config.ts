import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const baseUrl = process.env.VITE_BASE_URL || 'http://113.45.226.28:3000'
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'baseUrl',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api'),
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@api': '/src/api',
      '@store': '/src/store'
    }
  }
})