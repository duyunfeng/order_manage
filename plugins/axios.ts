// plugins/axios.ts (这是您应该主要维护的配置)

import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'

export default defineNuxtPlugin(nuxtApp => {
  const instance = axios.create({
    baseURL: '/api', // 确保你的baseURL正确指向Nuxt的API路由
    timeout: 30000, // 超时时间提升到10秒
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // === 请求拦截器：添加认证令牌 ===
  instance.interceptors.request.use(
    config => {
      // 优先从 pinia 的 userStore 获取 token，兼容 SSR
      let token = ''
      if (process.client) {
        try {
          // 通过 useUserStore 获取 token
          const userStore = useUserStore()
          token = userStore.token
        } catch (e) {
          // 兜底用 localStorage
          token = localStorage.getItem('user')
          if (token) {
            // 兼容 pinia-plugin-persistedstate 的存储结构
            try {
              const parsed = JSON.parse(token)
              token = parsed.token || ''
            } catch {}
          }
        }
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
      return config
    },
    error => {
      return Promise.reject(error)
    },
  )

  // === 响应拦截器：处理401/403错误 ===
  instance.interceptors.response.use(
    response => response,
    error => {
      console.log('error', error)
      if (error.response) {
        if (error.response.status === 401) {
          // 未授权：通常意味着令牌无效或缺失
          console.error('认证失败 (401):', error.response.data.message || '请先登录')
          console.log(process.client, 'process.client')
          // 清除本地存储的令牌
          if (process.client) {
            localStorage.removeItem('token')
            ElMessage.error('登录已过期，请重新登录')
            window.location.href = '/login'
          }
        } else if (error.response.status === 403) {
          // 禁止访问：意味着用户没有权限
          console.error('权限不足 (403):', error.response.data.message || '您没有足够的权限')
          if (process.client) {
            ElMessage.warning('您没有足够的权限进行此操作')
          }
        }
      }
      return Promise.reject(error)
    },
  )

  // 将配置好的axios实例注入到Nuxt应用程序中
  // 这样在任何地方都可以通过 `useNuxtApp().$axios` 或 `this.$axios` 访问
  nuxtApp.provide('axios', instance)
})
