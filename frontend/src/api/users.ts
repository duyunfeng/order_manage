import axios from '../plugins/axios'

export function getUsers(params) {
  return axios.get('/users', { params })
}

export function getUser(id) {
  return axios.get(`/users/${id}`)
}

export function addUser(data) {
  return axios.post('/users', data)
}

export function updateUser(id, data) {
  return axios.put(`/users/${id}`, data)
}

export function deleteUser(id) {
  return axios.delete(`/users/${id}`)
}

export function updateUserPassword(id, data) {
  return axios.put(`/users/${id}/password`, data)
}

// 登录接口，调用 /user，action=login
export function loginUser({ username, password }) {
  return axios.post('/users', { action: 'login', username, password })
}
