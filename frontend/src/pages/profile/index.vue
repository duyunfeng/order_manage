<template>
  <el-row justify="center" style="margin-top: 40px">
    <el-col :span="12">
      <el-card class="profile-card">
        <template v-if="isLoading">
          <el-skeleton :rows="5" animated>
            <template #template>
              <div style="display: flex; align-items: center">
                <el-skeleton-item
                  variant="avatar"
                  style="width: 64px; height: 64px; margin-right: 24px"
                />
                <div style="flex: 1">
                  <el-skeleton-item variant="h3" style="width: 30%" />
                  <el-skeleton-item variant="text" style="margin-top: 8px; width: 50%" />
                  <el-skeleton-item variant="text" style="margin-top: 8px; width: 60%" />
                  <el-skeleton-item variant="text" style="margin-top: 8px; width: 40%" />
                </div>
              </div>
              <div style="margin-top: 24px; display: flex">
                <el-skeleton-item
                  variant="button"
                  style="width: 100px; height: 32px; margin-right: 16px"
                />
                <el-skeleton-item variant="button" style="width: 100px; height: 32px" />
              </div>
            </template>
          </el-skeleton>
        </template>
        <template v-else>
          <div style="display: flex; align-items: center">
            <el-avatar :size="64" style="margin-right: 24px">
              <template v-if="user.avatar">
                <img :src="user.avatar" style="width: 64px; height: 64px; object-fit: cover" />
              </template>
              <template v-else>
                <i class="el-icon-user"></i>
              </template>
            </el-avatar>
            <div>
              <h2>{{ user.username }}</h2>
              <p>角色：{{ user.role }}</p>
              <p>邮箱：{{ user.email }}</p>
              <p>状态：{{ statusMap[user.status] }}</p>
            </div>
          </div>
          <div style="margin-top: 24px">
            <el-button type="primary" @click="openEdit">编辑资料</el-button>
            <el-button type="warning" @click="showPwd = true" style="margin-left: 16px"
              >修改密码</el-button
            >
          </div>
        </template>
      </el-card>
    </el-col>
  </el-row>

  <!-- 编辑资料弹窗 -->
  <BaseDialogForm
    v-model="showEdit"
    title="编辑资料"
    :fields="editFields"
    :formData="editForm"
    @submit="submitEdit"
  >
    <template #avatar="{ form }">
      <ImageUpload v-model="form.avatar" @file-change="file => (form.avatarFile = file)" />
    </template>
  </BaseDialogForm>

  <!-- 修改密码弹窗 -->
  <BaseDialogForm
    v-model="showPwd"
    title="修改密码"
    :fields="pwdFields"
    :formData="pwdForm"
    @submit="submitPwd"
  />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getUser } from '@/api/users'
import { useUserStore } from '@/store/user'
import ImageUpload from '@/components/ImageUpload.vue'
import { uploadFile } from '@/api/upload'
import BaseDialogForm from '@/components/BaseDialogForm.vue'

const isLoading = ref(true)
const statusMap = {
  active: '正常',
  inactive: '禁用',
}
const userStore = useUserStore()
const user = ref({
  id: userStore.user?.id || '',
  username: userStore.user?.username || '',
  role: userStore.user?.role || '',
  email: userStore.user?.email || '',
  status: userStore.user?.status || '',
  avatar: userStore.user?.avatar || '',
})

const showEdit = ref(false)
const showPwd = ref(false)
const editForm = reactive({
  username: '',
  role: '',
  email: '',
  status: '',
  avatar: '',
  avatarFile: null,
})

const pwdForm = reactive({
  oldPwd: '',
  newPwd: '',
  confirmPwd: '',
})
const pwdFormRef = ref()
const pwdRules = {
  oldPwd: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  confirmPwd: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value) => value === pwdForm.newPwd,
      message: '两次输入密码不一致',
      trigger: 'blur',
    },
  ],
}

