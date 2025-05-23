import axios from '../plugins/axios'

/**
 * 获取订单列表
 * @param params 查询参数
 * @returns Promise
 */
export function getOrders(params) {
  return axios.get('/orders', { params })
}

/**
 * 获取单个订单信息
 * @param id 订单ID
 * @returns Promise
 */
export function getOrder(id) {
  return axios.get(`/orders/${id}`)
}

/**
 * 添加订单
 * @param data 订单数据
 * @returns Promise
 */
export function addOrder(data) {
  return axios.post('/orders', data)
}

/**
 * 更新订单信息
 * @param id 订单ID
 * @param data 订单数据
 * @returns Promise
 */
export function updateOrder(id, data) {
  return axios.put(`/orders/${id}`, data)
}

/**
 * 删除订单
 * @param id 订单ID
 * @returns Promise
 */
export function deleteOrder(id) {
  return axios.delete(`/orders/${id}`)
}