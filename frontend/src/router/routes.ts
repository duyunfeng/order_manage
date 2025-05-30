// 示例路由配置，请根据实际页面调整
import Index from '../pages/index.vue'
import Login from '../pages/login.vue'

export default [
  {
    path: '/system',
    name: 'SystemSetting',
    component: () => import('../pages/system/index.vue'),
    meta: { icon: 'Setting', title: '系统设置', index: 99, show: true },
    children: [
      {
        path: 'user',
        name: 'UserSetting',
        component: () => import('../pages/profile/index.vue'),
        meta: { icon: 'UserFilled', title: '用户设置', index: 1, show: true }
      },
      {
        path: 'menu',
        name: 'MenuSetting',
        component: () => import('../pages/system/menu.vue'),
        meta: { icon: 'Menu', title: '菜单设置', index: 2, show: true }
      }
    ]
  },
  {
    path: '/',
    name: 'Home',
    component: Index,
    meta: { icon: 'HomeFilled', title: '首页', index: 0, show: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { layout: 'empty' }
  },
  {
    path: '/factories',
    name: 'Factories',
    component: () => import('../pages/factories/index.vue'),
    meta: { icon: 'OfficeBuilding', title: '工厂资料', index: 4, show: true }
  },
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('../pages/customers/index.vue'),
    meta: { icon: 'User', title: '客户管理', index: 3, show: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../pages/orders/index.vue'),
    meta: { icon: 'Document', title: '订单管理', index: 2, show: true }
  },
  {
    path: '/goods',
    name: 'Goods',
    component: () => import('../pages/goods/index.vue'),
    meta: { icon: 'ShoppingCart', title: '商品管理', index: 1, show: true }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('../pages/categories/index.vue'),
    meta: { icon: 'Collection', title: '类目管理', index: 5, show: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue'),
    meta: { layout: 'empty' }
  }
] 