// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['@/assets/main.scss'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@pinia/nuxt',
  ],
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api',
    }
  },
  nitro: {
    rollupConfig: { // 注意这里是 rollupConfig 而不是直接 rollup，这是 Nitro 的内部配置
      external: [
        // 核心 Prisma 客户端，确保它不会被 Rollup 错误打包
        '@prisma/client',
        // 匹配 @prisma/client 下的所有子路径
        // 这包括 Prisma 客户端可能动态加载的引擎文件等
        /^@prisma\/client\/.*$/,
        // 如果你的项目中直接引用了 'prisma' 包（而非 @prisma/client）也外部化
        'prisma',
        // 尝试外部化可能涉及到的 prisma engine 路径
        // 这通常是 Prisma 客户端用来加载其查询引擎二进制文件的路径
        // 具体路径可能因操作系统和 Prisma 版本而异，但通常在 .prisma/client 目录下
        // 比如：node_modules/.prisma/client/query-engine-windows.dll (Windows)
        // 或 node_modules/.prisma/client/libquery_engine-linux-*.so (Linux)
        // 这里的路径需要根据你实际的 node_modules 结构和错误栈中的提示来调整
        // 基于错误信息，可能需要外部化类似 `.prisma` 这样的内部引用
        // 但由于 `.prisma` 不是一个标准的包名，直接外部化它可能无效
        // 更好的做法是外部化 @prisma/client 内部所有可能被误解的路径
        // 比如，你可以在本地 .output/server/node_modules/@prisma/client 目录
        // 查找是否有类似 'default.js' 引用了什么奇怪的路径
        // 也可以尝试外部化 Prisma 引擎文件，这些文件通常位于：
        // node_modules/.prisma/client/runtime/
        // 例如：
        // './node_modules/.prisma/client/runtime/query_engine-windows.dll', // Windows
        // './node_modules/.prisma/client/runtime/libquery_engine-linux-glibc-eabi.so', // Linux
        // 如果错误指向 '.prisma' 但它不是文件路径，而是模块名，则说明 Rollup/Nitro 的解析器混淆了
      ],
      // 明确告诉 Rollup 某些模块即使没有直接 export，也可能产生副作用，需要保留
      // 这可以帮助解决一些构建时被“tree-shaking”掉，但运行时又需要的依赖
      // moduleSideEffects: [
      //   // 确保 Prisma 客户端及其相关部分被正确处理，即使没有直接 export
      //   '@prisma/client',
      //   'prisma',
      //   // 可能还需要添加其他相关的依赖，例如 @element-plus/icons-vue 等
      //   // 如果你在其他地方也遇到模块找不到的问题
      // ],
    },
    // 确保你的 Node.js 版本兼容性
    esbuild: {
      target: 'node18' // 或者你实际使用的 Node.js LTS 版本
    }
  },
  vite: {
    build: {
      sourcemap: false, // 禁用客户端和SSR构建的Sourcemap
      // 如果需要调整大文件警告阈值
      chunkSizeWarningLimit: 1000, // 例如，将警告阈值提高到 1000 kB
    }
  },
  build: {
    transpile: [
      'element-plus', // 之前可能已经添加过，确保有
      '@popperjs/core', // <-- 添加这一行
    ],
  },
})