module.exports = {
    apps: [
      {
        name: 'nuxt-app',
        script: '.output/server/index.mjs',
        interpreter: 'node',
        env: {
          NODE_ENV: 'production'
        }
      }
    ],
    deploy: {
      production: {
        user: 'root',
        host: '113.45.226.28',
        ref: 'origin/main', // 你的主分支
        repo: '你的git仓库地址',
        path: '/home/你的服务器用户名/nuxt-app', // 服务器上的部署目录
        'post-deploy': 'pnpm install && pnpm build && pm2 reload ecosystem.config.js --env production'
      }
    }
  }