// 编辑资料弹窗 fields 配置
const editFields = [
  {
    prop: 'avatar',
    label: '头像',
    type: 'custom-upload',
    placeholder: '请上传头像',
  },
  {
    prop: 'username',
    label: '用户名',
    type: 'input',
    placeholder: '请输入用户名',
    rules: [{ required: true, message: '必填' }],
  },
  {
    prop: 'role',
    label: '角色',
    type: 'input',
    placeholder: '角色不可修改',
    disabled: true,
    rules: [{ required: true, message: '必填' }],
  },
  {
    prop: 'email',
    label: '邮箱',
    type: 'input',
    placeholder: '请输入邮箱',
  },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    options: [
      { label: '正常', value: 'active' },
      { label: '禁用', value: 'inactive' },
    ],
    rules: [{ required: true, message: '必填' }],
  },
]

// 修改密码弹窗 fields 配置
const pwdFields = [
  {
    prop: 'oldPwd',
    label: '原密码',
    type: 'input',
    placeholder: '请输入原密码',
    inputType: 'password',
    rules: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  },
  {
    prop: 'newPwd',
    label: '新密码',
    type: 'input',
    placeholder: '请输入新密码',
    inputType: 'password',
    rules: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  },
  {
    prop: 'confirmPwd',
    label: '确认新密码',
    type: 'input',
    placeholder: '请确认新密码',
    inputType: 'password',
    rules: [
      { required: true, message: '请确认新密码', trigger: 'blur' },
      {
        validator: (rule, value) => value === pwdForm.newPwd,
        message: '两次输入密码不一致',
        trigger: 'blur',
      },
    ],
  },
]

async function fetchUser() {
  isLoading.value = true
  try {
    // 实际项目应从登录信息获取当前用户id
    const res = await getUser(userStore.user.id)
    Object.assign(user.value, res.data || res)
  } catch (error) {
    console.error('Failed to fetch user data:', error)
    ElMessage.error('获取用户信息失败')
  } finally {
    isLoading.value = false
  }
}
onMounted(fetchUser)

function openEdit() {
  Object.assign(editForm, user.value)
  showEdit.value = true
}
function submitEdit() {
  const doUpdate = async () => {
    const data = { ...editForm }
    delete data.avatarFile
    userStore.updateProfile(data).then(() => {
      showEdit.value = false
      ElMessage.success('资料修改成功')
      fetchUser()
    })
  }
  if (editForm.avatarFile) {
    uploadFile(editForm.avatarFile).then(url => {
      editForm.avatar = url
      doUpdate()
    })
  } else {
    doUpdate()
  }
}

function submitPwd() {
  pwdFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    if (pwdForm.newPwd !== pwdForm.confirmPwd) {
      ElMessage.error('两次输入密码不一致')
      return
    }
    await userStore.changePassword(pwdForm.oldPwd, pwdForm.newPwd)
    showPwd.value = false
    ElMessage.success('密码修改成功')
    pwdForm.oldPwd = pwdForm.newPwd = pwdForm.confirmPwd = ''
  })
}
</script>

<style scoped>
.profile-card {
  border-radius: 16px;
  box-shadow: 0 4px 24px 0 rgba(31, 56, 88, 0.1);
  padding: 32px 32px 24px 32px;
  margin-bottom: 24px;
  transition: background 0.3s;
}
:global(html.dark) .profile-card {
  background: #23272e;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.45);
  border: 1px solid #23272e;
}
:global(html.dark) .el-card__body {
  background: #23272e !important;
}
:global(html.dark) .el-dialog {
  background: #23272e !important;
  color: #e0e6ed !important;
}
:global(html.dark) .el-input__wrapper {
  background: #23272e !important;
  color: #e0e6ed !important;
  border-color: #30343b !important;
}
:global(html.dark) .el-button {
  background: #23272e !important;
  color: #8ec8ff !important;
  border-color: #30343b !important;
}
</style>
