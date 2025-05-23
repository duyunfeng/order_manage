import axios from '../plugins/axios'

/**
 * 获取商品列表
 * @param params 查询参数
 * @returns Promise
 */
export function getGoods(params) {
  return axios.get('/goods', { params })
}

/**
 * 获取单个商品信息
 * @param id 商品ID
 * @returns Promise
 */
export function getGood(id) {
  return axios.get(`/goods/${id}`)
}

/**
 * 添加商品
 * @param data 商品数据
 * @returns Promise
 */
export function addGood(data) {
  return axios.post('/goods', data)
}

/**
 * 更新商品信息
 * @param id 商品ID
 * @param data 商品数据
 * @returns Promise
 */
export function updateGood(id, data) {
  return axios.put(`/goods/${id}`, data)
}

/**
 * 删除商品
 * @param id 商品ID
 * @returns Promise
 */
export function deleteGood(id) {
  return axios.delete(`/goods/${id}`)
}