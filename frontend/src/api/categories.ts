import axios from 'axios'

// 获取所有类目
export function getCategories() {
  return axios.get('/categories')
}

// 添加类目
export function addCategory(data) {
  return axios.post('/categories', data)
}

// 编辑类目
export function updateCategory(id, data) {
  return axios.put(`/categories/${id}`, data)
}

// 删除类目
export function deleteCategory(id) {
  return axios.delete(`/categories/${id}`)
} 