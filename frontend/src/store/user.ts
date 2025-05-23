import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUser, loginUser, updateUser, updateUserPassword } from '@/api/users'

const EXPIRE_KEY = 'user_expire'
const EXPIRE_MS = 1000 * 60 * 60 * 24 // 24小时

interface UserInfo {
  id: string
  username: string
  role: string
  email: string
  status: string
}

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const user = ref<UserInfo>({
    id: '',
    username: '',
    role: '',
    email: '',
    status: '',
  })
  // token
  const token = ref('')
  const userId = ref('')
  // 在每次登录/更新时设置过期时间
  function setExpire() {
    localStorage.setItem(EXPIRE_KEY, (Date.now() + EXPIRE_MS).toString())
  }

  function clearExpire() {
    localStorage.removeItem(EXPIRE_KEY)
  }

  // 登录
  async function login(username: string, password: string) {
    try {
      const res = await loginUser({ username, password })
      if (res.code === 0) {
        const { token: tokenValue, user } = res.data
        token.value = tokenValue
        userId.value = user.id
        // 先存token到localStorage，保证axios拦截器能获取
        localStorage.setItem('token', tokenValue)
        setExpire() // 设置过期时间
        await fetchUser()
        return true
      } else {
        logout()
        throw new Error(res.data.message || '登录失败')
      }
    } catch (e: any) {
      logout()
      throw new Error(e.message || '登录失败')
    }
  }

  // 获取用户信息
  async function fetchUser() {
    if (!userId.value) return
    const res = await getUser(userId.value)
    Object.assign(user.value, res.data)
  }

  // 更新用户资料
  async function updateProfile(data: Partial<UserInfo>) {
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
  if (typeof window !== 'undefined' && isExpired()) {
    logout()
  }

  return { user, token, login, fetchUser, updateProfile, changePassword, logout }
}, {
  persist: true // 简单写法，全部持久化
}) 