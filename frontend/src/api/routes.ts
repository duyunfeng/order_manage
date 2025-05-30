import axios from '../plugins/axios'

// 获取所有路由
export function getRoutes() {
  return axios.get('/routes')
}

// 添加路由
export function addRoute(data) {
  return axios.post('/routes', data)
}

// 编辑路由
export function updateRoute(id, data) {
  return axios.put(`/routes/${id}`, data)
}

// 删除路由
export function deleteRoute(id) {
  return axios.delete(`/routes/${id}`)
} 