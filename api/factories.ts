import { useNuxtApp } from '#app'

/**
 * 获取工厂列表
 * @param params 查询参数
 * @returns Promise
 */
export function getFactories(params) {
  const { $axios } = useNuxtApp()
  return $axios.get('/factories', { params })
}

/**
 * 获取单个工厂信息
 * @param id 工厂ID
 * @returns Promise
 */
export function getFactory(id) {
  const { $axios } = useNuxtApp()
  return $axios.get(`/factories/${id}`)
}

/**
 * 添加工厂
 * @param data 工厂数据
 * @returns Promise
 */
export function addFactory(data) {
  const { $axios } = useNuxtApp()
  return $axios.post('/factories', data)
}

/**
 * 更新工厂信息
 * @param id 工厂ID
 * @param data 工厂数据
 * @returns Promise
 */
export function updateFactory(id, data) {
  const { $axios } = useNuxtApp()
  delete data._id
  return $axios.put(`/factories/${id}`, data)
}

/**
 * 删除工厂
 * @param id 工厂ID
 * @returns Promise
 */
export function deleteFactory(id) {
  const { $axios } = useNuxtApp()
  return $axios.delete(`/factories/${id}`)
}