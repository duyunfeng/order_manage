import axios from 'axios'

// 获取所有路由
export function getRoutes() {
  return axios.get('/api/routes')
}

// 添加路由
export function addRoute(data) {
  return axios.post('/api/routes', data)
}

// 编辑路由
export function updateRoute(id, data) {
  return axios.put(`/api/routes/${id}`, data)
}

// 删除路由
export function deleteRoute(id) {
  return axios.delete(`/api/routes/${id}`)
} 