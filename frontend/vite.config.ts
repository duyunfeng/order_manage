import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const baseUrl = env.VITE_BASE_URL || 'http://localhost:3000'
  console.log('VITE_BASE_URL:', env.VITE_BASE_URL)
  return {
    plugins: [vue()],
    server: {
      port: 8080,
      proxy: {
        '/api': {
          target: baseUrl,
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
  }
})