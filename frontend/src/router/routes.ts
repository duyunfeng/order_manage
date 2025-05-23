// 示例路由配置，请根据实际页面调整
import Index from '../pages/index.vue'
import Login from '../pages/login.vue'

export default [
  {
    path: '/',
    name: 'Home',
    component: Index
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { layout: 'empty' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../pages/profile/index.vue')
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../pages/users/index.vue')
  },
  {
    path: '/factories',
    name: 'Factories',
    component: () => import('../pages/factories/index.vue')
  },
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('../pages/customers/index.vue')
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../pages/orders/index.vue')
  },
  {
    path: '/goods',
    name: 'Goods',
    component: () => import('../pages/goods/index.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue'),
    meta: { layout: 'empty' }
  }
] 