<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="login-title">订单管理系统</div>
      <el-form :model="form" :rules="rules" ref="formRef" @keyup.enter="handleLogin">
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="handleLogin" :loading="loading">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'empty',
})
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { loginUser } from '~/api/users'
import { useUserStore } from '@/store/user'

const router = useRouter()
const form = ref({
  username: '',
  password: '',
})
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}
const formRef = ref()
const loading = ref(false)
const userStore = useUserStore()

async function handleLogin() {
  formRef.value.validate(async valid => {
    if (!valid) return
    loading.value = true
    try {
      await userStore.login(form.value.username, form.value.password)
      await userStore.fetchUser()
      ElMessage.success('登录成功')
      router.push('/')
    } catch (e: any) {
      ElMessage.error(e.message || '用户名或密码错误')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0e7ff 0%, #f0f2f5 100%);
}
.login-card {
  width: 380px;
  padding: 40px 32px 32px 32px;
  box-shadow: 0 8px 32px 0 rgba(31, 56, 88, 0.15);
  border-radius: 16px;
  background: #fff;
  border: none;
  position: relative;
}
.login-title {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 36px;
  color: #3a5afe;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.login-title::before {
  content: '🌿';
  font-size: 32px;
  margin-right: 8px;
}
.el-form {
  margin-top: 8px;
}
.el-input__wrapper,
.el-input__inner {
  border-radius: 8px !important;
  font-size: 16px;
}
.el-form-item {
  margin-bottom: 28px !important;
}
.el-button {
  border-radius: 8px;
  font-size: 16px;
  height: 44px;
}
</style>
