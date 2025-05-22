// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['@/assets/main.scss'],
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/image',
  ],
  
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api',
    }
  },

  nitro: {
    minify: true,
    compressPublicAssets: true,
    routeRules: {
      '/**': { swr: true },
      '/api/**': { swr: false },
    },
    rollupConfig: {
      external: ['@prisma/client', 'prisma'],
    }
  },

  vite: {
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'element-plus': ['element-plus'],
            'vendor': [
              'vue',
              'vue-router',
              'pinia',
            ],
          },
        },
      },
    },
    optimizeDeps: {
      include: [
        'vue',
        'pinia',
        'element-plus',
      ],
    },
  },

  build: {
    transpile: ['element-plus/es'],
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
  },
})