import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUser, loginUser, updateUser, updateUserPassword } from '@/api/users'

const EXPIRE_KEY = 'user_expire'
const EXPIRE_MS = 1000 * 60 * 60 * 24 // 24小时

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const user = ref({
    id: '',
    username: '',
    role: '',
    email: '',
    status: '',
  })
  // token
  const token = ref('')

  // 在每次登录/更新时设置过期时间
  function setExpire() {
    localStorage.setItem(EXPIRE_KEY, (Date.now() + EXPIRE_MS).toString())
  }

  function clearExpire() {
    localStorage.removeItem(EXPIRE_KEY)
  }

  // 登录
  async function login(username: string, password: string) {
    const res = await loginUser({ username, password })
    if (res.data.code === 0) {
      token.value = res.data.data.token
      user.value.id = res.data.data.user.id
      // 登录后获取用户信息
      await fetchUser()
      setExpire() // 设置过期时间
      return true
    } else {
      throw new Error(res.data.message || '登录失败')
    }
  }

  // 获取用户信息
  async function fetchUser() {
    // 假设后端返回 token 里有用户 id，或后端能通过 token 识别用户
    const res = await getUser(user.value.id) // 推荐后端支持 /users/me
    Object.assign(user.value, res.data.data)
  }

  // 更新用户资料
  async function updateProfile(data: any) {
    const res = await updateUser(user.value.id, data)
    Object.assign(user.value, data)
    return res
  }

  // 修改密码
  async function changePassword(oldPassword: string, newPassword: string) {
    return await updateUserPassword(user.value.id, { oldPassword, newPassword })
  }

  // 登出
  function logout() {
    token.value = ''
    user.value = { id: '', username: '', role: '', email: '', status: '' }
    clearExpire()
  }

  // 检查是否过期
  function isExpired() {
    const expire = localStorage.getItem(EXPIRE_KEY)
    return expire && Date.now() > Number(expire)
  }

  // 应用启动时自动检查
  if (process.client && isExpired()) {
    logout()
  }

  return { user, token, login, fetchUser, updateProfile, changePassword, logout }
}, {
  persist: true // 简单写法，全部持久化
}) 