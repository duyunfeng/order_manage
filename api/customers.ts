import { useNuxtApp } from '#app'

/**
 * 获取客户列表
 * @param params 查询参数
 * @returns Promise
 */
export function getCustomers(params) {
  const { $axios } = useNuxtApp()
  return $axios.get('/customers', { params })
}

/**
 * 获取单个客户信息
 * @param id 客户ID
 * @returns Promise
 */
export function getCustomer(id) {
  const { $axios } = useNuxtApp()
  return $axios.get(`/customers/${id}`)
}

/**
 * 添加客户
 * @param data 客户数据
 * @returns Promise
 */
export function addCustomer(data) {
  const { $axios } = useNuxtApp()
  return $axios.post('/customers', data)
}

/**
 * 更新客户信息
 * @param id 客户ID
 * @param data 客户数据
 * @returns Promise
 */
export function updateCustomer(id, data) {
  const { $axios } = useNuxtApp()
  return $axios.put(`/customers/${id}`, data)
}

/**
 * 删除客户
 * @param id 客户ID
 * @returns Promise
 */
export function deleteCustomer(id) {
  const { $axios } = useNuxtApp()
  return $axios.delete(`/customers/${id}`)
}
