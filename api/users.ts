import { useNuxtApp } from '#app'

// 使用 Nuxt 插件注入的 axios 实例（plugins/axios.ts），通过 useNuxtApp().$axios 调用

export function getUsers(params) {
  const { $axios } = useNuxtApp()
  return $axios.get('/users', { params })
}

export function getUser(id) {
  const { $axios } = useNuxtApp()
  return $axios.get(`/users/${id}`)
}

export function addUser(data) {
  const { $axios } = useNuxtApp()
  return $axios.post('/users', data)
}

export function updateUser(id, data) {
  const { $axios } = useNuxtApp()
  return $axios.put(`/users/${id}`, data)
}

export function deleteUser(id) {
  const { $axios } = useNuxtApp()
  return $axios.delete(`/users/${id}`)
}

export function updateUserPassword(id, data) {
  const { $axios } = useNuxtApp()
  return $axios.put(`/users/${id}/password`, data)
}

// 登录接口，调用 /user，action=login
export function loginUser({ username, password }) {
  const { $axios } = useNuxtApp()
  return $axios.post('/users', { action: 'login', username, password })
}
