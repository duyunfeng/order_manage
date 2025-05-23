// plugins/axios.ts (这是您应该主要维护的配置)

import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

let is401Handling = false

// 请求拦截器：自动携带 token
instance.interceptors.request.use(
  config => {
    let token = ''
    try {
      // 优先从pinia user store取token
      if (window.__pinia) {
        const stores = window.__pinia._s
        for (const store of stores.values()) {
          if (store.token && typeof store.token === 'object' && 'value' in store.token) {
            token = store.token.value
            break
          }
        }
      }
      if (!token) {
        token = localStorage.getItem('token') || ''
      }
    } catch {}
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器：处理 401/403
instance.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        if (!is401Handling) {
          is401Handling = true
          localStorage.removeItem('token')
          ElMessage.error('登录已过期，请重新登录')
          setTimeout(() => {
            window.location.href = '/login'
            is401Handling = false
          }, 500)
        }
      } else if (error.response.status === 403) {
        ElMessage.warning('您没有足够的权限进行此操作')
      }
    }
    return Promise.reject(error)
  }
)

export default instance
