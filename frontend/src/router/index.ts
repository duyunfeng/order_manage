import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useUserStore } from '@/store/user'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫：用户管理仅admin可访问
router.beforeEach((to, from, next) => {
  if (to.path === '/users') {
    // 由于pinia store在setup外部无法直接用，需要用useUserStore()获取
    const userStore = useUserStore()
    if (userStore.user.role !== 'admin') {
      // 可重定向到首页或提示无权限
      return next('/')
    }
  }
  next()
})

export default router