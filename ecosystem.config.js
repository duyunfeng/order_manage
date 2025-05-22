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
        repo: 'https://github.com/duyunfeng/order_manage.git',
        path: '/home/root/nuxt-app', // 服务器上的部署目录
        'post-deploy': 'pnpm install && pnpm build && pm2 reload ecosystem.config.js --env production'
      }
    }
  }